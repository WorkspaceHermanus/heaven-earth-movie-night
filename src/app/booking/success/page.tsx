import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ConfirmationView } from "@/components/confirmation-view";
import { SiteFooter } from "@/components/site-footer";
import { BrandMark } from "@/components/brand-mark";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Booking confirmed",
  robots: { index: false, follow: false },
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  if (!ref) notFound();

  const booking = await prisma.booking.findUnique({
    where: { reference: ref },
    select: {
      reference: true,
      firstName: true,
      lastName: true,
      quantity: true,
      totalAmount: true,
      status: true,
    },
  });

  if (!booking) notFound();

  return (
    <>
      <header className="border-b border-sand-200/60">
        <div className="container flex h-20 items-center">
          <Link href="/" className="flex items-center gap-3 rounded-lg">
            <BrandMark className="h-8 w-8" />
            <span className="text-[0.7rem] uppercase tracking-[0.28em] text-sand-700">
              Heaven &amp; Earth
            </span>
          </Link>
        </div>
      </header>

      <main id="main" className="aurora min-h-[70vh] py-20 sm:py-28">
        <div className="container">
          <ConfirmationView initial={booking} />
        </div>
      </main>

      <div className="no-print">
        <SiteFooter />
      </div>
    </>
  );
}
