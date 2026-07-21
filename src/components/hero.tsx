"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Botanical } from "@/components/botanical";
import { Magnolia } from "@/components/magnolia";
import { EVENT } from "@/lib/event";

const EASE = [0.22, 1, 0.36, 1] as const;

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export function Hero({ remaining }: { remaining: number }) {
  const soldOut = remaining <= 0;

  return (
    <section className="relative overflow-hidden bg-background pb-24 pt-40 sm:pb-32 sm:pt-48">
      {/*
       * Watermark magnolias. Sized generously and bled off the edges so they
       * read as a printed background wash rather than as illustrations, and
       * kept in the corners so they never sit behind the headline.
       */}
      <Magnolia
        className="pointer-events-none absolute -right-28 -top-16 h-[22rem] w-auto rotate-[14deg] opacity-[0.24] sm:-right-16 sm:h-[34rem] sm:opacity-[0.36] lg:h-[38rem]"
      />
      <Magnolia
        variant="bud"
        className="pointer-events-none absolute -bottom-24 -left-32 h-72 w-auto -rotate-[152deg] opacity-[0.2] sm:-left-20 sm:h-96 sm:opacity-[0.3]"
      />

      {/* Line-art sprig, kept as a lighter accent behind the wash. */}
      <Botanical className="pointer-events-none absolute -left-6 top-28 h-40 w-auto rotate-[18deg] opacity-20 sm:h-52" />

      <div className="container relative">
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.12 }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div
            variants={rise}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex items-center justify-center gap-5"
          >
            <span className="hairline max-w-16" aria-hidden />
            <p className="eyebrow whitespace-nowrap">{EVENT.host}</p>
            <span className="hairline max-w-16" aria-hidden />
          </motion.div>

          <motion.h1
            variants={rise}
            transition={{ duration: 0.8, ease: EASE }}
            className="mt-8 font-display text-[2.75rem] font-light leading-[1.1] text-foreground sm:text-6xl lg:text-7xl"
          >
            Celebrate Women&rsquo;s Day with an{" "}
            <em className="font-normal text-sand-600">unforgettable</em> movie
            night.
          </motion.h1>

          <motion.p
            variants={rise}
            transition={{ duration: 0.8, ease: EASE }}
            className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Join us for an evening of connection, laughter and relaxation in a
            beautiful setting.
          </motion.p>

          <motion.div
            variants={rise}
            transition={{ duration: 0.8, ease: EASE }}
            className="mt-11 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Button asChild size="lg" variant={soldOut ? "secondary" : "default"}>
              <Link href="#book">
                {soldOut ? "View Event Details" : "Book Your Tickets"}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#details">See the Details</Link>
            </Button>
          </motion.div>

          <motion.div
            variants={rise}
            transition={{ duration: 0.8, ease: EASE }}
            className="mx-auto mt-16 flex max-w-lg flex-wrap items-center justify-center gap-x-0 gap-y-3 text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground"
          >
            <span className="px-5">{EVENT.dateLabel}</span>
            <span className="hidden h-3 w-px bg-sand-300 sm:block" aria-hidden />
            <span className="px-5">From {EVENT.doorsOpen}</span>
            <span className="hidden h-3 w-px bg-sand-300 sm:block" aria-hidden />
            <span className="px-5">{EVENT.venue}</span>
          </motion.div>
        </motion.div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sand-300/80 to-transparent"
      />
    </section>
  );
}
