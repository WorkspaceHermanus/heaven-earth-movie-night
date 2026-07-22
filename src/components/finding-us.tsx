import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Reveal } from "@/components/motion";
import { EVENT } from "@/lib/event";

/**
 * Wayfinding: Volmoed's own site map with the Conference Room ringed, plus
 * the address and a directions link. The map opens full size in a new tab so
 * it can be pinch-zoomed on a phone, where the hand-drawn labels are small.
 */
export function FindingUs() {
  return (
    <section id="finding-us" className="section scroll-mt-20 bg-background">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-5">
            <span className="hairline max-w-16" aria-hidden />
            <p className="eyebrow whitespace-nowrap">Finding Us</p>
            <span className="hairline max-w-16" aria-hidden />
          </div>
          <h2 className="mt-6 font-display text-4xl font-light leading-tight text-foreground sm:text-5xl">
            {EVENT.venueFull}
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
            Volmoed sits in the Hemel en Aarde Valley just outside Hermanus. The
            Conference Room is beside the office — it&rsquo;s circled on the map
            below, with parking right alongside.
          </p>
        </Reveal>

        <Reveal delay={0.05} className="mx-auto mt-12 max-w-4xl">
          <a
            href="/volmoed-site-map.jpg"
            target="_blank"
            rel="noopener noreferrer"
            className="group block border border-sand-300/70 bg-white p-2.5 transition-colors hover:border-sand-500"
          >
            <Image
              src="/volmoed-site-map.jpg"
              alt="Volmoed site map with the Conference Room circled, beside the office and parking area"
              width={1800}
              height={1273}
              sizes="(min-width: 1024px) 56rem, 100vw"
              className="h-auto w-full"
            />
          </a>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Tap the map to open it full size &middot; Site map courtesy of
            Volmoed
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-12 max-w-2xl">
          <div className="border-t border-sand-300/60 pt-8 text-center">
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-muted-foreground">
              Address
            </p>
            <p className="mt-3 font-display text-2xl font-light leading-snug text-foreground">
              {EVENT.venueAddress}
            </p>
            <a
              href={EVENT.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm text-sand-600 underline underline-offset-4 transition-colors hover:text-sand-800"
            >
              Open directions in Google Maps
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
