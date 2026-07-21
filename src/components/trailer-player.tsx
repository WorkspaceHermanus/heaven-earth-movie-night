"use client";

import { useEffect, useRef, useState } from "react";

/** Fraction of the frame that must be on screen before the trailer plays. */
const VISIBLE_RATIO = 0.5;

/**
 * Trailer that starts itself once it scrolls into view and pauses again when
 * it leaves, so it never plays out of sight.
 *
 * Browsers only permit autoplay while muted, so it starts muted and the
 * viewer unmutes with the player's own control. The iframe is not mounted at
 * all until it first comes into view, keeping YouTube's payload off the
 * initial page load, and prefers-reduced-motion mounts it without autoplay.
 *
 * Visibility is tracked with an IntersectionObserver *and* a scroll-driven
 * geometry check. The redundancy matters: if the observer never reports (some
 * embedded and headless browsers), the fallback still mounts the player so a
 * viewer is never left staring at an empty frame.
 */
export function TrailerPlayer({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const mountedRef = useRef(false);
  const inViewRef = useRef(false);
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const command = (func: "playVideo" | "pauseVideo") => {
      frameRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func, args: [] }),
        "*",
      );
    };

    const isVisibleEnough = () => {
      const rect = el.getBoundingClientRect();
      if (rect.height === 0) return false;
      const viewportH = window.innerHeight || document.documentElement.clientHeight;
      const visible = Math.min(rect.bottom, viewportH) - Math.max(rect.top, 0);
      return visible / rect.height >= VISIBLE_RATIO;
    };

    /** Acts only on a change of state, so scrolling never spams the player. */
    const sync = () => {
      const inView = isVisibleEnough();
      if (inView === inViewRef.current) return;
      inViewRef.current = inView;

      if (inView) {
        if (!mountedRef.current) {
          mountedRef.current = true;
          const params = new URLSearchParams({
            autoplay: reduce ? "0" : "1",
            mute: "1",
            playsinline: "1",
            rel: "0",
            modestbranding: "1",
            enablejsapi: "1",
          });
          setSrc(
            `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`,
          );
        } else if (!reduce) {
          command("playVideo");
        }
      } else if (mountedRef.current) {
        command("pauseVideo");
      }
    };

    const observer = new IntersectionObserver(sync, {
      threshold: [0, VISIBLE_RATIO, 1],
    });
    observer.observe(el);

    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync, { passive: true });
    // Covers the case where the player is already on screen at first paint.
    sync();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [videoId]);

  return (
    <div ref={wrapRef} className="aspect-video w-full bg-sand-600">
      {src ? (
        <iframe
          ref={frameRef}
          src={src}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="h-full w-full"
        />
      ) : null}
    </div>
  );
}
