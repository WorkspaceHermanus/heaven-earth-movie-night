import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

/** Escapes a value for CSV, neutralising spreadsheet formula injection. */
function csvCell(value: unknown): string {
  let str = value === null || value === undefined ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(str)) str = `'${str}`;
  return `"${str.replace(/"/g, '""')}"`;
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
  });

  const header = [
    "Booking ID",
    "Reference",
    "First Name",
    "Last Name",
    "Email",
    "Phone",
    "Quantity",
    "Total (ZAR)",
    "Status",
    "Yoco Payment ID",
    "Created",
    "Paid At",
  ];

  const rows = bookings.map((b) =>
    [
      b.id,
      b.reference,
      b.firstName,
      b.lastName,
      b.email,
      b.phone,
      b.quantity,
      (b.totalAmount / 100).toFixed(2),
      b.status,
      b.yocoPaymentId ?? "",
      b.createdAt.toISOString(),
      b.paidAt?.toISOString() ?? "",
    ]
      .map(csvCell)
      .join(","),
  );

  // BOM keeps Excel happy with UTF-8.
  const csv = `﻿${[header.map(csvCell).join(","), ...rows].join("\r\n")}`;
  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="bookings-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
