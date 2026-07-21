import { cn } from "@/lib/utils";

/** One petal, base at the origin, tip pointing up. Rotated into a bloom. */
const PETAL =
  "M0 0 C-34 -12 -50 -50 -32 -82 C-20 -102 20 -102 32 -82 C50 -50 34 -12 0 0Z";

/** Symmetric leaf with the base at the origin, tip pointing up. */
const LEAF = "M0 0 C26 -30 28 -76 0 -106 C-28 -76 -26 -30 0 0Z";

const BACK_PETALS = [
  { angle: 4, scale: 1.0 },
  { angle: 55, scale: 0.94 },
  { angle: 104, scale: 1.02 },
  { angle: 152, scale: 0.9 },
  { angle: 205, scale: 0.98 },
  { angle: 256, scale: 0.92 },
  { angle: 308, scale: 1.0 },
];

const FRONT_PETALS = [
  { angle: 28, scale: 0.62 },
  { angle: 126, scale: 0.58 },
  { angle: 231, scale: 0.63 },
  { angle: 330, scale: 0.57 },
];

/**
 * Original watercolour-style magnolia, drawn in the brand's dusty-rose and
 * sage palette. Used as a soft watermark behind the hero — hence the gentle
 * blur and translucent fills rather than crisp edges.
 *
 * `variant="bloom"` is the full open flower on a leafy branch;
 * `variant="bud"` is a smaller closed bud for secondary placements.
 */
export function Magnolia({
  className,
  variant = "bloom",
}: {
  className?: string;
  variant?: "bloom" | "bud";
}) {
  const uid = variant;

  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden
      className={cn("select-none", className)}
    >
      <defs>
        <radialGradient id={`mag-back-${uid}`} cx="50%" cy="88%" r="80%">
          <stop offset="0%" stopColor="#FBEDE7" />
          <stop offset="52%" stopColor="#EFD5CB" />
          <stop offset="100%" stopColor="#D4A99D" />
        </radialGradient>
        <radialGradient id={`mag-front-${uid}`} cx="50%" cy="90%" r="78%">
          <stop offset="0%" stopColor="#FFFBF8" />
          <stop offset="60%" stopColor="#F8E7E0" />
          <stop offset="100%" stopColor="#E3BFB4" />
        </radialGradient>
        <radialGradient id={`mag-leaf-${uid}`} cx="40%" cy="85%" r="85%">
          <stop offset="0%" stopColor="#B9C3AC" />
          <stop offset="100%" stopColor="#8E9C82" />
        </radialGradient>
        <filter id={`mag-soft-${uid}`} x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="1.1" />
        </filter>
      </defs>

      <g filter={`url(#mag-soft-${uid})`}>
        {/* branch */}
        <path
          d="M44 372 C104 330 150 292 196 240"
          stroke="#A98A78"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.75"
        />

        {/* leaves along the branch */}
        <g opacity="0.85">
          <g transform="translate(96 330) rotate(-52) scale(0.78)">
            <path d={LEAF} fill={`url(#mag-leaf-${uid})`} />
            <path
              d="M0 -4 C4 -36 4 -72 0 -100"
              stroke="#7C8A70"
              strokeWidth="2"
              opacity="0.5"
            />
          </g>
          <g transform="translate(150 292) rotate(38) scale(0.7)">
            <path d={LEAF} fill={`url(#mag-leaf-${uid})`} />
            <path
              d="M0 -4 C4 -34 4 -68 0 -96"
              stroke="#7C8A70"
              strokeWidth="2"
              opacity="0.5"
            />
          </g>
          <g transform="translate(268 300) rotate(74) scale(0.66)">
            <path d={LEAF} fill={`url(#mag-leaf-${uid})`} />
          </g>
        </g>

        {variant === "bud" ? (
          /* Closed bud: three overlapping petals wrapped tight. */
          <g transform="translate(200 210)">
            <path
              d={PETAL}
              fill={`url(#mag-back-${uid})`}
              transform="rotate(-16) scale(0.86)"
              opacity="0.9"
            />
            <path
              d={PETAL}
              fill={`url(#mag-back-${uid})`}
              transform="rotate(18) scale(0.82)"
              opacity="0.9"
            />
            <path
              d={PETAL}
              fill={`url(#mag-front-${uid})`}
              transform="rotate(1) scale(0.66)"
            />
          </g>
        ) : (
          <g transform="translate(206 196)">
            {/* outer ring */}
            <g opacity="0.92">
              {BACK_PETALS.map(({ angle, scale }) => (
                <path
                  key={angle}
                  d={PETAL}
                  fill={`url(#mag-back-${uid})`}
                  transform={`rotate(${angle}) scale(${scale})`}
                />
              ))}
            </g>

            {/* inner cup */}
            <g opacity="0.96">
              {FRONT_PETALS.map(({ angle, scale }) => (
                <path
                  key={angle}
                  d={PETAL}
                  fill={`url(#mag-front-${uid})`}
                  transform={`rotate(${angle}) scale(${scale})`}
                />
              ))}
            </g>

            {/* stamen cluster */}
            <ellipse cx="0" cy="-6" rx="15" ry="17" fill="#F3DCCF" />
            <path
              d="M0 -22 C7 -20 10 -10 8 0 C4 6 -4 6 -8 0 C-10 -10 -7 -20 0 -22Z"
              fill="#D8A25C"
              opacity="0.9"
            />
            <g stroke="#C79553" strokeWidth="1.6" strokeLinecap="round" opacity="0.8">
              <path d="M-6 -14 L-11 -22" />
              <path d="M0 -17 L0 -27" />
              <path d="M6 -14 L11 -22" />
            </g>
          </g>
        )}
      </g>
    </svg>
  );
}
