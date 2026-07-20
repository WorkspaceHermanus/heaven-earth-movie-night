import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAvailability } from "@/lib/availability";
import { AdminDashboard } from "@/components/admin/dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bookings dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const [bookings, availability, revenue] = await Promise.all([
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    getAvailability(),
    prisma.booking.aggregate({
      _sum: { totalAmount: true },
      where: { status: "PAID" },
    }),
  ]);

  return (
    <AdminDashboard
      bookings={bookings.map((b) => ({
        id: b.id,
        reference: b.reference,
        firstName: b.firstName,
        lastName: b.lastName,
        email: b.email,
        phone: b.phone,
        quantity: b.quantity,
        totalAmount: b.totalAmount,
        status: b.status,
        yocoPaymentId: b.yocoPaymentId,
        createdAt: b.createdAt.toISOString(),
      }))}
      stats={{
        sold: availability.sold,
        remaining: availability.remaining,
        capacity: availability.capacity,
        revenue: revenue._sum.totalAmount ?? 0,
      }}
    />
  );
}
