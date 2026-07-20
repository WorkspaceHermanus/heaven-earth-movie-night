import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { verifyYocoWebhookSignature } from "@/lib/yoco";
import { sendConfirmationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

type YocoWebhookPayload = {
  id?: string;
  type?: string;
  payload?: {
    id?: string;
    status?: string;
    amount?: number;
    metadata?: Record<string, string>;
    checkoutId?: string;
  };
};

export async function POST(request: Request) {
  // Signature is computed over the exact bytes Yoco sent, so read the raw
  // body before any parsing.
  const rawBody = await request.text();

  if (!verifyYocoWebhookSignature(request.headers, rawBody)) {
    console.warn("[yoco-webhook] rejected: invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  let event: YocoWebhookPayload;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const eventId = event.id;
  const eventType = event.type ?? "unknown";

  if (!eventId) {
    return NextResponse.json({ error: "Missing event id" }, { status: 400 });
  }

  // Yoco delivers at least once. Recording the event id first means a retry
  // short-circuits here instead of re-sending emails.
  try {
    await prisma.webhookEvent.create({
      data: {
        eventId,
        type: eventType,
        payload: event as unknown as Prisma.InputJsonValue,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json({ received: true, duplicate: true });
    }
    throw error;
  }

  if (eventType !== "payment.succeeded") {
    // Nothing to do — unpaid holds expire on their own.
    return NextResponse.json({ received: true, ignored: eventType });
  }

  const payload = event.payload ?? {};
  const reference = payload.metadata?.bookingReference;
  const bookingId = payload.metadata?.bookingId;
  const checkoutId = payload.checkoutId;

  const booking = await prisma.booking.findFirst({
    where: {
      OR: [
        bookingId ? { id: bookingId } : {},
        reference ? { reference } : {},
        checkoutId ? { yocoCheckoutId: checkoutId } : {},
      ].filter((clause) => Object.keys(clause).length > 0),
    },
  });

  if (!booking) {
    console.error("[yoco-webhook] no booking matched", {
      reference,
      bookingId,
      checkoutId,
    });
    // 200 so Yoco stops retrying something we can never resolve.
    return NextResponse.json({ received: true, matched: false });
  }

  if (booking.status === "PAID") {
    return NextResponse.json({ received: true, alreadyPaid: true });
  }

  // Guard against a mismatched amount (tampering or a partial capture).
  if (typeof payload.amount === "number" && payload.amount !== booking.totalAmount) {
    console.error("[yoco-webhook] amount mismatch", {
      reference: booking.reference,
      expected: booking.totalAmount,
      received: payload.amount,
    });
    return NextResponse.json({ received: true, mismatch: true });
  }

  const paid = await prisma.booking.update({
    where: { id: booking.id },
    data: {
      status: "PAID",
      paidAt: new Date(),
      yocoPaymentId: payload.id ?? null,
      // Paid seats are held permanently; push the hold far out so the
      // availability query can never reclaim them.
      holdExpiresAt: new Date("2100-01-01T00:00:00Z"),
    },
  });

  if (!paid.emailSentAt) {
    const result = await sendConfirmationEmail(paid);
    if (result.ok) {
      await prisma.booking.update({
        where: { id: paid.id },
        data: { emailSentAt: new Date() },
      });
    } else {
      // The booking is valid regardless; log loudly so an organiser can
      // resend from the admin dashboard.
      console.error("[yoco-webhook] confirmation email failed", {
        reference: paid.reference,
        error: result.error,
      });
    }
  }

  return NextResponse.json({ received: true, reference: paid.reference });
}
