import { Resend } from "resend";
import type { Booking } from "@prisma/client";
import { EVENT, formatZAR } from "@/lib/event";
import { getAppUrl } from "@/lib/utils";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

function fromAddress(): string {
  return (
    process.env.RESEND_FROM_EMAIL ||
    "Heaven & Earth Hermanus <onboarding@resend.dev>"
  );
}

const COLORS = {
  ink: "#2F2A25",
  muted: "#7A6E61",
  gold: "#C08F4E",
  cream: "#FAF7F2",
  line: "#EAE0D1",
};

function detailRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid ${COLORS.line};font-family:Helvetica,Arial,sans-serif;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:${COLORS.muted};">${label}</td>
      <td style="padding:10px 0;border-bottom:1px solid ${COLORS.line};font-family:Helvetica,Arial,sans-serif;font-size:15px;color:${COLORS.ink};text-align:right;font-weight:600;">${value}</td>
    </tr>`;
}

export function renderConfirmationEmail(booking: Booking): string {
  const name = `${booking.firstName} ${booking.lastName}`.trim();
  const tickets = `${booking.quantity} ${booking.quantity === 1 ? "ticket" : "tickets"}`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Your booking is confirmed</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.cream};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Booking ${booking.reference} confirmed — ${tickets} for ${EVENT.name}.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.cream};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 12px 32px -20px rgba(74,52,28,.35);">

        <tr><td style="padding:40px 40px 28px;text-align:center;border-bottom:1px solid ${COLORS.line};">
          <div style="font-family:Georgia,serif;font-size:30px;letter-spacing:.16em;color:${COLORS.gold};font-weight:400;">H&amp;E</div>
          <div style="margin-top:8px;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:${COLORS.muted};">Heaven &amp; Earth Hermanus</div>
        </td></tr>

        <tr><td style="padding:36px 40px 8px;text-align:center;">
          <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;line-height:1.25;color:${COLORS.ink};font-weight:400;">Thank you, ${escapeHtml(booking.firstName)}.</h1>
          <p style="margin:14px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;color:${COLORS.muted};">
            Your booking for <strong style="color:${COLORS.ink};">${EVENT.name}</strong> is confirmed. We can't wait to see you there.
          </p>
        </td></tr>

        <tr><td style="padding:28px 40px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.cream};border-radius:12px;padding:22px;text-align:center;">
            <tr><td style="text-align:center;">
              <div style="font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:${COLORS.muted};">Booking reference</div>
              <div style="margin-top:8px;font-family:'Courier New',monospace;font-size:26px;letter-spacing:.12em;color:${COLORS.gold};font-weight:700;">${booking.reference}</div>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:26px 40px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${detailRow("Guest", escapeHtml(name))}
            ${detailRow("Tickets", tickets)}
            ${detailRow("Amount paid", formatZAR(booking.totalAmount))}
            ${detailRow("Date", EVENT.dateLabel)}
            ${detailRow("Doors open", EVENT.doorsOpen)}
            ${detailRow("Movie starts", EVENT.startTime)}
            ${detailRow("Venue", EVENT.venue)}
          </table>
        </td></tr>

        <tr><td style="padding:28px 40px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FBF3F0;border-radius:12px;">
            <tr><td style="padding:20px 22px;">
              <div style="font-family:Georgia,serif;font-size:17px;color:${COLORS.ink};">What to bring</div>
              <ul style="margin:12px 0 0;padding-left:18px;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.8;color:${COLORS.muted};">
                <li>Your favourite pillow</li>
                <li>A warm blanket</li>
                <li>Comfortable clothes</li>
              </ul>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:28px 40px 40px;text-align:center;">
          <a href="${getAppUrl()}/booking/success?ref=${encodeURIComponent(booking.reference)}"
             style="display:inline-block;background:${COLORS.gold};color:#ffffff;text-decoration:none;font-family:Helvetica,Arial,sans-serif;font-size:14px;letter-spacing:.06em;padding:14px 30px;border-radius:999px;font-weight:600;">
            View your confirmation
          </a>
        </td></tr>

        <tr><td style="padding:24px 40px 34px;text-align:center;border-top:1px solid ${COLORS.line};">
          <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.7;color:${COLORS.muted};">
            Hosted by ${EVENT.host}<br>
            Questions? Reply to this email or contact us at ${EVENT.contactEmail}.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderConfirmationText(booking: Booking): string {
  return [
    `Thank you, ${booking.firstName}.`,
    ``,
    `Your booking for ${EVENT.name} is confirmed.`,
    ``,
    `Booking reference: ${booking.reference}`,
    `Guest: ${booking.firstName} ${booking.lastName}`,
    `Tickets: ${booking.quantity}`,
    `Amount paid: ${formatZAR(booking.totalAmount)}`,
    `Date: ${EVENT.dateLabel}`,
    `Doors open: ${EVENT.doorsOpen}`,
    `Movie starts: ${EVENT.startTime}`,
    `Venue: ${EVENT.venue}`,
    ``,
    `What to bring: your favourite pillow, a warm blanket, and comfortable clothes.`,
    ``,
    `Hosted by ${EVENT.host}`,
    `${EVENT.contactEmail}`,
  ].join("\n");
}

export type SendResult = { ok: true } | { ok: false; error: string };

export async function sendConfirmationEmail(
  booking: Booking,
): Promise<SendResult> {
  const resend = getResend();
  if (!resend) {
    return { ok: false, error: "RESEND_API_KEY is not configured" };
  }

  try {
    const { error } = await resend.emails.send({
      from: fromAddress(),
      to: booking.email,
      subject: `Booking confirmed — ${EVENT.name} (${booking.reference})`,
      html: renderConfirmationEmail(booking),
      text: renderConfirmationText(booking),
      replyTo: EVENT.contactEmail,
    });

    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown email error",
    };
  }
}
