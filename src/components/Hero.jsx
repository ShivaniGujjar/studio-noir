import React from 'react';

export default function Hero() {
  return (
    <section id="home" className="px-6 py-20 border-b border-[#222222] max-w-7xl mx-auto bg-[#0A0A0A] text-[#EDEDED] relative">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div>
          <div className="font-mono text-xs text-red-500 tracking-widest mb-4 uppercase">
            // OPEN-SOURCE PHOTOGRAPHY INDEX [FREE-GAME DOCTRINE]
          </div>
          <h1 className="text-6xl md:text-9xl font-extrabold tracking-tighter uppercase mb-6 leading-none">
            STUDIO<span className="text-red-600">.</span>NOIR
          </h1>
          <p className="max-w-xl text-sm md:text-base font-mono leading-relaxed text-neutral-400 border-l-2 border-red-600 pl-4">
            A raw, high-contrast visual archive. Stripping away standard portfolio filler to expose technical data, lighting schematics, and uncompromised commercial imagery.
          </p>
        </div>

        {/* Brutalist Handwritten Note Box */}
        <div className="font-mono text-xs rotate-[-2deg] bg-[#141414] border border-[#333333] text-neutral-300 p-4 shadow-2xl self-end md:self-start">
          <span className="text-red-500 font-bold">core rule:</span><br/>
          same people.<br/>different lights.<br/>zero fluff.
        </div>
      </div>

      <div className="flex justify-between items-center font-mono text-xs mt-20 pt-4 border-t border-[#222222] text-neutral-500">
        <span>TABLE OF CONTENTS [01 — 05]</span>
        <span>SCROLL DOWN TO INSPECT ↓</span>
      </div>
    </section>
  );
}