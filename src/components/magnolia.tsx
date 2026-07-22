import { cn } from "@/lib/utils";

/**
 * Broad, cupped magnolia tepal: tapered base, widest around two-thirds up,
 * rounded tip. `curl` drifts the tip sideways so no two petals are identical.
 */
function petal(len: number, wid: number, curl = 0) {
  return [
    `M0 0`,
    `C${-wid * 0.5} ${-len * 0.1} ${-wid * 1.02} ${-len * 0.4} ${-wid * 0.74 + curl * 0.4} ${-len * 0.75}`,
    `C${-wid * 0.52 + curl * 0.9} ${-len * 0.99} ${wid * 0.52 + curl * 0.9} ${-len * 0.99} ${wid * 0.74 + curl * 0.4} ${-len * 0.75}`,
    `C${wid * 1.02} ${-len * 0.4} ${wid * 0.5} ${-len * 0.1} 0 0Z`,
  ].join(" ");
}

/** Narrow, pointed variant for the closed buds. */
function budPetal(len: number, wid: number, curl = 0) {
  return [
    `M0 0`,
    `C${-wid} ${-len * 0.3} ${-wid * 0.82 + curl * 0.5} ${-len * 0.74} ${curl} ${-len}`,
    `C${wid * 0.82 + curl * 0.5} ${-len * 0.74} ${wid} ${-len * 0.3} 0 0Z`,
  ].join(" ");
}

function leafPath(len: number, wid: number) {
  return [
    `M0 0`,
    `C${wid} ${-len * 0.28} ${wid * 0.86} ${-len * 0.74} 0 ${-len}`,
    `C${-wid * 0.86} ${-len * 0.74} ${-wid} ${-len * 0.28} 0 0Z`,
  ].join(" ");
}

/**
 * Outer whorl. Lengths are deliberately uneven and `off` pushes each petal
 * out along its own axis, so the silhouette is organic rather than a tidy
 * rosette.
 */
const BACK = [
  { a: -14, len: 134, wid: 64, curl: 9, off: 14, g: "pB" },
  { a: 42, len: 116, wid: 56, curl: -8, off: -4, g: "pA" },
  { a: 88, len: 130, wid: 62, curl: 7, off: 10, g: "pC" },
  { a: 141, len: 108, wid: 53, curl: -10, off: -6, g: "pA" },
  { a: 194, len: 126, wid: 60, curl: 8, off: 12, g: "pB" },
  { a: 249, len: 104, wid: 51, curl: -7, off: -5, g: "pC" },
  { a: 302, len: 132, wid: 63, curl: 10, off: 8, g: "pA" },
];

/** Inner cup: shorter and paler, closing in over the outer whorl's bases. */
const FRONT = [
  { a: 14, len: 88, wid: 48, curl: 12, g: "pF" },
  { a: 86, len: 76, wid: 42, curl: -10, g: "pG" },
  { a: 168, len: 84, wid: 46, curl: 11, g: "pF" },
  { a: 246, len: 74, wid: 41, curl: -9, g: "pG" },
  { a: 312, len: 86, wid: 47, curl: 10, g: "pF" },
];

const LEAVES = [
  { x: 80, y: 356, rot: -40, s: 0.95, len: 132, wid: 36 },
  { x: 154, y: 296, rot: 48, s: 0.85, len: 120, wid: 33 },
  { x: 304, y: 244, rot: 92, s: 0.82, len: 128, wid: 35 },
  { x: 336, y: 190, rot: 36, s: 0.7, len: 108, wid: 30 },
  { x: 58, y: 304, rot: -78, s: 0.72, len: 112, wid: 31 },
];

/**
 * Original watercolour-style magnolia in the brand's dusty-rose and sage
 * palette, used as a soft watermark behind the hero. Petal edges carry a
 * faint stroke so the tepals stay legible once the whole thing is dropped to
 * a third of its opacity.
 */
