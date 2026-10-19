import React, { useEffect, useRef, useState } from "react";
import { gsap, reduce, Preloader, Cursor, Chars, Scrub, Reveal, Marquee, Magnetic, ScrollMeter, WarpDefs, warp, ScrollTrigger, useSmoothScroll } from "./motion";
import "./Premium.css";
import { site, projects, story } from "./data/siteData";
import { Num, Torn, Sheet, Services, Enquiry, Lightbox } from "./components/Extras";
import Reel from "./components/Reel";

const wrap = "mx-auto w-full max-w-[1320px] px-6 md:px-10";

const toc = [
  ["Selected work", "#work"],
  ["The reel", "#reel"],
  ["Contact sheet", "#sheet"],
  ["How I got here", "#about"],
  ["What I shoot", "#services"],
  ["Send an enquiry", "#contact"],
];

function Nav() {
  const links = [["Work", "#work"], ["About", "#about"], ["Services", "#services"], ["Contact", "#contact"]];
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-[#0a0c10]/70 backdrop-blur-md">
      <div className={`${wrap} flex h-16 items-center justify-between`}>
        <a href="#top" className="brush focus-ring text-2xl">{site.name}</a>
        <nav className="mono flex gap-6 text-xs text-[var(--mute)]">
          {links.map(([l, h]) => (
            <a key={h} href={h} className="focus-ring underline-offset-4 transition-colors hover:text-[var(--bone)] hover:underline">{l}</a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Hero({ ready }) {
  useEffect(() => {
    if (reduce()) return;
    const t = gsap.to(".hero-par", { yPercent: 12, ease: "none", scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: true } });
    return () => { t.scrollTrigger?.kill(); t.kill(); };
  }, []);
  useEffect(() => {
    if (!ready || reduce()) return;
    const t = gsap.from(".sticker", { opacity: 0, y: 16, duration: 0.9, ease: "power3.out", delay: 0.9 });
    return () => t.kill();
  }, [ready]);
  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden pt-24">
      <div className="hero-par absolute inset-x-0 -top-[10%] h-[100%]"><img src={site.heroImage} alt="" className="hero-img h-full w-full object-cover grayscale contrast-125 brightness-50" /></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-transparent to-[#0a0c10]/60" />

      <div className={`${wrap} relative grid gap-10 pb-20 md:grid-cols-12`}>
        {/* index, like the blue contents list on the reference */}
        <nav aria-label="Contents" className="hero-in mono toc bg-[var(--paper)] p-4 text-xs leading-6 text-black md:col-span-4 md:self-start">
          <p className="mb-2 font-bold text-black">Contents</p>
          <ol className="list-decimal pl-5">
            {toc.map(([l, h]) => <li key={h}><a href={h} className="focus-ring">{l}</a></li>)}
          </ol>
        </nav>

        {/* fake OS window */}
        <div className="hero-in d2 hidden justify-self-end md:col-span-8 md:block">
          <div className="win w-64 md:rotate-2">
            <div className="win-bar"><span>noir_booking.exe</span><span>x</span></div>
            <p className="p-3 text-xs leading-5">hi. open for campaigns, music videos and portraits through 2026. based in India, happy to travel.</p>
          </div>
          <p className="note mt-5 ml-auto">scroll. it gets better.</p>
        </div>
      </div>

      <div className={`${wrap} relative pb-16 md:pb-24`}>
        <Chars ready={ready} lines={["“Studio", "Noir”"]} className="brush text-[clamp(3.5rem,13vw,12rem)] leading-[.9]" />
        <div className="mt-6 flex flex-wrap items-center gap-8">
          <Magnetic strength={0.4}><span className="sticker">Booking 2026</span></Magnetic>
          <p className="hero-in d3 mono max-w-md text-sm leading-6 text-[var(--bone)]/80">{site.tagline}</p>
        </div>
      </div>
    </section>
  );
}

function Intro() {
  return (
    <section className="paper relative">
      <Torn />
      <div className={`${wrap} py-28 md:py-44`}>
        <Scrub text={site.intro} className="font-serif-d max-w-4xl text-3xl leading-[1.2] md:text-6xl" />
      </div>
    </section>
  );
}

function Work({ onOpen }) {
  const root = useRef(), track = useRef();
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const dist = () => track.current.scrollWidth - window.innerWidth;
      const tween = gsap.to(track.current, { x: () => -dist(), ease: "none",
        scrollTrigger: { trigger: root.current, pin: true, scrub: 1, end: () => "+=" + dist(), invalidateOnRefresh: true } });
      gsap.utils.toArray(".pimg").forEach((img) =>
        gsap.fromTo(img, { scale: 1.12 }, { scale: 1, ease: "none",
          scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: "left right", end: "center center", scrub: true } }));
      gsap.utils.toArray(".pframe").forEach((f) =>
        gsap.fromTo(f, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", ease: "power3.out", duration: 1,
          scrollTrigger: { trigger: f, containerAnimation: tween, start: "left 90%", toggleActions: "play none none reverse" } }));
      gsap.utils.toArray("#work .num").forEach((n) =>
        gsap.from(n, { scale: 1.8, opacity: 0, duration: 0.7, ease: "back.out(2)",
          scrollTrigger: { trigger: n, containerAnimation: tween, start: "left 85%", toggleActions: "play none none reverse" } }));
    }, root);
    return () => mm.revert();
  }, []);
  return (
    <section id="work" ref={root} className="overflow-hidden">
      <div ref={track} className="flex flex-col md:w-max md:flex-row">
        <div className="flex flex-col justify-center gap-4 px-6 pt-24 md:h-screen md:w-[45vw] md:shrink-0 md:px-[7vw] md:pt-0">
          <p className="mono text-xs text-[var(--tungsten)]">Selected work, 2025 to 2026</p>
          <h2 className="brush text-6xl md:text-8xl">Three<br />stories.</h2>
          <p className="note mt-4">keep scrolling &rarr;</p>
        </div>
        {projects.map((p, i) => (
          <article key={p.id} id={p.id} className="relative flex flex-col gap-8 px-6 py-16 md:h-screen md:w-screen md:shrink-0 md:flex-row md:items-center md:gap-[5vw] md:px-[7vw] md:py-0">
            <button onClick={() => onOpen(p)} data-cursor="View" {...warp} aria-label={`Open ${p.title}`}
              className="pframe focus-ring relative block w-full overflow-hidden md:h-[68vh] md:w-auto md:max-w-[52vw] md:shrink-0">
              <img src={p.images[0]} alt={p.title} onLoad={() => ScrollTrigger.refresh()}
                className="pimg block h-auto w-full object-contain grayscale transition-[filter] duration-700 hover:grayscale-0 md:h-full md:w-auto md:max-w-[52vw]" />
            </button>
            <div className="md:w-[26vw]">
              <Num n={i + 1} pinned />
              <p className="mono mt-6 text-xs text-[var(--tungsten)]">{p.kind}, {p.year}</p>
              <h2 className="font-serif-d mt-3 text-5xl leading-none md:text-6xl">{p.title}</h2>
              <p className="mt-6 max-w-sm leading-relaxed text-[var(--mute)]">{p.description}</p>
              <p className="mono mt-4 text-xs text-[var(--mute)]">Fig. {i + 1}. {p.camera}</p>
              {p.note && <p className="note mt-8">{p.note}</p>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="scroll-mt-16 border-y border-[var(--line)] bg-[var(--panel)] py-28 md:py-40">
      <div className={wrap}>
        <div className="mb-16 flex items-end gap-6">
          <Num n={5} />
          <h2 className="font-serif-d text-5xl md:text-8xl">How I got here</h2>
        </div>
        <ol>
          {story.map((s) => (
            <Reveal as="li" key={s.year} className="grid gap-4 border-t border-[var(--line)] py-10 md:grid-cols-12 md:gap-10">
              <span className="brush text-4xl text-[var(--tungsten)] md:col-span-2">{s.year}</span>
              <h3 className="text-xl font-semibold md:col-span-3">{s.title}</h3>
              <p className="max-w-xl leading-relaxed text-[var(--mute)] md:col-span-7">{s.text}</p>
            </Reveal>
          ))}
        </ol>
        <p className="mono mt-16 text-xs text-[var(--mute)]">Worked with</p>
        <div className="mt-6"><Marquee items={site.clients} /></div>
      </div>
    </section>
  );
}

function LocalTime() {
  const fmt = () => new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit", hour12: true });
  const [t, setT] = useState(fmt);
  useEffect(() => { const i = setInterval(() => setT(fmt()), 30000); return () => clearInterval(i); }, []);
  return <p className="mono mb-8 text-xs text-[var(--mute)]">{site.city}, {t}. Probably editing.</p>;
}

function Contact() {
  return (
    <footer className={`${wrap} py-28 md:py-40`}>
      <LocalTime />
      <a href={`mailto:${site.email}`} className="focus-ring font-serif-d block break-all text-4xl transition-colors hover:text-[var(--tungsten)] md:break-normal md:text-8xl">
        {site.email}
      </a>
      <div className="mono mt-20 flex flex-col justify-between gap-6 border-t border-[var(--line)] pt-6 text-xs text-[var(--mute)] md:flex-row">
        <div className="flex gap-6">
          {site.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="focus-ring underline hover:text-[var(--bone)]">{s.label}</a>
          ))}
        </div>
        <p>{site.disclaimer}</p>
      </div>
      <p className="mono mt-4 text-xs text-[var(--mute)]">Design and build by <a href={site.credit.href} target="_blank" rel="noreferrer" className="focus-ring underline hover:text-[var(--bone)]">{site.credit.name}</a></p>
    </footer>
  );
}

export default function App() {
  const [open, setOpen] = useState(null);
  const [ready, setReady] = useState(false);
  useSmoothScroll(ready);
  return (
    <div className="min-h-screen selection:bg-[var(--red)] selection:text-white">
      <Preloader onReveal={() => setReady(true)} />
      <Cursor />
      <WarpDefs />
      <ScrollMeter />
      <Nav />
      <main>
        <Hero ready={ready} />
        <Intro />
        <Work onOpen={setOpen} />
        <Reel />
        <Sheet />
        <About />
        <Services />
        <Enquiry />
      </main>
      <Contact />
      <Lightbox project={open} onClose={() => setOpen(null)} />
    </div>
  );
}