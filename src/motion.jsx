import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };
export const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* smooth scroll synced with ScrollTrigger; locked until the preloader reveals */
export function useSmoothScroll(ready) {
  const lenis = useRef(null);
  useEffect(() => {
    if (reduce()) return;
    const l = new Lenis({ lerp: 0.1 });
    lenis.current = l;
    l.stop();
    l.on("scroll", ScrollTrigger.update);
    const tick = (t) => l.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => { window.removeEventListener("load", onLoad); gsap.ticker.remove(tick); l.destroy(); };
  }, []);
  useEffect(() => {
    if (!ready) return;
    lenis.current?.start();
    ScrollTrigger.refresh();
  }, [ready]);
}

export function Preloader({ onReveal }) {
  const count = useRef(), line = useRef(), root = useRef();
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const q = reduce();
    const o = { v: 0 };
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(".pl-word", { yPercent: 110 }, { yPercent: 0, duration: q ? 0.01 : 1.1, ease: "expo.out" })
      .to(o, { v: 100, duration: q ? 0.1 : 1.8, ease: "power2.inOut", onUpdate: () => {
        if (count.current) count.current.textContent = `${String(Math.round(o.v)).padStart(2, "0")}%`;
        if (line.current) line.current.style.transform = `scaleX(${o.v / 100})`;
      } }, 0.2)
      .to(".pl-word", { yPercent: -110, duration: q ? 0.01 : 0.6, ease: "power3.in" }, "+=0.2")
      .to([line.current, ".pl-meta"], { opacity: 0, duration: 0.3 }, "<")
      .add(onReveal)
      .to(".pl-top", { yPercent: -100, duration: q ? 0.01 : 1.1, ease: "expo.inOut" }, "<0.1")
      .to(".pl-bot", { yPercent: 100, duration: q ? 0.01 : 1.1, ease: "expo.inOut", onComplete: () => setGone(true) }, "<");
    return () => tl.kill();
  }, []);
  if (gone) return null;
  return (
    <div ref={root} className="fixed inset-0 z-[70]" aria-hidden="true">
      <div className="pl-top absolute inset-x-0 top-0 flex h-1/2 items-end bg-[var(--night)] px-6 pb-5 md:px-10">
        <span className="block overflow-hidden pb-1">
          <span className="pl-word font-serif-d block text-5xl italic text-[var(--bone)] md:text-7xl">Studio Noir</span>
        </span>
      </div>
      <div className="pl-bot absolute inset-x-0 bottom-0 flex h-1/2 items-start justify-between bg-[var(--night)] px-6 pt-5 md:px-10">
        <p className="pl-meta mono text-[11px] uppercase tracking-[.18em] text-[var(--mute)]">Developing</p>
        <span ref={count} className="pl-meta mono text-[11px] tabular-nums tracking-[.18em] text-[var(--bone)]">00%</span>
      </div>
      <div ref={line} className="absolute left-0 right-0 top-1/2 z-10 h-px origin-left bg-[var(--bone)]" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}

