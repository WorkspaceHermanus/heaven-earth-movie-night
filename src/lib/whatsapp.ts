import type { Booking } from "@prisma/client";
import { EVENT, formatZAR } from "@/lib/event";
import { toE164 } from "@/lib/phone";
import { getAppUrl } from "@/lib/utils";

const GRAPH_VERSION = "v21.0";

export function isWhatsAppConfigured() {
  return Boolean(
    process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID,
  );
}

/** Public URL of the rendered ticket image for a booking. */
export function ticketUrl(reference: string) {
  return `${getAppUrl()}/api/ticket/${encodeURIComponent(reference)}`;
}

/**
 * The message body. Kept in one place so the WhatsApp template, the manual
 * share link and the admin resend all say exactly the same thing.
 */
export function ticketMessage(booking: Booking): string {
  return [
    `🎟️ *Your ticket is confirmed!*`,
    ``,
    `Hi ${booking.firstName}, thank you for booking *${EVENT.name}*.`,
    ``,
    `*Reference:* ${booking.reference}`,
    `*Tickets:* ${booking.quantity}`,
    `*Paid:* ${formatZAR(booking.totalAmount)}`,
    ``,
    `📅 ${EVENT.dateLabel}`,
    `🎵 Worship 5:00 – 5:45 PM`,
    `🎬 War Room 6:00 – 8:00 PM`,
    `🙏 Prayer & ministry 8:00 – 8:30 PM`,
    `📍 ${EVENT.venueFull}, Hemel en Aarde Valley`,
    ``,
    `*Please bring:* your favourite pillow, a warm blanket, comfortable clothes, your own snacks & drinks, and a notebook & pen.`,
    ``,
    `Your ticket: ${ticketUrl(booking.reference)}`,
    ``,
    `See you there! 💛`,
    `${EVENT.host}`,
  ].join("\n");
}

export type WhatsAppResult =
  | { ok: true; id?: string }
  | { ok: false; error: string; skipped?: boolean };

/**
 * Sends the ticket over the WhatsApp Cloud API.
 *
 * Business-initiated messages must use a template Meta has approved, so this
 * sends the template named by WHATSAPP_TEMPLATE_NAME with the ticket image as
 * the header and the guest's details as body variables. Configure the
 * template with an IMAGE header and five body placeholders:
 *
 *   {{1}} first name   {{2}} reference   {{3}} tickets
 *   {{4}} date         {{5}} venue
 *
 * Returns `skipped` rather than throwing when unconfigured, so a missing
 * integration never blocks a booking from completing.
 */
export async function sendTicketWhatsApp(
  booking: Booking,
): Promise<WhatsAppResult> {
  if (!isWhatsAppConfigured()) {
    return { ok: false, error: "WhatsApp is not configured", skipped: true };
  }

  const to = toE164(booking.phone);
  if (!to) {
    return {
      ok: false,
      error: `Unusable phone number: ${booking.phone}`,
      skipped: true,
    };
  }

  const token = process.env.WHATSAPP_TOKEN!;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID!;
  const template = process.env.WHATSAPP_TEMPLATE_NAME || "ticket_confirmation";
  const language = process.env.WHATSAPP_TEMPLATE_LANG || "en";

  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: template,
      language: { code: language },
      components: [
        {
          type: "header",
          parameters: [
            { type: "image", image: { link: ticketUrl(booking.reference) } },
          ],
        },
        {
          type: "body",
          parameters: [
            { type: "text", text: booking.firstName },
            { type: "text", text: booking.reference },
            { type: "text", text: String(booking.quantity) },
            { type: "text", text: EVENT.dateLabel },
            { type: "text", text: EVENT.venueFull },
          ],
        },
      ],
    },
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        ok: false,
        error:
          data?.error?.message ??
          `WhatsApp API returned ${res.status}`,
      };
    }

    return { ok: true, id: data?.messages?.[0]?.id };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown WhatsApp error",
    };
  }
}
