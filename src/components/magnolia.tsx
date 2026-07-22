import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Magnolia watermark.
 *
 * Source: *Magnolia campbellii*, Plate IV from Joseph Dalton Hooker's
 * "Illustrations of Himalayan Plants" (1855), lithographed by Walter Hood
 * Fitch. Published 1855 — public domain. Individual blooms were cropped from
 * the plate, desaturated slightly toward the site palette, and given a
 * feathered alpha edge so they sit as a wash rather than a pasted rectangle.
 *
 * `variant="bloom"` is the open pale flower; `variant="rose"` is the deeper
 * rose-centred one.
 */
export function Magnolia({
  className,
  variant = "bloom",
  priority = false,
  /** Rendered width hint; without it Next serves a source too small and the
   *  plate's fine linework goes soft. */
  sizes = "(min-width: 1024px) 40rem, (min-width: 640px) 34rem, 24rem",
}: {
  className?: string;
  variant?: "bloom" | "rose";
  priority?: boolean;
  sizes?: string;
}) {
  const src =
    variant === "rose" ? "/magnolia-rose.png" : "/magnolia-bloom.png";

  return (
    <Image
      src={src}
      alt=""
      aria-hidden
      width={1400}
      height={variant === "rose" ? 1318 : 1473}
      priority={priority}
      sizes={sizes}
      className={cn("select-none", className)}
    />
  );
}
