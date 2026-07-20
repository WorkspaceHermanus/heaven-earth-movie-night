import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion";
import { WHAT_TO_BRING } from "@/lib/event";

export function WhatToBring() {
  return (
    <section id="bring" className="scroll-mt-20 bg-blush-50/60 py-24 sm:py-32">
      <div className="container">
        <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-24">
          <Reveal>
            <p className="eyebrow">Come Prepared</p>
            <h2 className="mt-5 font-display text-4xl font-light leading-tight text-foreground sm:text-5xl">
              What to bring
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              Think of it as a living room, just bigger. Bring whatever makes
              you comfortable and settle in for the evening.
            </p>
          </Reveal>

          <StaggerGroup className="space-y-px">
            {WHAT_TO_BRING.map((item, index) => (
              <StaggerItem key={item.title}>
                <div className="group flex items-baseline gap-6 border-t border-sand-200/80 py-7 transition-colors duration-500 first:border-t-0 hover:border-sand-400">
                  <span className="font-display text-lg text-sand-400 transition-colors duration-500 group-hover:text-sand-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl leading-snug text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
