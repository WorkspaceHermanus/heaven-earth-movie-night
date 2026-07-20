import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BrandMark } from "@/components/brand-mark";
import { SiteFooter } from "@/components/site-footer";
import { EVENT } from "@/lib/event";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Payment cancelled",
  robots: { index: false, follow: false },
};

export default async function CancelledPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; failed?: string }>;
}) {
  const { ref, failed } = await searchParams;

  // Release the hold immediately so the seats go back on sale rather than
  // waiting for the 20-minute expiry.
  if (ref) {
    await prisma.booking
      .updateMany({
        where: { reference: ref, status: "PENDING" },
        data: { status: "CANCELLED", cancelledAt: new Date() },
      })
      .catch((error) =>
        console.error("[cancelled] failed to release hold", error),
      );
  }

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

      <main id="main" className="aurora flex min-h-[70vh] items-center py-20">
        <div className="container">
          <Card className="mx-auto max-w-lg p-10 text-center sm:p-12">
            <p className="eyebrow">
              {failed ? "Payment unsuccessful" : "Payment cancelled"}
            </p>
            <h1 className="mt-5 font-display text-4xl font-light leading-tight text-foreground">
              {failed
                ? "That payment didn't go through."
                : "No payment was taken."}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Your tickets haven&rsquo;t been reserved and your card
              hasn&rsquo;t been charged. You&rsquo;re welcome to try again — but
              do hurry, we only have {EVENT.capacity} seats.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href="/#book">Try again</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/">Back to the event</Link>
              </Button>
            </div>

            <p className="mt-8 text-sm text-muted-foreground">
              Need a hand? Email us at{" "}
              <a
                className="text-sand-600 underline underline-offset-4"
                href={`mailto:${EVENT.contactEmail}`}
              >
                {EVENT.contactEmail}
              </a>
              .
            </p>
          </Card>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
