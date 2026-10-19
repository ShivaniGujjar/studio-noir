import React, { useEffect, useRef, useState } from "react";
import { gsap, reduce } from "../motion";
import { site, projects } from "../data/siteData";

const pad = (n) => String(n).padStart(2, "0");

/* pinned showreel: small framed window grows to full-bleed as you scroll,
   film strips run off the edges, dust flickers over the picture */
export default function Reel() {
  const root = useRef(), frame = useRef(), tc = useRef(), title = useRef();
  const frames = projects.flatMap((p) => p.images);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (site.reel || reduce()) return;
    const t = setInterval(() => setI((x) => (x + 1) % frames.length), 2600);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const H = () => window.innerHeight;
      const narrow = window.innerWidth < 768;
      gsap.set(frame.current, { clipPath: narrow ? "inset(22% 6% 22% 6%)" : "inset(16% 24% 16% 24%)" });
      gsap.set(".strip-top", { y: () => H() * (narrow ? 0.22 : 0.16) - 56 });
      gsap.set(".strip-bottom", { y: () => -H() * (narrow ? 0.22 : 0.16) + 56 });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current, pin: true, scrub: 1, start: "top top", end: "+=150%", invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (!tc.current) return;
            const f = Math.round(self.progress * 24 * 18);
            tc.current.textContent = `TC 00:00:${pad(Math.floor(f / 24))}:${pad(f % 24)}`;
          },
        },
      });
      tl.to(frame.current, { clipPath: "inset(0% 0% 0% 0%)", duration: 1 }, 0)
        .fromTo(".reel-media", { scale: 1.35 }, { scale: 1, duration: 1 }, 0)
        .to(".strip-top", { y: -60, duration: 1 }, 0.1)
        .to(".strip-bottom", { y: 60, duration: 1 }, 0.1)
        .to(".strip", { backgroundPositionX: "-640px", duration: 1.2 }, 0)
        .to(title.current, { opacity: 0, scale: 1.15, duration: 0.5 }, 0.55);
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="reel" ref={root} aria-label="Showreel" className="relative h-screen overflow-hidden bg-[var(--night)]">
      <div ref={title} className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 text-white [text-shadow:0_4px_40px_rgba(0,0,0,.55)]">
        <p className="mono text-xs uppercase tracking-[.3em]">Showreel, 2026</p>
        <h2 className="font-serif-d text-[clamp(3.5rem,17vw,16rem)] italic leading-[.85]">After dark.</h2>
      </div>
      <div className="strip strip-top" />
      <div className="strip strip-bottom" />

      <div ref={frame} className="absolute inset-0 z-10 overflow-hidden bg-black">
        <div className="reel-media absolute inset-0 contrast-[1.05] saturate-[1.1]">
          {site.reel ? (
            <video className="h-full w-full object-cover" src={site.reel.src} poster={site.reel.poster} autoPlay muted loop playsInline />
          ) : (
            frames.map((src, n) => (
              <img key={src} src={src} alt="" className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms]" style={{ opacity: n === i ? 1 : 0 }} />
            ))
          )}
        </div>
        <div className="dust pointer-events-none absolute inset-0 z-20" aria-hidden="true" />
        <div className="vignette pointer-events-none absolute inset-0 z-20" aria-hidden="true" />
        <span className="vf vf-tl" /><span className="vf vf-tr" /><span className="vf vf-bl" /><span className="vf vf-br" />
        <p className="mono absolute left-8 top-8 z-30 flex items-center gap-2 text-xs text-white md:left-14 md:top-14">
          <span className="rec-dot inline-block h-2.5 w-2.5 rounded-full bg-[var(--red)]" /> REC
        </p>
        <p ref={tc} className="mono absolute bottom-8 right-8 z-30 text-xs text-white md:bottom-14 md:right-14">TC 00:00:00:00</p>
      </div>
    </section>
  );
}