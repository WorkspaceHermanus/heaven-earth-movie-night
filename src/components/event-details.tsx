import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion";
import { cn } from "@/lib/utils";
import { EVENT, formatZAR } from "@/lib/event";

/**
 * Alternating tile treatments lifted from the mood board: solid dusty-rose
 * blocks with an inset keyline, plain white tiles with a hairline frame,
 * and warm cream tiles.
 */
const TILE_STYLES = [
  "bg-sand-500 text-white",
  "border border-sand-200 bg-white",
  "bg-blush-100",
] as const;

export function EventDetails({ remaining }: { remaining: number }) {
  const items = [
    {
      label: "Date",
      value: EVENT.dateLabel,
      hint: "Women's Day weekend",
    },
    {
      label: "Time",
      value: `Worship ${EVENT.doorsOpen}`,
      hint: `Movie 6:00 – 8:00 PM · Prayer to 8:30`,
    },
    {
      label: "Venue",
      value: EVENT.venueFull,
      hint: EVENT.venueAddressShort,
    },
    {
      label: "Ticket price",
      value: formatZAR(EVENT.ticketPriceCents),
      hint: "per person",
    },
    {
      label: "Capacity",
      value: `${EVENT.capacity} tickets only`,
      hint:
        remaining > 0
          ? `${remaining} still available`
          : "This event is fully booked",
    },
  ];

  return (
    <section id="details" className="section scroll-mt-20 bg-white">
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

        <StaggerGroup className="mt-16 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {items.map((item, index) => {
            const style = TILE_STYLES[index % TILE_STYLES.length];
            const onRose = style === TILE_STYLES[0];

            return (
              <StaggerItem key={item.label} className="h-full">
                <div className={cn("h-full p-2.5", style)}>
                  {/* Inset keyline, like the framed tiles on the mood board. */}
                  <div
                    className={cn(
                      "flex h-full flex-col items-center justify-center border px-4 py-8 text-center sm:px-6 sm:py-12",
                      onRose ? "border-white/30" : "border-sand-300/60",
                    )}
                  >
                    <span
                      className={cn(
                        "block h-px w-8",
                        onRose ? "bg-white/50" : "bg-sand-400/70",
                      )}
                      aria-hidden
                    />
                    <p
                      className={cn(
                        "mt-5 text-[0.65rem] uppercase tracking-[0.3em]",
                        onRose ? "text-white/80" : "text-muted-foreground",
                      )}
                    >
                      {item.label}
                    </p>
                    <p
                      className={cn(
                        "mt-3 font-display text-2xl font-light leading-snug sm:text-3xl",
                        onRose ? "text-white" : "text-foreground",
                      )}
                    >
                      {item.value}
                    </p>
                    <p
                      className={cn(
                        "mt-2 text-sm",
                        onRose ? "text-white/75" : "text-muted-foreground",
                      )}
                    >
                      {item.hint}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}

          {/* Sixth tile balances the grid: a quiet pull-quote, mood-board style. */}
          <StaggerItem className="h-full">
            <div className="h-full bg-blush-50 p-2.5">
              <div className="flex h-full flex-col items-center justify-center border border-sand-300/60 px-4 py-8 text-center sm:px-6 sm:py-12">
                <span
                  className="font-display text-5xl leading-none text-sand-400"
                  aria-hidden
                >
                  &ldquo;
                </span>
                <p className="mt-2 font-display text-xl font-light italic leading-relaxed text-sand-700">
                  Come as you are, leave a little lighter.
                </p>
              </div>
            </div>
          </StaggerItem>
        </StaggerGroup>
      </div>
    </section>
  );
}
