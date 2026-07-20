"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Ban,
  Download,
  LogOut,
  Search,
  Send,
  Ticket,
  TrendingUp,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrandMark } from "@/components/brand-mark";
import { EVENT, formatZAR } from "@/lib/event";

export type AdminBooking = {
  id: string;
  reference: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  quantity: number;
  totalAmount: number;
  status: string;
  yocoPaymentId: string | null;
  createdAt: string;
};

type Stats = {
  sold: number;
  remaining: number;
  capacity: number;
  revenue: number;
};

const STATUS_VARIANT: Record<
  string,
  "success" | "warning" | "danger" | "muted"
> = {
  PAID: "success",
  PENDING: "warning",
  CANCELLED: "danger",
  EXPIRED: "muted",
  REFUNDED: "muted",
};

export function AdminDashboard({
  bookings,
  stats,
}: {
  bookings: AdminBooking[];
  stats: Stats;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return bookings;
    return bookings.filter((b) =>
      [b.reference, b.firstName, b.lastName, b.email, b.phone]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [bookings, query]);

  const act = async (
    id: string,
    action: "cancel" | "resend",
    confirmMessage?: string,
  ) => {
    if (confirmMessage && !window.confirm(confirmMessage)) return;

    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/bookings/${id}/${action}`, {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.error ?? "That didn't work.");
        return;
      }

      if (action === "cancel") {
        toast.success(
          `Booking ${data.reference} cancelled — ${data.restored} ticket(s) released.`,
        );
        router.refresh();
      } else {
        toast.success(`Confirmation resent to ${data.sentTo}.`);
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-sand-50/60">
      <header className="border-b border-sand-200/70 bg-background/80 backdrop-blur">
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandMark className="h-8 w-8" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Bookings dashboard
              </p>
              <p className="text-xs text-muted-foreground">{EVENT.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="size-4" aria-hidden />
            Sign out
          </Button>
        </div>
      </header>

      <main id="main" className="container py-12">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Ticket}
            label="Tickets sold"
            value={String(stats.sold)}
            hint={`of ${stats.capacity}`}
          />
          <StatCard
            icon={Users}
            label="Tickets remaining"
            value={String(stats.remaining)}
            hint={stats.remaining === 0 ? "Fully booked" : "Available now"}
          />
          <StatCard
            icon={TrendingUp}
            label="Revenue collected"
            value={formatZAR(stats.revenue)}
            hint="Paid bookings only"
          />
          <StatCard
            icon={Users}
            label="Bookings"
            value={String(bookings.filter((b) => b.status === "PAID").length)}
            hint="Confirmed orders"
          />
        </div>

        {/* Toolbar */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative sm:w-80">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, phone or reference"
              className="pl-11"
              aria-label="Search bookings"
            />
          </div>

          <Button asChild variant="outline">
            <a href="/api/admin/bookings/export" download>
              <Download className="size-4" aria-hidden />
              Export CSV
            </a>
          </Button>
        </div>

        {/* Bookings */}
        <Card className="mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[840px] text-sm">
              <thead>
                <tr className="border-b border-sand-200/70 text-left">
                  {[
                    "Reference",
                    "Guest",
                    "Contact",
                    "Tickets",
                    "Amount",
                    "Status",
                    "Booked",
                    "",
                  ].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="px-5 py-4 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted-foreground"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200/60">
                {filtered.map((booking) => (
                  <tr key={booking.id} className="hover:bg-sand-50/70">
                    <td className="whitespace-nowrap px-5 py-4 font-mono text-xs font-semibold text-sand-700">
                      {booking.reference}
                    </td>
                    <td className="px-5 py-4 text-foreground">
                      {booking.firstName} {booking.lastName}
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-foreground">{booking.email}</div>
                      <div className="text-xs text-muted-foreground">
                        {booking.phone}
                      </div>
                    </td>
                    <td className="px-5 py-4 tabular-nums text-foreground">
                      {booking.quantity}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 tabular-nums text-foreground">
                      {formatZAR(booking.totalAmount)}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={STATUS_VARIANT[booking.status] ?? "muted"}>
                        {booking.status.toLowerCase()}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-xs text-muted-foreground">
                      {new Date(booking.createdAt).toLocaleString("en-ZA", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={
                            busyId === booking.id || booking.status !== "PAID"
                          }
                          onClick={() => act(booking.id, "resend")}
                          title="Resend confirmation email"
                        >
                          <Send className="size-4" aria-hidden />
                          <span className="sr-only">
                            Resend confirmation for {booking.reference}
                          </span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={
                            busyId === booking.id ||
                            booking.status === "CANCELLED"
                          }
                          onClick={() =>
                            act(
                              booking.id,
                              "cancel",
                              `Cancel booking ${booking.reference} and release ${booking.quantity} ticket(s)?\n\nThis does not issue a refund — do that in your Yoco dashboard.`,
                            )
                          }
                          title="Cancel booking"
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Ban className="size-4" aria-hidden />
                          <span className="sr-only">
                            Cancel booking {booking.reference}
                          </span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-16 text-center text-muted-foreground"
                    >
                      {bookings.length === 0
                        ? "No bookings yet."
                        : "No bookings match that search."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <p className="mt-4 text-xs text-muted-foreground">
          Showing the {bookings.length} most recent bookings. Export the CSV for
          the full history.
        </p>
      </main>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <p className="text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        <Icon className="size-4 text-sand-500" />
      </div>
      <p className="mt-4 font-display text-3xl text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </Card>
  );
}
