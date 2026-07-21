import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion";
import { TrailerPlayer } from "@/components/trailer-player";
import { EVENT } from "@/lib/event";

/**
 * The evening's programme alongside the War Room trailer. The trailer is
 * embedded via YouTube's privacy-enhanced domain and lazy-loaded so it
 * costs nothing until it scrolls into view.
 */
export function FilmSection() {
  return (
    <section id="film" className="section scroll-mt-20 bg-sand-500 text-white">
      <div className="container">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
          <div>
            <Reveal>
              <div className="flex items-center gap-5">
                <span className="block h-px w-12 bg-white/40" aria-hidden />
                <p className="text-[0.7rem] uppercase tracking-[0.3em] text-white/80">
                  The Evening&rsquo;s Flow
                </p>
              </div>
              <h2 className="mt-6 font-display text-4xl font-light leading-tight sm:text-5xl">
                Worship, then{" "}
                <em className="font-normal text-blush-100">{EVENT.movie.title}</em>
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-white/80">
                {EVENT.movie.tagline}
              </p>
            </Reveal>

            <StaggerGroup className="mt-10">
              {EVENT.schedule.map((item) => (
                <StaggerItem key={item.title}>
                  <div className="flex items-baseline justify-between gap-6 border-t border-white/20 py-5 first:border-t-0">
                    <span className="font-display text-2xl font-light leading-snug">
                      {item.title}
                    </span>
                    <span className="whitespace-nowrap text-[0.7rem] uppercase tracking-[0.2em] text-white/75">
                      {item.time}
                    </span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>

          <Reveal delay={0.1}>
            {/* Inset keyline frame, matching the detail tiles. */}
            <div className="border border-white/30 p-2.5">
              <TrailerPlayer
                videoId={EVENT.movie.trailerYouTubeId}
                title={`${EVENT.movie.title} — official trailer`}
              />
            </div>
            <p className="mt-4 text-center text-[0.65rem] uppercase tracking-[0.24em] text-white/60">
              Starts muted — tap the player for sound
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
