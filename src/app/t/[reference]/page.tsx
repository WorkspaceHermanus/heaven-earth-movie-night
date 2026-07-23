import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, MessageCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand-mark";
import { EVENT, formatZAR } from "@/lib/event";
import { waLink } from "@/lib/phone";
import { getAppUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getBooking(reference: string) {
  return prisma.booking.findUnique({
    where: { reference },
    select: {
      reference: true,
      firstName: true,
      lastName: true,
      quantity: true,
      totalAmount: true,
      status: true,
    },
  });
}

/**
 * Open Graph tags so WhatsApp (and Messenger, iMessage, Signal) render the
 * ticket itself as a rich preview card instead of a bare link. This page is
 * what gets shared; /api/ticket/<ref> is the raw image behind it.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ reference: string }>;
}): Promise<Metadata> {
  const { reference } = await params;
  const booking = await getBooking(reference);

  if (!booking || booking.status !== "PAID") {
    return { title: "Ticket not found", robots: { index: false } };
  }

  const title = `${booking.quantity === 1 ? "Ticket" : `${booking.quantity} Tickets`} · ${EVENT.name}`;
  const description = `${booking.firstName} ${booking.lastName} · ${EVENT.dateLabel} · ${EVENT.venueFull}, Hemel en Aarde Valley. Reference ${booking.reference}.`;
  const image = `${getAppUrl()}/api/ticket/${encodeURIComponent(booking.reference)}`;

  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      type: "article",
      title,
      description,
      siteName: EVENT.host,
      images: [{ url: image, width: 1080, height: 1350, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function TicketPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const booking = await getBooking(reference);

  if (!booking || booking.status !== "PAID") notFound();

  const imageSrc = `/api/ticket/${encodeURIComponent(booking.reference)}`;

  return (
    <main id="main" className="aurora min-h-screen py-14">
      <div className="container max-w-xl">
        <div className="flex flex-col items-center text-center">
          <BrandMark className="h-9 w-9" />
          <p className="mt-4 text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground">
            {EVENT.host}
          </p>
          <h1 className="mt-5 font-display text-3xl font-light leading-tight text-foreground sm:text-4xl">
            {booking.firstName}&rsquo;s ticket
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {booking.quantity} {booking.quantity === 1 ? "ticket" : "tickets"}{" "}
            &middot; {formatZAR(booking.totalAmount)} paid &middot;{" "}
            {booking.reference}
          </p>
        </div>

        <div className="mt-9 border border-sand-300/70 bg-white p-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={`Ticket for ${booking.firstName} ${booking.lastName}`}
            width={1080}
            height={1350}
            className="h-auto w-full"
          />
        </div>

        <div className="no-print mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild variant="outline">
            <a href={EVENT.mapsUrl} target="_blank" rel="noopener noreferrer">
              <MapPin className="size-4" aria-hidden />
              Directions
            </a>
          </Button>
          <Button asChild variant="outline">
            <a
              href={waLink(
                EVENT.contactPhone,
                `Hi ${EVENT.contactName}, I have a question about booking ${booking.reference}.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="size-4" aria-hidden />
              WhatsApp {EVENT.contactName}
            </a>
          </Button>
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Please show this ticket at the door.{" "}
          <Link href="/" className="underline underline-offset-4">
            Event details
          </Link>
        </p>
      </div>
    </main>
  );
}
