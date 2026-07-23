import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { sendTicketWhatsApp } from "@/lib/whatsapp";

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
      { error: "Only paid bookings have a ticket to send." },
      { status: 409 },
    );
  }

  const result = await sendTicketWhatsApp(booking);

  if (!result.ok) {
    return NextResponse.json(
      {
        error: result.skipped
          ? `${result.error}. Use the WhatsApp link instead.`
          : result.error,
      },
      { status: result.skipped ? 409 : 502 },
    );
  }

  await prisma.booking.update({
    where: { id },
    data: { whatsappSentAt: new Date() },
  });

  return NextResponse.json({ ok: true, sentTo: booking.phone });
}
