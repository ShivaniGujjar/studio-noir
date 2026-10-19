import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { site, projects, services } from "../data/siteData";
import { gsap, reduce, onView, Reveal, Magnetic } from "../motion";

const wrap = "mx-auto w-full max-w-[1320px] px-6 md:px-10";

const rot = [-5, 3, -2, 4, -6, 2, -3];
export function Num({ n, pinned }) {
  const ref = useRef();
  const r = rot[(n - 1) % rot.length];
  useLayoutEffect(() => {
    if (pinned || reduce()) return;
    gsap.set(ref.current, { scale: 1.8, opacity: 0, rotate: r - 14 });
    return onView(ref.current, () => gsap.to(ref.current, { scale: 1, opacity: 1, rotate: r, duration: 0.7, ease: "back.out(2)" }));
  }, []);
  return <span ref={ref} className="num" aria-hidden="true" style={{ transform: `rotate(${r}deg) translateX(${(n % 3 - 1) * 8}px)` }}>{n}</span>;
}

/* torn paper PNG that hangs over the dark section below */
export const Torn = () => (
  <img src="/torn-edge.png" alt="" aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-full z-10 -mt-px h-8 w-full select-none object-fill md:h-14" />
);

const LENS = 160, ZOOM = 2.4;

function Tile({ f, n, marked, onMark, tilt, speed }) {
  const wrapRef = useRef(), lens = useRef(), zoom = useRef(), par = useRef();
  useEffect(() => {
    if (reduce() || window.innerWidth < 768) return;
    const t = gsap.fromTo(par.current, { y: speed }, { y: -speed, ease: "none",
      scrollTrigger: { trigger: par.current, start: "top bottom", end: "bottom top", scrub: true } });
    return () => { t.scrollTrigger?.kill(); t.kill(); };
  }, [speed]);
  const enter = () => {
    const b = wrapRef.current.getBoundingClientRect();
    zoom.current.style.width = `${b.width * ZOOM}px`;
    zoom.current.style.height = `${b.height * ZOOM}px`;
    lens.current.style.opacity = 1;
    lens.current.style.scale = "1";
  };
  const move = (ev) => {
    const b = wrapRef.current.getBoundingClientRect();
    const x = ev.clientX - b.left, y = ev.clientY - b.top, r = LENS / 2;
    lens.current.style.transform = `translate(${x - r}px, ${y - r}px)`;
    zoom.current.style.transform = `translate(${r - x * ZOOM}px, ${r - y * ZOOM}px)`;
  };
  const leave = () => { lens.current.style.opacity = 0; lens.current.style.scale = ".6"; };
  return (
    <figure className="sheet-fig relative">
      <div ref={par}>
        <div className={`tile ${tilt}`}>
          <button type="button" ref={wrapRef} aria-pressed={marked} onClick={onMark} onMouseEnter={enter} onMouseMove={move} onMouseLeave={leave}
            aria-label={`Frame ${n}A, ${f.title}. ${marked ? "Remove circle" : "Circle as keeper"}`}
            className="focus-ring relative block w-full overflow-hidden bg-black md:cursor-none">
            <img src={f.src} alt="" loading="lazy" className="aspect-[4/5] w-full object-cover grayscale contrast-125" />
            <div ref={lens} className="loupe pointer-events-none absolute left-0 top-0">
              <img ref={zoom} src={f.src} alt="" className="absolute left-0 top-0 max-w-none object-cover" />
            </div>
            {marked && <span className="stamp mono">Keeper</span>}
          </button>
          {marked && (
            <svg className="mark" viewBox="0 0 200 250" preserveAspectRatio="none" aria-hidden="true">
              <path pathLength="1" d="M100 8 C165 4 196 60 194 130 C192 200 150 244 96 240 C42 236 6 190 8 118 C10 48 52 12 112 14" />
            </svg>
          )}
        </div>
      </div>
      <figcaption className="mono mt-3 flex justify-between text-xs text-[#f4f1ea]">
        <span>{n}A</span><span className="text-[#aaa]">{f.title}</span>
      </figcaption>
    </figure>
  );
}

