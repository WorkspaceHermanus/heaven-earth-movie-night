"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EVENT } from "@/lib/event";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-500",
        scrolled
          ? "border-b border-sand-200/70 bg-background/85 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <div className="container flex h-20 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg"
          aria-label={`${EVENT.host} home`}
        >
          <BrandMark className="h-8 w-8" />
          <span className="hidden text-[0.7rem] uppercase tracking-[0.28em] text-sand-700 sm:block">
            Heaven &amp; Earth
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="#details"
            className="hidden px-4 py-2 text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-sand-700 md:block"
          >
            The Evening
          </Link>
          <Link
            href="#film"
            className="hidden px-4 py-2 text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-sand-700 md:block"
          >
            The Film
          </Link>
          <Link
            href="#bring"
            className="hidden px-4 py-2 text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-sand-700 md:block"
          >
            What to Bring
          </Link>
          <Link
            href="#finding-us"
            className="hidden px-4 py-2 text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-sand-700 lg:block"
          >
            Finding Us
          </Link>
          <Button asChild size="sm" className="ml-2">
            <Link href="#book">Book Tickets</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
