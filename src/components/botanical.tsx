import { cn } from "@/lib/utils";

/**
 * Hand-drawn-style botanical line art, echoing the leaf sketches in the
 * brand mood board. Stroke-only so it stays delicate at any size; colour
 * comes from `currentColor`.
 */
export function Botanical({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      aria-hidden
      className={cn("text-sand-400", className)}
    >
      {/* stem */}
      <path d="M60 196C59 152 61 62 60 10" />
      {/* tip leaves */}
      <path d="M60 30C52 24 48 15 48 6C56 10 60 19 60 30Z" />
      <path d="M60 30C68 24 72 15 72 6C64 10 60 19 60 30Z" />
      {/* alternating side leaves */}
      <path d="M60 70C44 66 33 54 31 38C47 42 58 55 60 70Z" />
      <path d="M60 96C76 92 87 80 89 64C73 68 62 81 60 96Z" />
      <path d="M60 122C44 118 33 106 31 90C47 94 58 107 60 122Z" />
      <path d="M60 148C76 144 87 132 89 116C73 120 62 133 60 148Z" />
      <path d="M60 174C44 170 33 158 31 142C47 146 58 159 60 174Z" />
    </svg>
  );
}