export function Sheet() {
  const grid = useRef();
  const frames = projects.flatMap((p) => p.images.map((src) => ({ src, title: p.title })));
  const [marked, setMarked] = useState(() => new Set([1]));
  const toggle = (i) => setMarked((m) => { const x = new Set(m); x.has(i) ? x.delete(i) : x.add(i); return x; });
  const tilts = ["tilt-l", "tilt-r", "", "tilt-r", "tilt-l"], speeds = [34, -26, 48, -38, 22];
  const note = marked.size === 0 ? "nothing circled yet. take your time." : marked.size === 1 ? "one keeper. good eye." : `${marked.size} keepers. hard to pick, right?`;

  useLayoutEffect(() => {
    if (reduce()) return;
    const figs = grid.current.querySelectorAll(".sheet-fig");
    const card = grid.current.querySelector(".note-card");
    gsap.set(figs, { opacity: 0, y: 70, rotate: (i) => (i % 2 ? 5 : -5) });
    if (card) gsap.set(card, { opacity: 0, y: 70 });
    return onView(grid.current, () => {
      const tl = gsap.timeline();
      tl.to(figs, { opacity: 1, y: 0, rotate: 0, duration: 0.9, ease: "power3.out", stagger: 0.12 });
      if (card) tl.to(card, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "<0.3");
    });
  }, []);

  return (
    <section id="sheet" aria-label="Contact sheet" className="paper relative scroll-mt-16 py-28 md:py-40">
      <Torn />
      <div className={wrap}>
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="flex items-end gap-6">
            <Num n={4} />
            <h2 className="font-serif-d text-5xl md:text-8xl">Contact sheet</h2>
          </div>
          <p className="mono text-xs leading-5 text-[var(--mute)] md:text-right">
            Keepers {marked.size} of {frames.length}<br />Hover for the loupe. Click to circle.
          </p>
        </div>
        <div className="bg-[#111] p-4 md:p-8">
          <p className="mono mb-8 flex justify-between text-[10px] uppercase tracking-[.2em] text-[#8d929b]"><span>Roll 07, proof sheet</span><span>{frames.length} frames</span></p>
          <div ref={grid} className="sheet-grid grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-3">
            {frames.map((f, i) => (
              <Tile key={f.src} f={f} n={12 + i} marked={marked.has(i)} onMark={() => toggle(i)} tilt={tilts[i % tilts.length]} speed={speeds[i % speeds.length]} />
            ))}
            <div className="note-card"><p className="note">{note}</p><p className="note mt-3 text-right">- the photographer</p></div>
          </div>
        </div>
        <a href="#contact" className="mono focus-ring mt-8 inline-block text-xs underline underline-offset-4">Tell me which one you would shoot next &rarr;</a>
      </div>
    </section>
  );
}

export function Services() {
  return (
    <section id="services" className="paper relative scroll-mt-16 border-t border-[var(--line)]">
      <Torn />
      <div className={`${wrap} py-28 md:py-40`}>
        <div className="mb-14 flex items-end gap-6">
          <Num n={6} />
          <h2 className="font-serif-d text-5xl md:text-8xl">What I shoot</h2>
        </div>
        <div className="grid gap-12 md:grid-cols-3">
          {services.map((s) => (
            <Reveal key={s.title} className="border-t-4 border-[var(--red)] pt-6">
              <h3 className="font-serif-d text-3xl">{s.title}</h3>
              <p className="mt-4 leading-relaxed text-[var(--mute)]">{s.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Enquiry() {
  const [f, setF] = useState({ name: "", project: "", message: "" });
  const on = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const send = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Enquiry: ${f.project || "new project"}`);
    const body = encodeURIComponent(`${f.message}\n\n${f.name}`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
  };
  return (
    <section id="contact" className={`${wrap} scroll-mt-16 py-28 md:py-40`}>
      <div className="grid gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Num n={7} />
          <h2 className="font-serif-d mt-6 text-5xl leading-none md:text-7xl">Tell me what you are making</h2>
        </div>
        <form onSubmit={send} className="mono space-y-6 md:col-span-7">
          <label className="block text-xs text-[var(--mute)]">Your name
            <input required className="field" value={f.name} onChange={on("name")} placeholder="Full name" /></label>
          <label className="block text-xs text-[var(--mute)]">Project
            <input required className="field" value={f.project} onChange={on("project")} placeholder="Campaign, music video, portrait" /></label>
          <label className="block text-xs text-[var(--mute)]">Details
            <textarea required rows={4} className="field resize-none" value={f.message} onChange={on("message")} placeholder="Dates, location, budget range" /></label>
          <Magnetic strength={0.3}><button className="focus-ring bg-[var(--red)] px-8 py-3 text-sm font-bold text-white shadow-[5px_5px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#000]">Send enquiry</button></Magnetic>
        </form>
      </div>
    </section>
  );
}

export function Lightbox({ project, onClose }) {
  const [i, setI] = useState(0);
  const n = project ? project.images.length : 0;
  useEffect(() => { setI(0); }, [project]);
  useEffect(() => {
    if (!project) return;
    const key = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setI((x) => (x + 1) % n);
      if (e.key === "ArrowLeft") setI((x) => (x - 1 + n) % n);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", key);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", key); };
  }, [project, onClose, n]);
  if (!project) return null;
  const btn = "focus-ring mono border border-[var(--line)] px-5 py-2 text-xs hover:border-[var(--red)]";
  return (
    <div data-lenis-prevent role="dialog" aria-modal="true" aria-label={project.title} className="fixed inset-0 z-50 flex flex-col bg-[#0a0c10]/95 backdrop-blur-sm">
      <div className={`${wrap} flex items-center justify-between py-6`}>
        <h3 className="brush text-3xl md:text-5xl">{project.title}</h3>
        <button onClick={onClose} autoFocus className={btn}>Close</button>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center px-6">
        <img src={project.images[i]} alt={`${project.title}, frame ${i + 1}`} className="max-h-full max-w-full object-contain" />
      </div>
      <div className={`${wrap} mono flex items-center justify-between py-6 text-xs text-[var(--mute)]`}>
        <span>Frame {i + 1} of {n}. {project.camera}</span>
        {n > 1 && (
          <div className="flex gap-3">
            <button className={btn} onClick={() => setI((i - 1 + n) % n)}>Previous</button>
            <button className={btn} onClick={() => setI((i + 1) % n)}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
}