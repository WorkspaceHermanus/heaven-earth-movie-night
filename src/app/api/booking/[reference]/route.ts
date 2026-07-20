import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Status lookup for the confirmation page, which polls while it waits for
 * Yoco's webhook to land. Returns only what the confirmation screen renders —
 * never the customer's phone number or email.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reference: string }> },
) {
  const { reference } = await params;

  const booking = await prisma.booking.findUnique({
    where: { reference },
    select: {
      reference: true,
      firstName: true,
      lastName: true,
      quantity: true,
      totalAmount: true,
      status: true,
      paidAt: true,
    },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json(booking, {
    headers: { "Cache-Control": "no-store" },
  });
}
