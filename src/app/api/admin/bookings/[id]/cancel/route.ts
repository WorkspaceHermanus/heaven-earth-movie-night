import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

/**
 * Cancels a booking and returns its seats to the pool. Does not refund —
 * refunds are issued from the Yoco dashboard, deliberately kept out of an
 * app that only needs a password to reach.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { id } = await params;

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  if (booking.status === "CANCELLED") {
    return NextResponse.json({ error: "Already cancelled." }, { status: 409 });
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: {
      status: "CANCELLED",
      cancelledAt: new Date(),
      // Expire the hold so availability recalculates immediately.
      holdExpiresAt: new Date(0),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");

  return NextResponse.json({
    ok: true,
    reference: updated.reference,
    restored: updated.quantity,
  });
}
