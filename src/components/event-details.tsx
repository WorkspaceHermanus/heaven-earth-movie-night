import { CalendarDays, Clock, MapPin, Ticket, Users } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion";
import { Card } from "@/components/ui/card";
import { EVENT, formatZAR } from "@/lib/event";

export function EventDetails({ remaining }: { remaining: number }) {
  const items = [
    {
      icon: CalendarDays,
      label: "Date",
      value: EVENT.dateLabel,
      hint: "Women's Day weekend",
    },
    {
      icon: Clock,
      label: "Time",
      value: `Doors ${EVENT.doorsOpen}`,
      hint: `Movie starts ${EVENT.startTime}`,
    },
    {
      icon: MapPin,
      label: "Venue",
      value: EVENT.venue,
      hint: EVENT.venueAddress,
    },
    {
      icon: Ticket,
      label: "Ticket price",
      value: formatZAR(EVENT.ticketPriceCents),
      hint: "per person",
    },
    {
      icon: Users,
      label: "Capacity",
      value: `${EVENT.capacity} tickets only`,
      hint:
        remaining > 0
          ? `${remaining} still available`
          : "This event is fully booked",
    },
  ];

  return (
    <section id="details" className="section scroll-mt-20">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">The Evening</p>
          <h2 className="mt-5 font-display text-4xl font-light leading-tight text-foreground sm:text-5xl">
            Everything you need to know
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            A warm, unhurried evening together — good company, a good film, and
            no rush to be anywhere else.
          </p>
        </Reveal>

        <StaggerGroup className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <StaggerItem key={item.label}>
              <Card className="group h-full p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-sand-100 text-sand-600 transition-colors duration-500 group-hover:bg-sand-500 group-hover:text-white">
                  <item.icon className="size-5" aria-hidden />
                </span>
                <p className="mt-6 text-[0.7rem] uppercase tracking-[0.24em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-2 font-display text-2xl leading-snug text-foreground">
                  {item.value}
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {item.hint}
                </p>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
