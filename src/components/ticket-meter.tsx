import { cn } from "@/lib/utils";
import { EVENT } from "@/lib/event";

/**
 * Live availability indicator. Turns amber under ten tickets and rose when
 * the event is full, so scarcity reads at a glance without shouting.
 */
export function TicketMeter({ remaining }: { remaining: number }) {
  const taken = Math.min(EVENT.capacity, EVENT.capacity - remaining);
  const percent = Math.round((taken / EVENT.capacity) * 100);
  const soldOut = remaining <= 0;
  const low = !soldOut && remaining <= 8;

  const headline = soldOut
    ? "This event is fully booked"
    : low
      ? `Only ${remaining} ticket${remaining === 1 ? "" : "s"} left`
      : `${remaining} of ${EVENT.capacity} tickets remaining`;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <p
          aria-live="polite"
          className={cn(
            "text-sm font-medium",
            soldOut ? "text-rose-700" : low ? "text-amber-700" : "text-sand-700",
          )}
        >
          {headline}
        </p>
        <p className="text-xs tabular-nums text-muted-foreground">
          {taken}/{EVENT.capacity}
        </p>
      </div>

      <div
        className="mt-3 h-1 w-full overflow-hidden bg-sand-200/70"
        role="progressbar"
        aria-valuenow={taken}
        aria-valuemin={0}
        aria-valuemax={EVENT.capacity}
        aria-label="Tickets sold"
      >
        <div
          className={cn(
            "h-full transition-[width] duration-700 ease-out",
            soldOut ? "bg-rose-400" : low ? "bg-amber-400" : "bg-sand-500",
          )}
          style={{ width: `${Math.max(percent, 2)}%` }}
        />
      </div>
    </div>
  );
}