export function Cursor() {
  const dot = useRef();
  const [label, setLabel] = useState("");
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    gsap.set(dot.current, { xPercent: -50, yPercent: -50 });
    const x = gsap.quickTo(dot.current, "x", { duration: 0.35, ease: "power3" });
    const y = gsap.quickTo(dot.current, "y", { duration: 0.35, ease: "power3" });
    const move = (e) => {
      setOn(true); x(e.clientX); y(e.clientY);
      const t = e.target.closest?.("[data-cursor]");
      setLabel(t ? t.dataset.cursor : "");
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  const s = label ? 84 : 14;
  return (
    <div ref={dot} aria-hidden="true"
      className="mono pointer-events-none fixed left-0 top-0 z-[80] flex items-center justify-center rounded-full bg-[var(--red)] text-[11px] text-white"
      style={{ width: s, height: s, opacity: on ? 1 : 0, transition: "width .3s, height .3s, opacity .3s" }}>{label}</div>
  );
}

/* line-masked character reveal for the hero title */
export function Chars({ lines, ready, className }) {
  const ref = useRef();
  useEffect(() => {
    if (!ready) return;
    const c = ref.current.querySelectorAll(".ch");
    if (reduce()) { gsap.set(c, { y: 0 }); return; }
    const t = gsap.fromTo(c, { yPercent: 115, rotate: 6 }, { yPercent: 0, rotate: 0, duration: 1.1, ease: "expo.out", stagger: 0.04 });
    return () => t.kill();
  }, [ready]);
  return (
    <h1 ref={ref} className={className} aria-label={lines.join(" ")}>
      {lines.map((l, i) => (
        <span key={i} aria-hidden="true" className="block overflow-hidden pb-[.12em]">
          {[...l].map((c, j) => <span key={j} className="ch">{c === " " ? "\u00A0" : c}</span>)}
        </span>
      ))}
    </h1>
  );
}

/* words light up as you scroll through the statement */
export function Scrub({ text, className }) {
  const ref = useRef();
  useEffect(() => {
    const w = ref.current.querySelectorAll(".w");
    if (reduce()) return;
    const t = gsap.fromTo(w, { opacity: 0.15 }, { opacity: 1, stagger: 0.1, ease: "none",
      scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom 45%", scrub: true } });
    return () => { t.scrollTrigger?.kill(); t.kill(); };
  }, []);
  return <p ref={ref} className={className}>{text.split(" ").map((w, i) => <span key={i} className="w mr-[.25em] inline-block">{w}</span>)}</p>;
}

/* fires once when an element enters the viewport (more reliable than scroll maths around pinned sections) */
export function onView(el, fn) {
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { fn(); io.disconnect(); } }, { rootMargin: "0px 0px -8% 0px" });
  io.observe(el);
  return () => io.disconnect();
}

export function Reveal({ as: Tag = "div", children, className = "", y = 48 }) {
  const ref = useRef();
  useLayoutEffect(() => {
    if (reduce()) return;
    gsap.set(ref.current, { y, opacity: 0 });
    return onView(ref.current, () => gsap.to(ref.current, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }));
  }, [y]);
  return <Tag ref={ref} className={className}>{children}</Tag>;
}

export function Marquee({ items }) {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-[var(--line)] py-6" aria-label={items.join(", ")}>
      <div className="marquee flex w-max" aria-hidden="true">
        {row.map((c, i) => (
          <span key={i} className="font-serif-d mr-12 whitespace-nowrap text-5xl md:text-7xl">{c}<span className="brush ml-12 text-[var(--red)]">*</span></span>
        ))}
      </div>
    </div>
  );
}

/* element drifts toward the cursor, springs back on leave */
export function Magnetic({ children, strength = 0.35, className = "" }) {
  const ref = useRef();
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || reduce()) return;
    const el = ref.current;
    const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const move = (e) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * strength);
      y((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => { x(0); y(0); };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); };
  }, [strength]);
  return <div ref={ref} className={`inline-block ${className}`}>{children}</div>;
}

/* film-roll frame counter that follows page progress */
export function ScrollMeter() {
  const ref = useRef();
  useEffect(() => {
    const st = ScrollTrigger.create({ start: 0, end: "max", onUpdate: (s) => {
      if (ref.current) ref.current.textContent = `FRAME ${String(Math.round(s.progress * 35) + 1).padStart(2, "0")}/36`;
    } });
    return () => st.kill();
  }, []);
  return <p ref={ref} aria-hidden="true" className="mono pointer-events-none fixed bottom-4 left-6 z-30 text-[11px] text-[var(--bone)] mix-blend-difference md:left-10">FRAME 01/36</p>;
}

/* ripple distortion on hover: SVG displacement filter, no WebGL needed */
export function WarpDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <filter id="warp" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.008 0.02" numOctaves="2" seed="3" result="n" />
        <feDisplacementMap id="warp-map" in="SourceGraphic" in2="n" scale="0" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}
export const warp = {
  onMouseEnter: (e) => {
    if (reduce()) return;
    const el = e.currentTarget;
    el.style.filter = "url(#warp)";
    gsap.fromTo("#warp-map", { attr: { scale: 90 } }, { attr: { scale: 0 }, duration: 1.1, ease: "expo.out", overwrite: true,
      onComplete: () => { el.style.filter = ""; } });
  },
};