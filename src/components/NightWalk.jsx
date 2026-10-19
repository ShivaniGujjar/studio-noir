import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { ScrollTrigger, reduce } from "../motion";

const NIGHT = 0x0a0c10;
const TUNGSTEN = 0xd9a441;
const CAM_START = 6, CAM_END = -33;
// lit billboard at the end of the street. Swap for your own image before sharing publicly.
const POSTER = "/images/Spider-Noir.jpeg";
const rnd = (a, b) => a + Math.random() * (b - a);
export const clamp = (v) => Math.max(0, Math.min(1, v));

export const CAPTIONS = [
  { a: 0.0, b: 0.3, k: "10:42 pm", t: "The street empties out." },
  { a: 0.34, b: 0.66, k: "Block three", t: "One lamp is all I ask for." },
  { a: 0.7, b: 1.2, k: "Last block", t: "Then I look up." },
];

function glowTexture(rgb) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d");
  const r = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  r.addColorStop(0, `rgba(${rgb},.9)`);
  r.addColorStop(0.4, `rgba(${rgb},.25)`);
  r.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = r;
  g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

export function build(host, narrow, video) {
  const w = host.clientWidth, h = host.clientHeight;
  const renderer = new THREE.WebGLRenderer({ antialias: !narrow, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, narrow ? 1.5 : 2));
  renderer.setSize(w, h);
  renderer.setClearColor(NIGHT);
  renderer.domElement.style.display = "block";
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(NIGHT, 0.034);
  const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 200);

  const add = (m) => (scene.add(m), m);
  const additive = { transparent: true, blending: THREE.AdditiveBlending, depthWrite: false };

  // road
  const road = add(new THREE.Mesh(new THREE.PlaneGeometry(15, 260), new THREE.MeshBasicMaterial({ color: 0x0d1118 })));
  road.rotation.x = -Math.PI / 2;
  road.position.z = -110;
  const dashGeo = new THREE.PlaneGeometry(0.14, 1.6), dashMat = new THREE.MeshBasicMaterial({ color: 0x2b313b });
  for (let z = 8; z > -130; z -= 5) {
    const d = add(new THREE.Mesh(dashGeo, dashMat));
    d.rotation.x = -Math.PI / 2;
    d.position.set(0, 0.01, z);
  }

  // buildings + lit windows
  const bGeo = new THREE.BoxGeometry(1, 1, 1), bMat = new THREE.MeshBasicMaterial({ color: 0x11151c });
  const spots = [];
  const winData = [];
  for (const side of [-1, 1]) {
    for (let z = 8; z > -135; z -= rnd(5, 8)) {
      const bw = rnd(5, 9), bh = rnd(9, 34), bd = rnd(5, 8);
      const x = side * (7.5 + bw / 2 + rnd(0, 1.5));
      const m = add(new THREE.Mesh(bGeo, bMat));
      m.scale.set(bw, bh, bd);
      m.position.set(x, bh / 2, z - bd / 2);
      const n = Math.floor((bh * bd) / (narrow ? 14 : 8));
      for (let i = 0; i < n; i++) winData.push({ x: x - side * bw / 2 - side * 0.02, y: rnd(1.5, bh - 1), z: z - bd / 2 + rnd(-bd / 2 + 0.6, bd / 2 - 0.6), side });
    }
  }
  const winMesh = add(new THREE.InstancedMesh(new THREE.PlaneGeometry(0.5, 0.7), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }), winData.length));
  const dummy = new THREE.Object3D(), col = new THREE.Color();
  winData.forEach((d, i) => {
    dummy.position.set(d.x, d.y, d.z);
    dummy.rotation.y = d.side > 0 ? -Math.PI / 2 : Math.PI / 2;
    dummy.updateMatrix();
    winMesh.setMatrixAt(i, dummy.matrix);
    const r = Math.random();
    col.setHex(r < 0.7 ? TUNGSTEN : r < 0.9 ? 0x9fb4d0 : 0x3a3f4a).multiplyScalar(rnd(0.35, 1));
    winMesh.setColorAt(i, col);
  });

  // street lamps: post, bulb halo, light cone, floor pool
  const poolTex = glowTexture("217,164,65");
  const postGeo = new THREE.CylinderGeometry(0.06, 0.09, 5.5, 8), postMat = new THREE.MeshBasicMaterial({ color: 0x050607 });
  const bulbGeo = new THREE.SphereGeometry(0.14, 12, 12), bulbMat = new THREE.MeshBasicMaterial({ color: TUNGSTEN });
  const coneGeo = new THREE.CylinderGeometry(0.08, 2.4, 5.4, 24, 1, true);
  const coneMat = new THREE.MeshBasicMaterial({ color: TUNGSTEN, opacity: 0.1, side: THREE.DoubleSide, ...additive });
  const poolGeo = new THREE.PlaneGeometry(7, 7), poolMat = new THREE.MeshBasicMaterial({ map: poolTex, ...additive });
  const haloMat = new THREE.SpriteMaterial({ map: poolTex, ...additive });
  let figureX = 2.4;
  for (let i = 0; i < 10; i++) {
    const side = i % 2 ? 1 : -1, z = -i * 12 - 4, bx = side * 2.4;
    if (i === 3) figureX = bx;
    const post = add(new THREE.Mesh(postGeo, postMat)); post.position.set(side * 4, 2.75, z);
    const bulb = add(new THREE.Mesh(bulbGeo, bulbMat)); bulb.position.set(bx, 5.4, z);
    const halo = add(new THREE.Sprite(haloMat)); halo.position.copy(bulb.position); halo.scale.set(3.4, 3.4, 1);
    const cone = add(new THREE.Mesh(coneGeo, coneMat)); cone.position.set(bx, 2.7, z);
    const pool = add(new THREE.Mesh(poolGeo, poolMat)); pool.rotation.x = -Math.PI / 2; pool.position.set(bx, 0.02, z);
  }

  // billboard at the end of the street. It shows the first frame of the reel; the camera rises and pushes into it.
  const posterMat = new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false });
  const poster = add(new THREE.Mesh(new THREE.PlaneGeometry(1, 1), posterMat));
  const backing = add(new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: 0x050607, fog: false })));
  const posterGlow = add(new THREE.Sprite(new THREE.SpriteMaterial({ map: poolTex, ...additive, fog: false, opacity: 0.55 })));
  poster.visible = backing.visible = posterGlow.visible = false;
  const bb = { y: 6.2, ht: 4.4, wd: 7.8 };
  const place = (a) => {
    let ht = a > 1 ? 4.4 : 6, wd = ht * a;
    if (wd > 8.4) { wd = 8.4; ht = wd / a; }
    bb.ht = ht; bb.wd = wd; bb.y = 4 + ht / 2;
    poster.scale.set(wd, ht, 1); poster.position.set(0, bb.y, -58);
    backing.scale.set(wd + 0.5, ht + 0.5, 1); backing.position.set(0, bb.y, -58.02);
    posterGlow.scale.set(wd * 2.4, ht * 2.4, 1); posterGlow.position.set(0, bb.y, -58.05);
    poster.visible = backing.visible = posterGlow.visible = true;
  };
  let vEl = null, vTex = null;
  if (video && video.src) {
    vEl = document.createElement("video");
    vEl.muted = true; vEl.loop = true; vEl.playsInline = true; vEl.preload = "auto";
    vEl.setAttribute("playsinline", "");
    vEl.src = video.src;
    vTex = new THREE.VideoTexture(vEl);
    vTex.colorSpace = THREE.SRGBColorSpace;
    posterMat.map = vTex;
    posterMat.needsUpdate = true;
    const refresh = () => { vTex.needsUpdate = true; };
    vEl.addEventListener("loadedmetadata", () => place(vEl.videoWidth / vEl.videoHeight));
    vEl.addEventListener("loadeddata", refresh);
    vEl.addEventListener("seeked", refresh);
    vEl.load();
  } else {
    new THREE.TextureLoader().load(POSTER, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      posterMat.map = tex;
      posterMat.needsUpdate = true;
      place(tex.image.width / tex.image.height);
    }, undefined, () => console.warn("NightWalk: poster image not found:", POSTER));
  }

  // noir figure standing in the third pool
  const dark = new THREE.MeshBasicMaterial({ color: 0x030304 });
  const fig = add(new THREE.Group());
  const part = (geo, y) => { const m = new THREE.Mesh(geo, dark); m.position.y = y; fig.add(m); };
  part(new THREE.CylinderGeometry(0.26, 0.38, 1.5, 14), 0.75);
  part(new THREE.SphereGeometry(0.17, 14, 14), 1.72);
  part(new THREE.CylinderGeometry(0.36, 0.36, 0.025, 24), 1.87);
  part(new THREE.CylinderGeometry(0.19, 0.22, 0.2, 20), 1.97);
  fig.position.set(figureX, 0, -40);

  // far red signal
  const red = add(new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), new THREE.MeshBasicMaterial({ color: 0xe5322d })));
  red.position.set(0, 5, -118);
  const redHalo = add(new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture("229,50,45"), ...additive })));
  redHalo.position.copy(red.position); redHalo.scale.set(9, 9, 1);

  // rain
  const N = narrow ? 700 : 1600, pos = new Float32Array(N * 6), spd = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const x = rnd(-14, 14), y = rnd(0, 16), z = rnd(-28, 10);
    pos.set([x, y, z, x + 0.05, y + 0.6, z], i * 6);
    spd[i] = rnd(14, 22);
  }
  const rainGeo = new THREE.BufferGeometry();
  rainGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const rainMat = new THREE.LineBasicMaterial({ color: 0x9fb0c8, transparent: true, opacity: 0.35 });
  const rain = add(new THREE.LineSegments(rainGeo, rainMat));
  rain.frustumCulled = false;

  const api = {
    resize() {
      const W = host.clientWidth, H = host.clientHeight;
      renderer.setSize(W, H);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
    },
    frame(p, px, py, dt, t) {
      // p runs 0..1: first 60% walks the street, the rest rises and pushes into the billboard
      const WALK = 0.6;
      const wp = clamp(p / WALK), k = clamp((p - WALK) / (1 - WALK));
      const e = k * k * k * (k * (k * 6 - 15) + 10), m = 1 - e;
      const zW = CAM_START + (CAM_END - CAM_START) * wp;
      const bob = Math.sin(wp * 190) * 0.03 * m;
      const th = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const d = 0.97 * Math.min(bb.ht / (2 * th), bb.wd / (camera.aspect * 2 * th));
      const L = THREE.MathUtils.lerp;
      camera.position.set(L(-0.6 + px * 0.35 * m, 0, e), L(1.7 + bob - py * 0.12 * m, bb.y, e), L(zW, -58 + d, e));
      camera.lookAt(L(-0.2 + px * 0.5 * m, 0, e), L(1.6 - py * 0.1 * m, bb.y, e), L(zW - 12, -58, e));
      posterMat.color.setScalar(0.9 + 0.1 * e + Math.sin(t * 24) * 0.03 * m - (Math.random() < 0.012 ? 0.3 * m : 0));
      rainMat.opacity = 0.35 * (1 - clamp((p - 0.72) / 0.2));
      rain.position.z = camera.position.z - 8;
      const a = rainGeo.attributes.position.array;
      for (let i = 0; i < N; i++) {
        const s = spd[i] * dt, k6 = i * 6;
        a[k6 + 1] -= s; a[k6 + 4] -= s;
        if (a[k6 + 1] < 0) { a[k6 + 1] = 16; a[k6 + 4] = 16.6; }
      }
      rainGeo.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    },
    dispose() {
      if (vEl) { vEl.pause(); vEl.removeAttribute("src"); vEl.load(); }
      scene.traverse((o) => {
        o.geometry?.dispose?.();
        const ms = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
        ms.forEach((mm) => { mm.map?.dispose?.(); mm.dispose(); });
      });
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
  api.video = vEl;
  api.refresh = () => { if (vTex) vTex.needsUpdate = true; };
  return api;
}

export default function NightWalk() {
  const root = useRef(), host = useRef(), flash = useRef(), bar = useRef();
  const caps = useRef([]);

  useEffect(() => {
    const narrow = window.innerWidth < 768, still = reduce();
    let world;
    try { world = build(host.current, narrow); } catch (e) { console.warn("NightWalk: WebGL unavailable", e); return; }
    const s = { target: still ? 0.6 : 0, cur: still ? 0.6 : 0, px: 0, py: 0 };

    const ui = (p) => {
      CAPTIONS.forEach((c, i) => {
        const el = caps.current[i];
        if (!el) return;
        const v = clamp(Math.min((p - c.a) / 0.04, (c.b - p) / 0.04));
        el.style.opacity = v;
        el.style.transform = `translateY(${(1 - v) * 24}px)`;
      });
      if (flash.current) flash.current.style.opacity = 0.9 * clamp(Math.min((p - 0.945) / 0.015, (0.99 - p) / 0.03));
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
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

    const ro = new ResizeObserver(() => { world.resize(); if (still) { ui(s.cur); world.frame(s.cur, 0, 0, 0, 0); } });
    ro.observe(host.current);
    let st, io, onMove;
    if (still) {
      ui(s.cur);
      world.frame(s.cur, 0, 0, 0, 0);
    } else {
      st = ScrollTrigger.create({ trigger: root.current, pin: true, start: "top top", end: "+=300%", onUpdate: (self) => { s.target = self.progress; } });
      io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0 });
      io.observe(root.current);
      onMove = (e) => { s.px = (e.clientX / window.innerWidth - 0.5) * 2; s.py = (e.clientY / window.innerHeight - 0.5) * 2; };
      window.addEventListener("mousemove", onMove);
    }
    return () => {
      stop(); ro.disconnect(); io?.disconnect(); st?.kill();
      if (onMove) window.removeEventListener("mousemove", onMove);
      world.dispose();
    };
  }, []);

  return (
    <section id="walk" ref={root} aria-label="Night walk" className="relative h-screen overflow-hidden bg-[var(--night)]">
      <h2 className="sr-only">Night walk</h2>
      <div ref={host} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,.65)_100%)]" />
      <p className="mono pointer-events-none absolute left-6 top-24 text-[11px] uppercase tracking-[.2em] text-[var(--mute)] md:left-10">Night walk, scroll to move</p>
      <div className="pointer-events-none absolute inset-x-0 bottom-[14vh] mx-auto h-40 w-full max-w-[1320px] px-6 md:px-10">
        {CAPTIONS.map((c, i) => (
          <div key={c.k} ref={(el) => (caps.current[i] = el)} className="absolute inset-x-6 bottom-0 opacity-0 md:inset-x-10">
            <p className="mono mb-3 text-xs uppercase tracking-[.2em] text-[var(--tungsten)]">{c.k}</p>
            <p className="font-serif-d text-4xl leading-none text-[var(--bone)] md:text-7xl">{c.t}</p>
          </div>
        ))}
      </div>
      <div className="absolute inset-x-6 bottom-6 h-px bg-white/15 md:inset-x-10">
        <div ref={bar} className="h-full origin-left bg-[var(--tungsten)]" style={{ transform: "scaleX(0)" }} />
      </div>
      <div ref={flash} className="pointer-events-none absolute inset-0 z-20 bg-white opacity-0" />
    </section>
  );
}