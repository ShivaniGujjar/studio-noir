import React, { useEffect, useRef } from "react";
import { gsap, reduce, onView } from "../motion";

const S = 14, R = 7;            // spokes, rings
const K = 0.1, KC = 0.12, DAMP = 0.88, MAXD = 22;   // stiff, well damped, displacement capped
const BONE = "233,228,218";

/* a hand-strung orb web. Client names hang from the threads; brush the cursor through it and it shakes like a real one. */
export default function Web({ items }) {
  const wrap = useRef(), cv = useRef();

  useEffect(() => {
    const canvas = cv.current, ctx = canvas.getContext("2d"), still = reduce();
    const st = { g: still ? 1 : 0, px: -999, py: -999, pvx: 0, pvy: 0, hot: -1 };
    const jit = Array.from({ length: R + 1 }, () => Array.from({ length: S }, () => [Math.random() - 0.5, Math.random() - 0.5]));
    const dew = Array.from({ length: 16 }, () => [1 + Math.floor(Math.random() * (R - 1)), Math.floor(Math.random() * S), 1.6 + Math.random() * 1.6]);
    let W = 0, H = 0, dpr = 1, cx = 0, cy = 0, nodes = [], showNames = true;

    const layout = () => {
      const b = wrap.current.getBoundingClientRect();
      W = b.width; H = b.height; dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr; canvas.height = H * dpr;
      cx = W / 2; cy = H / 2;
      const rx = W * 0.47, ry = H * 0.46;
      showNames = window.innerWidth >= 768;
      nodes = [];
      for (let r = 1; r <= R; r++) {
        nodes[r] = [];
        for (let s = 0; s < S; s++) {
          const a = (s / S) * Math.PI * 2 + jit[r][s][0] * 0.05;
          const f = (r / R) * (1 + jit[r][s][1] * 0.06);
          nodes[r][s] = { bx: cx + Math.cos(a) * rx * f, by: cy + Math.sin(a) * ry * f, dx: 0, dy: 0, vx: 0, vy: 0, pin: r === R };
        }
      }
    };

    const pos = (r, s) => {
      if (r === 0) return { x: cx, y: cy };
      const n = nodes[r][s], g = st.g;
      return { x: cx + (n.bx - cx) * g + n.dx, y: cy + (n.by - cy) * g + n.dy };
    };

    const step = (t) => {
      for (let r = 1; r < R; r++) for (let s = 0; s < S; s++) {
        const n = nodes[r][s], p = pos(r, s);
        const nb = [nodes[r][(s + 1) % S], nodes[r][(s + S - 1) % S], r > 1 ? nodes[r - 1][s] : null, nodes[r + 1][s]].filter(Boolean);
        const ax = nb.reduce((a, q) => a + q.dx, 0) / nb.length, ay = nb.reduce((a, q) => a + q.dy, 0) / nb.length;
        n.vx += -K * n.dx + KC * (ax - n.dx);
        n.vy += -K * n.dy + KC * (ay - n.dy);
        const d = Math.hypot(p.x - st.px, p.y - st.py), rad = 120;
        if (d < rad) {
          const f = Math.pow(1 - d / rad, 2);
          n.vx += st.pvx * 0.035 * f;
          n.vy += st.pvy * 0.035 * f;
        }
        n.vx *= DAMP; n.vy *= DAMP; n.dx += n.vx; n.dy += n.vy;
        const m = Math.hypot(n.dx, n.dy);
        if (m > MAXD) { n.dx *= MAXD / m; n.dy *= MAXD / m; }
      }
      st.pvx *= 0.8; st.pvy *= 0.8;
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const c = pos(0, 0);
      ctx.lineCap = "round";
      // guy lines out to the frame
      ctx.strokeStyle = `rgba(${BONE},${0.22 * st.g})`; ctx.lineWidth = 1; ctx.beginPath();
      for (let s = 0; s < S; s += 2) {
        const o = pos(R, s), k = 0.4;
        const ex = Math.max(0, Math.min(W, o.x + (o.x - c.x) * k)), ey = Math.max(0, Math.min(H, o.y + (o.y - c.y) * k));
        ctx.moveTo(o.x, o.y); ctx.lineTo(ex, ey);
      }
      ctx.stroke();
      // spokes
      ctx.strokeStyle = `rgba(${BONE},${0.5 * st.g})`; ctx.beginPath();
      for (let s = 0; s < S; s++) { ctx.moveTo(c.x, c.y); for (let r = 1; r <= R; r++) { const p = pos(r, s); ctx.lineTo(p.x, p.y); } }
      ctx.stroke();
      // sagging rings
      ctx.strokeStyle = `rgba(${BONE},${0.32 * st.g})`; ctx.beginPath();
      for (let r = 1; r <= R; r++) for (let s = 0; s < S; s++) {
        const a = pos(r, s), b = pos(r, (s + 1) % S);
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        ctx.moveTo(a.x, a.y); ctx.quadraticCurveTo(mx + (c.x - mx) * 0.12, my + (c.y - my) * 0.12, b.x, b.y);
      }
      ctx.stroke();
      // dew
      dew.forEach(([r, s, rad]) => {
        const p = pos(r, s);
        ctx.fillStyle = `rgba(${BONE},${0.85 * st.g})`; ctx.beginPath(); ctx.arc(p.x, p.y, rad, 0, 7); ctx.fill();
        ctx.fillStyle = `rgba(255,255,255,${st.g})`; ctx.beginPath(); ctx.arc(p.x - rad * 0.3, p.y - rad * 0.3, rad * 0.35, 0, 7); ctx.fill();
      });
      // client names hanging from the nodes
      st.hot = -1;
      if (showNames) {
        const px = Math.max(24, Math.min(40, W * 0.03));
        ctx.font = `${px}px "Instrument Serif", Georgia, serif`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        items.forEach((name, i) => {
          const s = Math.round((i * S) / items.length) % S, r = 4 + (i % 2 ? 1 : -1);
          const p = pos(r, s), w = ctx.measureText(name).width;
          const hot = Math.abs(st.px - p.x) < w / 2 + 12 && Math.abs(st.py - p.y) < px * 0.7;
          if (hot) st.hot = i;
          ctx.globalAlpha = st.g;
          ctx.fillStyle = "rgba(17,20,26,.92)"; ctx.fillRect(p.x - w / 2 - 28, p.y - px * 0.65, w + 40, px * 1.3);
          ctx.fillStyle = "#e5322d"; ctx.beginPath(); ctx.arc(p.x - w / 2 - 14, p.y, hot ? 6 : 4, 0, 7); ctx.fill();
          ctx.fillStyle = hot ? "#d9a441" : `rgb(${BONE})`; ctx.fillText(name, p.x, p.y + 1);
          ctx.globalAlpha = 1;
        });
      }
      canvas.style.cursor = st.hot >= 0 ? "pointer" : "default";
    };

    layout();
    let raf = 0, running = false, last = performance.now();
    const loop = (now) => { raf = requestAnimationFrame(loop); step(now / 1000); draw(); last = now; };
    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(loop); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    const onMove = (e) => {
      const b = canvas.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top;
      if (st.px > -900) { st.pvx = Math.max(-15, Math.min(15, x - st.px)); st.pvy = Math.max(-15, Math.min(15, y - st.py)); }
      st.px = x; st.py = y;
    };
    const onLeave = () => { st.px = st.py = -999; };
    const ro = new ResizeObserver(() => { layout(); if (still) draw(); });
    ro.observe(wrap.current);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    let io, offView;
    if (still) draw();
    else {
      io = new IntersectionObserver(([en]) => (en.isIntersecting ? start() : stop()), { threshold: 0 });
      io.observe(wrap.current);
      offView = onView(wrap.current, () => gsap.to(st, { g: 1, duration: 2.2, ease: "power3.out" }));
    }
    return () => {
      stop(); ro.disconnect(); io?.disconnect(); offView?.();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [items]);

  return (
    <div>
      <div ref={wrap} className="relative h-[52vh] min-h-[360px] w-full md:h-[68vh]">
        <canvas ref={cv} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      </div>
      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-serif-d text-2xl md:sr-only">
        {items.map((c) => <li key={c}>{c}</li>)}
      </ul>
    </div>
  );
}