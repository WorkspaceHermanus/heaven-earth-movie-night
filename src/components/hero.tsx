"use client";

import Link from "next/link";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { EVENT } from "@/lib/event";

const EASE = [0.22, 1, 0.36, 1] as const;

const rise = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

export function Hero({ remaining }: { remaining: number }) {
  const soldOut = remaining <= 0;

  return (
    <section className="aurora relative overflow-hidden pb-24 pt-36 sm:pb-32 sm:pt-44">
      <div className="container relative">
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.12 }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.p
            variants={rise}
            transition={{ duration: 0.7, ease: EASE }}
            className="eyebrow"
          >
            {EVENT.host}
          </motion.p>

          <motion.h1
            variants={rise}
            transition={{ duration: 0.8, ease: EASE }}
            className="mt-6 font-display text-[2.75rem] font-light leading-[1.08] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
          >
            Celebrate Women&rsquo;s Day with an{" "}
            <span className="italic text-sand-600">unforgettable</span> movie
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
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
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
            className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground"
          >
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="size-4 text-sand-500" aria-hidden />
              {EVENT.dateLabel}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="size-4 text-sand-500" aria-hidden />
              Doors {EVENT.doorsOpen}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4 text-sand-500" aria-hidden />
              {EVENT.venue}
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative leaf line, echoing the invitation suite. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sand-300/70 to-transparent"
      />
    </section>
  );
}
