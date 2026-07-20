import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { sendConfirmationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

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

  if (booking.status !== "PAID") {
    return NextResponse.json(
      { error: "Only paid bookings have a confirmation to send." },
      { status: 409 },
    );
  }

  const result = await sendConfirmationEmail(booking);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  await prisma.booking.update({
    where: { id },
    data: { emailSentAt: new Date() },
  });

  return NextResponse.json({ ok: true, sentTo: booking.email });
}
