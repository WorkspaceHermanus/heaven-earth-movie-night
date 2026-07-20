"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Lock, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EVENT, formatZAR } from "@/lib/event";
import { bookingSchema, type BookingInput } from "@/lib/validation";
import { cn } from "@/lib/utils";

type Props = {
  remaining: number;
};

export function BookingForm({ remaining: initialRemaining }: Props) {
  const [remaining, setRemaining] = useState(initialRemaining);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      quantity: 1,
    },
    mode: "onBlur",
  });

  const quantity = Number(watch("quantity")) || 1;
  const total = quantity * EVENT.ticketPriceCents;

  /** Highest number of tickets this booking may take right now. */
  const maxSelectable = Math.max(
    EVENT.minTickets,
    Math.min(EVENT.maxTickets, remaining),
  );

  // Keep the counter honest if tickets sell while the form sits open.
  useEffect(() => {
    if (quantity > maxSelectable) setValue("quantity", maxSelectable);
  }, [quantity, maxSelectable, setValue]);

  // Refresh availability when the tab regains focus, so a returning visitor
  // does not act on a stale number.
  useEffect(() => {
    const refresh = async () => {
      try {
        const res = await fetch("/api/availability", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { remaining: number };
        if (typeof data.remaining === "number") setRemaining(data.remaining);
      } catch {
        /* Network hiccup — the server revalidates at checkout anyway. */
      }
    };

    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };

    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  const adjust = (delta: number) => {
    const next = Math.min(maxSelectable, Math.max(EVENT.minTickets, quantity + delta));
    setValue("quantity", next, { shouldValidate: true });
  };

  const onSubmit = async (values: BookingInput) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        if (typeof data?.remaining === "number") setRemaining(data.remaining);
        toast.error(data?.error ?? "We couldn't start your payment. Please try again.");
        return;
      }

      // Hand off to Yoco's hosted checkout.
      window.location.href = data.redirectUrl as string;
    } catch {
      toast.error("Something went wrong. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (remaining <= 0) {
    return <SoldOutPanel />;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-7"
      noValidate
      aria-describedby="booking-availability"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="firstName"
          label="First name"
          error={errors.firstName?.message}
        >
          <Input
            id="firstName"
            autoComplete="given-name"
            placeholder="Anna"
            aria-invalid={Boolean(errors.firstName)}
            {...register("firstName")}
          />
        </Field>

        <Field id="lastName" label="Last name" error={errors.lastName?.message}>
          <Input
            id="lastName"
            autoComplete="family-name"
            placeholder="Botha"
            aria-invalid={Boolean(errors.lastName)}
            {...register("lastName")}
          />
        </Field>
      </div>

      <Field id="email" label="Email address" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="anna@example.co.za"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
      </Field>

      <Field id="phone" label="Phone number" error={errors.phone?.message}>
        <Input
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="082 123 4567"
          aria-invalid={Boolean(errors.phone)}
          {...register("phone")}
        />
      </Field>

      {/* Ticket stepper */}
      <div className="space-y-3">
        <Label htmlFor="quantity">Number of tickets</Label>
        <div className="flex items-center justify-between border border-sand-200 bg-white p-2.5">
          <StepperButton
            onClick={() => adjust(-1)}
            disabled={quantity <= EVENT.minTickets}
            label="Remove one ticket"
          >
            <Minus className="size-4" aria-hidden />
          </StepperButton>

          <div className="text-center">
            <input type="hidden" {...register("quantity")} />
            <div
              id="quantity"
              aria-live="polite"
              className="font-display text-3xl leading-none text-foreground"
            >
              {quantity}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {quantity === 1 ? "ticket" : "tickets"}
            </div>
          </div>

          <StepperButton
            onClick={() => adjust(1)}
            disabled={quantity >= maxSelectable}
            label="Add one ticket"
          >
            <Plus className="size-4" aria-hidden />
          </StepperButton>
        </div>
        {errors.quantity?.message ? (
          <p className="text-sm text-destructive">{errors.quantity.message}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Up to {EVENT.maxTickets} tickets per booking.
          </p>
        )}
      </div>

      {/* Total */}
      <div className="flex items-baseline justify-between border-t border-sand-200 pt-6">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.24em] text-muted-foreground">
            Total
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {quantity} &times; {formatZAR(EVENT.ticketPriceCents)}
          </p>
        </div>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.p
            key={total}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="font-display text-4xl text-foreground"
          >
            {formatZAR(total)}
          </motion.p>
        </AnimatePresence>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Redirecting to secure checkout…
          </>
        ) : (
          <>Pay {formatZAR(total)} Now</>
        )}
      </Button>

      <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Lock className="size-3.5" aria-hidden />
        Secured by Yoco. Your card details never touch our servers.
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function StepperButton({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-none border border-sand-200 bg-white text-sand-700 transition-all",
        "hover:border-sand-400 hover:bg-sand-50 active:scale-95",
        "disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-sand-200 disabled:hover:bg-white",
      )}
    >
      {children}
    </button>
  );
}

export function SoldOutPanel() {
  return (
    <div className="py-10 text-center">
      <p className="eyebrow">Thank you, Hermanus</p>
      <h3 className="mt-5 font-display text-4xl font-light leading-tight text-foreground">
        This event is fully booked.
      </h3>
      <p className="mx-auto mt-5 max-w-sm text-base leading-relaxed text-muted-foreground">
        Every one of our {EVENT.capacity} tickets has been claimed. Follow us on
        Instagram to hear about the next evening first.
      </p>
    </div>
  );
}
