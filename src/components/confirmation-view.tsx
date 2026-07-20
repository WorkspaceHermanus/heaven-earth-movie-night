"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Loader2, Mail, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BrandMark } from "@/components/brand-mark";
import { EVENT, formatZAR } from "@/lib/event";

export type PublicBooking = {
  reference: string;
  firstName: string;
  lastName: string;
  quantity: number;
  totalAmount: number;
  status: string;
};

/**
 * Yoco redirects the customer back the instant the card clears, which can be
 * a beat before the webhook reaches us. Rather than showing a scary "not
 * paid" state, poll briefly and settle into the confirmation.
 */
export function ConfirmationView({ initial }: { initial: PublicBooking }) {
  const [booking, setBooking] = useState(initial);
  const [settling, setSettling] = useState(initial.status === "PENDING");

  useEffect(() => {
    if (booking.status !== "PENDING") {
      setSettling(false);
      return;
    }

    let cancelled = false;
    let tries = 0;

    const poll = async () => {
      tries += 1;
      try {
        const res = await fetch(`/api/booking/${booking.reference}`, {
          cache: "no-store",
        });
        if (res.ok && !cancelled) {
          const next = (await res.json()) as PublicBooking;
          setBooking(next);
          if (next.status !== "PENDING") {
            setSettling(false);
            return;
          }
        }
      } catch {
        /* keep waiting */
      }

      if (!cancelled) {
        // Give up after ~30s and let the customer contact us.
        if (tries >= 15) setSettling(false);
        else setTimeout(poll, 2000);
      }
    };

    const timer = setTimeout(poll, 1500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [booking.reference, booking.status]);

  if (settling) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <Loader2 className="size-7 animate-spin text-sand-500" aria-hidden />
        <p className="mt-6 font-display text-2xl text-foreground">
          Confirming your payment…
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          This usually takes just a moment.
        </p>
      </div>
    );
  }

  if (booking.status !== "PAID") {
    return (
      <Card className="mx-auto max-w-lg p-10 text-center">
        <h1 className="font-display text-3xl text-foreground">
          We&rsquo;re still waiting on your payment
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Your booking reference is{" "}
          <strong className="text-foreground">{booking.reference}</strong>. If
          you completed payment, it may still be clearing — you&rsquo;ll get an
          email as soon as it does. Otherwise please contact us at{" "}
          <a
            className="text-sand-600 underline underline-offset-4"
            href={`mailto:${EVENT.contactEmail}`}
          >
            {EVENT.contactEmail}
          </a>
          .
        </p>
        <Button asChild variant="outline" className="mt-8">
          <Link href="/">Back to the event</Link>
        </Button>
      </Card>
    );
  }

  const rows = [
    ["Guest", `${booking.firstName} ${booking.lastName}`],
    ["Tickets", `${booking.quantity} ${booking.quantity === 1 ? "ticket" : "tickets"}`],
    ["Amount paid", formatZAR(booking.totalAmount)],
    ["Date", EVENT.dateLabel],
    ["Doors open", EVENT.doorsOpen],
    ["Movie starts", EVENT.startTime],
    ["Venue", EVENT.venue],
  ] as const;

  return (
    <div className="mx-auto max-w-xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="text-center">
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex size-16 items-center justify-center rounded-full bg-sand-500 text-white"
          >
            <Check className="size-7" aria-hidden />
          </motion.span>

          <h1 className="mt-8 font-display text-4xl font-light leading-tight text-foreground sm:text-5xl">
            Thank you for your booking.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
            You&rsquo;re all set for {EVENT.name}. We can&rsquo;t wait to see
            you at {EVENT.venue}.
          </p>
        </div>

        <Card className="print-plain mt-12 overflow-hidden">
          <div className="border-b border-sand-200/70 bg-sand-50/70 px-8 py-7 text-center">
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-muted-foreground">
              Booking reference
            </p>
            <p className="mt-2 font-mono text-3xl font-semibold tracking-[0.12em] text-sand-600">
              {booking.reference}
            </p>
          </div>

          <dl className="divide-y divide-sand-200/70 px-8">
            {rows.map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-6 py-4"
              >
                <dt className="text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                  {label}
                </dt>
                <dd className="text-right text-sm font-medium text-foreground">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="border-t border-sand-200/70 bg-blush-50/70 px-8 py-6">
            <p className="font-display text-lg text-foreground">
              Remember to bring
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Your favourite pillow, a warm blanket, and comfortable clothes.
            </p>
          </div>
        </Card>

        <div className="mt-8 flex items-start gap-3 rounded-2xl bg-sand-100/70 p-5 text-sm text-muted-foreground">
          <Mail className="mt-0.5 size-4 shrink-0 text-sand-600" aria-hidden />
          <p>
            A confirmation email has been sent to you with all of these details.
            If it hasn&rsquo;t arrived in a few minutes, please check your spam
            folder.
          </p>
        </div>

        <div className="no-print mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => window.print()} variant="outline">
            <Printer className="size-4" aria-hidden />
            Print or save as PDF
          </Button>
          <Button asChild variant="ghost">
            <Link href="/">Back to the event</Link>
          </Button>
        </div>

        <div className="mt-14 flex flex-col items-center gap-3 text-center">
          <BrandMark className="h-8 w-8 opacity-60" />
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Hosted by {EVENT.host}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
