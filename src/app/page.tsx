import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { EventDetails } from "@/components/event-details";
import { FilmSection } from "@/components/film-section";
import { WhatToBring } from "@/components/what-to-bring";
import { FindingUs } from "@/components/finding-us";
import { BookingSection } from "@/components/booking-section";
import { SiteFooter } from "@/components/site-footer";
import { getAvailability } from "@/lib/availability";

/** Ticket counts must never be served stale. */
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { remaining } = await getAvailability();

  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero remaining={remaining} />
        <EventDetails remaining={remaining} />
        <FilmSection />
        <WhatToBring />
        <FindingUs />
        <BookingSection remaining={remaining} />
      </main>
      <SiteFooter />
    </>
  );
}
