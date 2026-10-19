import React, { useEffect, useRef } from "react";
import { ScrollTrigger, reduce } from "../motion";
import { site } from "../data/siteData";
import { build, CAPTIONS, clamp } from "./NightWalk";

const WALK_END = 0.6;   // the walk takes the first 60% of the scroll, then the camera rises into the billboard
const PLAY_AT = 0.8;    // the reel starts from frame 0 when the billboard nearly fills the screen

/* one continuous camera move: walk the street, look up, push into the billboard, the reel plays full-bleed */
export default function NightReel() {
  const root = useRef(), host = useRef(), vig = useRef(), bar = useRef(), walkUi = useRef(), finale = useRef();
  const caps = useRef([]);

  useEffect(() => {
    const narrow = window.innerWidth < 768, still = reduce();
    let world;
    try { world = build(host.current, narrow, site.reel); } catch (e) { console.warn("NightReel: WebGL unavailable", e); return; }
    const s = { target: still ? 1 : 0, cur: still ? 1 : 0, px: 0, py: 0 };
    const vs = { on: false };

    const ui = (P) => {
      const wp = clamp(P / WALK_END);
      walkUi.current.style.opacity = 1 - clamp((P - 0.5) / 0.08);
      CAPTIONS.forEach((c, k) => {
        const el = caps.current[k];
        if (!el) return;
        const v = clamp(Math.min((wp - c.a) / 0.04, (c.b - wp) / 0.04));
        el.style.opacity = v;
        el.style.transform = `translateY(${(1 - v) * 24}px)`;
      });
      vig.current.style.opacity = 1 - clamp((P - 0.78) / 0.2);
      const f = clamp((P - 0.88) / 0.08);
      finale.current.style.opacity = f;
      finale.current.style.transform = `translateY(${(1 - f) * 20}px)`;
      bar.current.style.transform = `scaleX(${P})`;

      // play from the first frame when we arrive, rewind if you scroll back
      const v = world.video;
      if (v && v.readyState >= 1) {
        if (!vs.on && P > PLAY_AT) { vs.on = true; v.currentTime = 0; v.play().catch(() => {}); }
        else if (vs.on && P < PLAY_AT - 0.04) { vs.on = false; v.pause(); v.currentTime = 0; world.refresh(); }
      }
    };

    let raf = 0, last = performance.now(), running = false;
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      s.cur += (s.target - s.cur) * (1 - Math.pow(0.001, dt));
      ui(s.cur);
      world.frame(s.cur, s.px, s.py, dt, now / 1000);
    };
    const start = () => { if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(loop); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    const ro = new ResizeObserver(() => world.resize());
    ro.observe(host.current);
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) start();
      else { stop(); world.video?.pause(); vs.on = false; }
    }, { threshold: 0 });
    io.observe(root.current);

    let st, onMove;
    if (!still) {
      st = ScrollTrigger.create({ trigger: root.current, pin: true, start: "top top", end: "+=480%", onUpdate: (self) => { s.target = self.progress; } });
      onMove = (ev) => { s.px = (ev.clientX / window.innerWidth - 0.5) * 2; s.py = (ev.clientY / window.innerHeight - 0.5) * 2; };
      window.addEventListener("mousemove", onMove);
    }
    return () => {
      stop(); ro.disconnect(); io.disconnect(); st?.kill();
      if (onMove) window.removeEventListener("mousemove", onMove);
      world.dispose();
    };
  }, []);

  return (
    <section id="reel" ref={root} aria-label="Night walk and showreel" className="relative h-screen overflow-hidden bg-[var(--night)]">
      <h2 className="sr-only">Night walk and showreel</h2>
      <div ref={host} className="absolute inset-0 z-0" />
      <div ref={vig} className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,.65)_100%)]" />

      <div ref={walkUi} className="pointer-events-none absolute inset-0 z-[5]">
        <p className="mono absolute left-6 top-24 text-[11px] uppercase tracking-[.2em] text-[var(--mute)] md:left-10">Night walk, scroll to move</p>
        <div className="absolute inset-x-0 bottom-[14vh] mx-auto h-40 w-full max-w-[1320px] px-6 md:px-10">
          {CAPTIONS.map((c, k) => (
            <div key={c.k} ref={(el) => (caps.current[k] = el)} className="absolute inset-x-6 bottom-0 opacity-0 md:inset-x-10">
              <p className="mono mb-3 text-xs uppercase tracking-[.2em] text-[var(--tungsten)]">{c.k}</p>
              <p className="font-serif-d text-4xl leading-none text-[var(--bone)] md:text-7xl">{c.t}</p>
            </div>
          ))}
        </div>
      </div>

      <div ref={finale} className="pointer-events-none absolute bottom-12 left-6 z-20 opacity-0 [text-shadow:0_2px_30px_rgba(0,0,0,.6)] md:bottom-16 md:left-10">
        <p className="mono mb-2 text-[11px] uppercase tracking-[.25em] text-white/80">Showreel, 2026</p>
        <p className="font-serif-d text-5xl italic leading-none text-white md:text-8xl">After dark.</p>
      </div>

      <div className="absolute inset-x-6 bottom-6 z-30 h-px bg-white/15 md:inset-x-10">
        <div ref={bar} className="h-full origin-left bg-[var(--tungsten)]" style={{ transform: "scaleX(0)" }} />
      </div>
    </section>
  );
}