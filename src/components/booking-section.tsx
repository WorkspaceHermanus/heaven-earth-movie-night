import { BookingForm } from "@/components/booking-form";
import { TicketMeter } from "@/components/ticket-meter";
import { Reveal } from "@/components/motion";
import { Card } from "@/components/ui/card";
import { EVENT, formatZAR } from "@/lib/event";

export function BookingSection({ remaining }: { remaining: number }) {
  const soldOut = remaining <= 0;

  return (
    <section id="book" className="aurora section scroll-mt-20">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Reserve Your Seat</p>
          <h2 className="mt-5 font-display text-4xl font-light leading-tight text-foreground sm:text-5xl">
            {soldOut ? "Tickets are closed" : "Book your tickets"}
          </h2>
          {!soldOut && (
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {formatZAR(EVENT.ticketPriceCents)} per person. Payment is handled
              securely by Yoco, and your confirmation arrives by email the
              moment it clears.
            </p>
          )}
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-14 max-w-xl">
          <Card className="p-8 shadow-lift sm:p-10">
            <div className="mb-8">
              <TicketMeter remaining={remaining} />
            </div>
            <BookingForm remaining={remaining} />
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
