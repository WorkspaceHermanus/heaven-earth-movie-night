import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { EVENT } from "@/lib/event";
import { bookingSchema } from "@/lib/validation";
import { generateReference } from "@/lib/reference";
import {
  getAvailability,
  reserveSeats,
  SoldOutError,
} from "@/lib/availability";
import { createYocoCheckout, isYocoConfigured } from "@/lib/yoco";
import { getAppUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * Best-effort in-memory throttle. Serverless instances are short-lived, so
 * this blunts casual abuse rather than acting as a hard guarantee — the
 * SERIALIZABLE reservation below is what actually protects the ticket count.
 */
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 8;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);

  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request) {
  if (!isYocoConfigured()) {
    console.error("[checkout] YOCO_SECRET_KEY missing");
    return NextResponse.json(
      { error: "Payments are not configured yet. Please contact us directly." },
      { status: 503 },
    );
  }

  if (rateLimited(clientIp(request))) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a minute and try again." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.errors[0]?.message ?? "Please check your details.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const input = parsed.data;
  // Price is derived server-side; the client never gets to name its total.
  const totalAmount = input.quantity * EVENT.ticketPriceCents;
  const reference = generateReference();

  let booking;
  try {
    booking = await withSerializableRetry(() =>
      reserveSeats({ ...input, reference, totalAmount }),
    );
  } catch (error) {
    if (error instanceof SoldOutError) {
      return NextResponse.json(
        { error: error.message, remaining: error.remaining },
        { status: 409 },
      );
    }
    console.error("[checkout] reservation failed", error);
    const { remaining } = await getAvailability().catch(() => ({
      remaining: 0,
    }));
    return NextResponse.json(
      { error: "We couldn't hold your tickets. Please try again.", remaining },
      { status: 500 },
    );
  }

  try {
    const appUrl = getAppUrl();
    const checkout = await createYocoCheckout(
      {
        amount: totalAmount,
        currency: EVENT.currency,
        successUrl: `${appUrl}/booking/success?ref=${encodeURIComponent(reference)}`,
        cancelUrl: `${appUrl}/booking/cancelled?ref=${encodeURIComponent(reference)}`,
        failureUrl: `${appUrl}/booking/cancelled?ref=${encodeURIComponent(reference)}&failed=1`,
        metadata: {
          bookingId: booking.id,
          bookingReference: reference,
          eventName: EVENT.name,
        },
      },
      // Reference is unique per booking, so a retried request re-uses the
      // same Yoco checkout rather than creating a second one.
      reference,
    );

    await prisma.booking.update({
      where: { id: booking.id },
      data: { yocoCheckoutId: checkout.id },
    });

    return NextResponse.json({
      redirectUrl: checkout.redirectUrl,
      reference,
    });
  } catch (error) {
    console.error("[checkout] Yoco checkout failed", error);

    // Release the hold straight away — no payment session means no claim
    // on those seats.
    await prisma.booking
      .update({
        where: { id: booking.id },
        data: { status: "CANCELLED", cancelledAt: new Date() },
      })
      .catch((err) => console.error("[checkout] failed to release hold", err));

    return NextResponse.json(
      { error: "We couldn't reach the payment provider. Please try again." },
      { status: 502 },
    );
  }
}

/**
 * Retries a transaction that Postgres aborted because of a serialization
 * conflict (Prisma surfaces these as P2034). Two concurrent buyers racing for
 * the last seats is exactly the case this handles.
 */
async function withSerializableRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const isConflict =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2034";
      if (!isConflict) throw error;
      await new Promise((resolve) => setTimeout(resolve, 40 * (attempt + 1)));
    }
  }

  throw lastError;
}
