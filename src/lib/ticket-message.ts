import { EVENT, formatZAR } from "@/lib/event";
import { getAppUrl } from "@/lib/utils";

/**
 * Ticket copy and URLs, kept free of any server-only code so both the
 * webhook sender and the admin dashboard (a client component) can import it
 * without pulling API credentials into the browser bundle.
 */

/** Minimal shape the message needs — satisfied by a full Prisma Booking. */
export type TicketFields = {
  reference: string;
  firstName: string;
  quantity: number;
  totalAmount: number;
};

/** Raw ticket image — used as the WhatsApp template's header image. */
export function ticketImageUrl(reference: string, origin?: string) {
  return `${origin || getAppUrl()}/api/ticket/${encodeURIComponent(reference)}`;
}

/**
 * Shareable ticket page. This is the URL that goes in messages: it carries
 * Open Graph tags, so WhatsApp renders the ticket as a rich preview card
 * rather than the bare-link box a raw image URL produces.
 */
export function ticketPageUrl(reference: string, origin?: string) {
  return `${origin || getAppUrl()}/t/${encodeURIComponent(reference)}`;
}

/**
 * The message body, in one place so the automated send and the admin's
 * manual link say exactly the same thing.
 *
 * Emoji here are deliberately plain code points — no U+FE0F variation
 * selectors, which some WhatsApp builds render as a replacement glyph.
 */
export function ticketMessage(booking: TicketFields, origin?: string): string {
  return [
    `🎉 *Your ticket is confirmed!*`,
    ``,
    `Hi ${booking.firstName}, thank you for booking *${EVENT.name}*.`,
    ``,
    `*Reference:* ${booking.reference}`,
    `*Tickets:* ${booking.quantity}  ·  *Paid:* ${formatZAR(booking.totalAmount)}`,
    ``,
    `📅 ${EVENT.dateLabel}`,
    `🎵 Worship 5:00 PM`,
    `🎬 War Room 6:00 PM`,
    `🙏 Prayer & ministry 8:00 PM`,
    `📍 ${EVENT.venueFull}, Hemel en Aarde Valley`,
    ``,
    `*Bring:* pillow, blanket, warm clothes, your own snacks & drinks, notebook & pen`,
    ``,
    ticketPageUrl(booking.reference, origin),
    ``,
    `See you there! 💛`,
    `${EVENT.host}`,
  ].join("\n");
}
