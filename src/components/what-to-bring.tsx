import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion";
import { Botanical } from "@/components/botanical";
import { WHAT_TO_BRING } from "@/lib/event";

/**
 * A single editorial strip: centred heading, then four cells separated by a
 * hairline lattice (the 1px gaps read as ruled gutters, like the mood-board
 * grid). No dead space, no floating list.
 */
export function WhatToBring() {
  return (
    <section
      id="bring"
      className="relative scroll-mt-20 overflow-hidden bg-blush-50 py-24 sm:py-32"
    >
      <Botanical className="pointer-events-none absolute -bottom-10 -left-4 h-52 w-auto rotate-[155deg] opacity-20" />
      <Botanical className="pointer-events-none absolute -right-6 top-8 h-44 w-auto rotate-[24deg] opacity-15" />

      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-5">
            <span className="hairline max-w-16" aria-hidden />
            <p className="eyebrow whitespace-nowrap">Come Prepared</p>
            <span className="hairline max-w-16" aria-hidden />
          </div>
          <h2 className="mt-6 font-display text-4xl font-light leading-tight text-foreground sm:text-5xl">
            What to bring
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
            Think of it as a living room, just bigger. Bring whatever makes you
            comfortable and settle in for the evening.
          </p>
        </Reveal>

        <Reveal delay={0.05} className="mt-16">
          {/* gap-px over a tinted backdrop draws the hairline lattice. */}
          <div className="border border-sand-300/70 bg-sand-300/70">
            <StaggerGroup className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4">
              {WHAT_TO_BRING.map((item, index) => (
                <StaggerItem key={item.title} className="bg-blush-50">
                  <div className="flex h-full flex-col items-center px-8 py-12 text-center">
                    <span
                      className="font-display text-xl italic leading-none text-sand-500"
                      aria-hidden
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="mt-5 block h-px w-8 bg-sand-400/70"
                      aria-hidden
                    />
                    <h3 className="mt-5 font-display text-2xl font-light leading-snug text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
