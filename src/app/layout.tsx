import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Toaster } from "sonner";
import { EVENT } from "@/lib/event";
import { getAppUrl } from "@/lib/utils";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const title = `${EVENT.name} — ${EVENT.host}`;
const description = `Celebrate Women's Day at ${EVENT.venue}, Hermanus: worship from ${EVENT.doorsOpen}, then the movie War Room, closing with prayer and ministry. ${EVENT.dateLabel}. R50 per person, only ${EVENT.capacity} tickets available.`;

export const metadata: Metadata = {
  metadataBase: new URL(getAppUrl()),
  title: { default: title, template: `%s — ${EVENT.host}` },
  description,
  keywords: [
    "Women's Day",
    "movie night",
    "Hermanus",
    "Heaven and Earth Hermanus",
    "church event",
    EVENT.venue,
  ],
  authors: [{ name: EVENT.host }],
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_ZA",
    siteName: EVENT.host,
    url: getAppUrl(),
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#FBF7F4",
  width: "device-width",
  initialScale: 1,
};

/** Schema.org Event markup so the listing can surface as a rich result. */
const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: EVENT.name,
  startDate: EVENT.doorsOpenISO,
  endDate: EVENT.endISO,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: EVENT.venueFull,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Farm 11, R320, Hemel en Aarde Valley",
      addressLocality: "Hermanus",
      addressRegion: "Western Cape",
      postalCode: "7200",
      addressCountry: "ZA",
    },
  },
  organizer: { "@type": "Organization", name: EVENT.host, url: getAppUrl() },
  offers: {
    "@type": "Offer",
    price: (EVENT.ticketPriceCents / 100).toFixed(2),
    priceCurrency: EVENT.currency,
    availability: "https://schema.org/InStock",
    url: `${getAppUrl()}/#book`,
  },
  description,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-ZA" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-sand-500 focus:px-5 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              borderRadius: "2px",
              border: "1px solid hsl(var(--border))",
            },
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
        />
      </body>
    </html>
  );
}
