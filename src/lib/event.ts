/**
 * Single source of truth for the event. Everything user-facing — page copy,
 * emails, structured data, price validation — reads from here.
 */
export const EVENT = {
  name: "Women's Day Movie Night",
  host: "Heaven & Earth Hermanus",
  venue: "Volmoed",
  /** The specific room on the Volmoed property. */
  venueRoom: "Conference Room",
  /** Room + property, for details cards, emails and the confirmation page. */
  venueFull: "Conference Room, Volmoed",
  venueAddress: "Hemel en Aarde Valley, Farm 11, R320, Hermanus, 7200",
  venueAddressShort: "Hemel en Aarde Valley, Hermanus",
  /** Opens the property in Google Maps for directions. */
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Volmoed+Hemel+en+Aarde+Valley+Hermanus",
  /** ISO date of the event, used for structured data and email copy. */
  date: "2026-08-09",
  dateLabel: "Sunday, 9 August",
  /** When the evening opens — worship kicks things off. */
  doorsOpen: "5:00 PM",
  startTime: "6:00 PM",
  doorsOpenISO: "2026-08-09T17:00:00+02:00",
  endISO: "2026-08-09T20:30:00+02:00",
  movie: {
    title: "War Room",
    tagline:
      "A drama about the power of prayer — a family discovers that victory begins in a quiet room.",
    trailerYouTubeId: "mIl-XY9t_Lw",
  },
  schedule: [
    { time: "5:00 – 5:45 PM", title: "Worship" },
    { time: "6:00 – 8:00 PM", title: "Movie · War Room" },
    { time: "8:00 – 8:30 PM", title: "Prayer & ministry" },
  ],
  /** Ticket price in cents (ZAR). R50.00 */
  ticketPriceCents: 5000,
  capacity: 40,
  minTickets: 1,
  maxTickets: 6,
  currency: "ZAR",
  /** Kim handles booking queries — WhatsApp is the contact channel. */
  contactName: "Kim",
  contactPhone: "+27 82 888 2570",
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
    title: "Snacks & drinks",
    description: "Bring your own treats and something to sip through the film.",
  },
  {
    title: "A notebook & pen",
    description: "War Room stirs the heart — you may want to jot something down.",
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