export function Magnolia({
  className,
  variant = "bloom",
}: {
  className?: string;
  variant?: "bloom" | "bud";
}) {
  const u = variant;
  const edge = {
    stroke: "#C79A8C",
    strokeWidth: 1.1,
    strokeOpacity: 0.45,
  };

  const bud = (x: number, y: number, rot: number, s: number) => (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d={budPetal(118, 34, -6)} fill={`url(#bA-${u})`} {...edge} transform="rotate(-11)" />
      <path d={budPetal(112, 32, 7)} fill={`url(#bB-${u})`} {...edge} transform="rotate(13)" />
      <path d={budPetal(104, 24, 1)} fill={`url(#bC-${u})`} {...edge} />
    </g>
  );

  return (
    <svg viewBox="0 0 400 400" fill="none" aria-hidden className={cn("select-none", className)}>
      <defs>
        <radialGradient id={`pA-${u}`} cx="50%" cy="96%" r="88%">
          <stop offset="0%" stopColor="#FDF3EE" />
          <stop offset="45%" stopColor="#F4DED4" />
          <stop offset="100%" stopColor="#D6A99B" />
        </radialGradient>
        <radialGradient id={`pB-${u}`} cx="50%" cy="98%" r="90%">
          <stop offset="0%" stopColor="#FFFAF7" />
          <stop offset="48%" stopColor="#F7E5DD" />
          <stop offset="100%" stopColor="#CFA294" />
        </radialGradient>
        <radialGradient id={`pC-${u}`} cx="50%" cy="94%" r="86%">
          <stop offset="0%" stopColor="#FCF1EB" />
          <stop offset="44%" stopColor="#F0D6CB" />
          <stop offset="100%" stopColor="#C99A8B" />
        </radialGradient>
        <radialGradient id={`pF-${u}`} cx="50%" cy="98%" r="92%">
          <stop offset="0%" stopColor="#FFFEFD" />
          <stop offset="52%" stopColor="#FCEFE9" />
          <stop offset="100%" stopColor="#E0B9AC" />
        </radialGradient>
        <radialGradient id={`pG-${u}`} cx="50%" cy="98%" r="92%">
          <stop offset="0%" stopColor="#FFFCFA" />
          <stop offset="55%" stopColor="#F9E8E1" />
          <stop offset="100%" stopColor="#D9B0A2" />
        </radialGradient>
        <radialGradient id={`bA-${u}`} cx="45%" cy="94%" r="90%">
          <stop offset="0%" stopColor="#F5DBD2" />
          <stop offset="58%" stopColor="#DFB0A3" />
          <stop offset="100%" stopColor="#C0867A" />
        </radialGradient>
        <radialGradient id={`bB-${u}`} cx="55%" cy="94%" r="90%">
          <stop offset="0%" stopColor="#F9E4DC" />
          <stop offset="58%" stopColor="#E3B8AB" />
          <stop offset="100%" stopColor="#C68F83" />
        </radialGradient>
        <radialGradient id={`bC-${u}`} cx="50%" cy="92%" r="88%">
          <stop offset="0%" stopColor="#FFF8F5" />
          <stop offset="60%" stopColor="#F2D7CD" />
          <stop offset="100%" stopColor="#D6A497" />
        </radialGradient>
        <radialGradient id={`lf-${u}`} cx="38%" cy="88%" r="92%">
          <stop offset="0%" stopColor="#C0C8B4" />
          <stop offset="100%" stopColor="#93A085" />
        </radialGradient>
        <filter id={`soft-${u}`} x="-12%" y="-12%" width="124%" height="124%">
          <feGaussianBlur stdDeviation="0.9" />
        </filter>
      </defs>

      <g filter={`url(#soft-${u})`}>
        {/* branch */}
        <g stroke="#A98B72" strokeLinecap="round" fill="none">
          <path d="M28 386 C94 346 148 302 192 252" strokeWidth="6" opacity="0.8" />
          <path d="M248 208 C290 184 322 154 340 122" strokeWidth="5" opacity="0.7" />
          <path d="M148 296 C130 304 110 300 94 286" strokeWidth="4" opacity="0.65" />
        </g>

        {LEAVES.map((l) => (
          <g
            key={`${l.x}-${l.y}`}
            transform={`translate(${l.x} ${l.y}) rotate(${l.rot}) scale(${l.s})`}
          >
            <path
              d={leafPath(l.len, l.wid)}
              fill={`url(#lf-${u})`}
              stroke="#74846A"
              strokeWidth="1"
              strokeOpacity="0.35"
            />
            <path
              d={`M0 -4 C3 ${-l.len * 0.35} 3 ${-l.len * 0.7} 0 ${-l.len + 6}`}
              stroke="#6F7F62"
              strokeWidth="1.5"
              fill="none"
              opacity="0.4"
            />
          </g>
        ))}

        {variant === "bud" ? (
          bud(200, 300, 8, 1.25)
        ) : (
          <>
            {bud(344, 120, 26, 0.88)}
            {bud(88, 292, -150, 0.72)}

            {/* Squashed and tilted so the bloom reads as a three-quarter view. */}
            <g transform="translate(210 176) rotate(-12) scale(1 0.83)">
              {BACK.map((p) => (
                <path
                  key={p.a}
                  d={petal(p.len, p.wid, p.curl)}
                  fill={`url(#${p.g}-${u})`}
                  {...edge}
                  transform={`rotate(${p.a}) translate(0 ${-p.off})`}
                />
              ))}

              {/* Shadow pooling under the inner cup. */}
              <ellipse cx="0" cy="4" rx="52" ry="46" fill="#C89485" opacity="0.34" />

              {FRONT.map((p) => (
                <path
                  key={p.a}
                  d={petal(p.len, p.wid, p.curl)}
                  fill={`url(#${p.g}-${u})`}
                  {...edge}
                  transform={`rotate(${p.a})`}
                />
              ))}

              {/* stamen cone, kept pale so it never reads as a dark dot */}
              <ellipse cx="0" cy="1" rx="26" ry="22" fill="#FBEDDC" opacity="0.85" />
              <g stroke="#D8B27A" strokeWidth="1.3" strokeLinecap="round" opacity="0.7">
                <path d="M-8 -8 L-17 -19" />
                <path d="M-3 -12 L-6 -25" />
                <path d="M4 -12 L7 -25" />
                <path d="M8 -8 L17 -19" />
                <path d="M-11 3 L-23 4" />
                <path d="M11 3 L23 4" />
                <path d="M-6 11 L-13 21" />
                <path d="M6 11 L13 21" />
              </g>
              <ellipse cx="0" cy="0" rx="12" ry="13" fill="#EFD3A4" opacity="0.9" />
              <path
                d="M0 -15 C5 -12 7 -4 5 3 C3 7 -3 7 -5 3 C-7 -4 -5 -12 0 -15Z"
                fill="#DCB26E"
                opacity="0.85"
              />
            </g>
          </>
        )}
      </g>
    </svg>
  );
}
