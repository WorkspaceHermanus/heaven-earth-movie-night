/**
 * Single source of truth for the event. Everything user-facing — page copy,
 * emails, structured data, price validation — reads from here.
 */
export const EVENT = {
  name: "Women's Day Movie Night",
  host: "Heaven & Earth Hermanus",
  venue: "Volmoed",
  venueAddress: "Hemel en Aarde Valley, Farm 11, R320, Hermanus, 7200",
  venueAddressShort: "Hemel en Aarde Valley, Hermanus",
  /** ISO date of the event, used for structured data and email copy. */
  date: "2026-08-09",
  dateLabel: "Sunday, 9 August",
  doorsOpen: "6:30 PM",
  startTime: "7:00 PM",
  doorsOpenISO: "2026-08-09T18:30:00+02:00",
  endISO: "2026-08-09T21:30:00+02:00",
  /** Ticket price in cents (ZAR). R50.00 */
  ticketPriceCents: 5000,
  capacity: 40,
  minTickets: 1,
  maxTickets: 6,
  currency: "ZAR",
  contactEmail: "hello@heavenandearthhermanus.co.za",
  contactPhone: "+27 82 000 0000",
  instagram: "https://www.instagram.com/heavenandearthhermanus",
  facebook: "https://www.facebook.com/heavenandearthhermanus",
} as const;

export const WHAT_TO_BRING = [
  {
    title: "Your favourite pillow",
    description: "The comfier the better — this is a settle-in kind of evening.",
  },
  {
    title: "A warm blanket",
    description: "August evenings in the Overberg have a bite. Come prepared.",
  },
  {
    title: "Comfortable clothes",
    description: "Think soft, warm and easy. No dress code, no fuss.",
  },
  {
    title: "A relaxed heart",
    description: "Arrive early, find your spot and enjoy the company.",
  },
] as const;

/** Formats an amount in cents as South African Rand. */
export function formatZAR(cents: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}
