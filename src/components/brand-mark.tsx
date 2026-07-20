import { cn } from "@/lib/utils";

/**
 * The Heaven & Earth monogram, drawn as inline SVG so it stays crisp at any
 * size and costs no network request.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      role="img"
      aria-label="Heaven and Earth Hermanus"
      className={cn("text-sand-500", className)}
      fill="none"
    >
      {/* H stem */}
      <rect x="24" y="20" width="11" height="80" fill="currentColor" />
      {/* shared upright */}
      <rect x="62" y="20" width="11" height="80" fill="currentColor" />
      {/* E arms */}
      <rect x="73" y="20" width="27" height="3.5" fill="currentColor" />
      <rect x="73" y="96.5" width="27" height="3.5" fill="currentColor" />
      {/* the tilted crossbar that joins heaven to earth */}
      <path
        d="M31 62.5 L92 55.5"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="square"
      />
    </svg>
  );
}
