import React from 'react';
import { story } from "../data/storyData";

export default function StorySection() {
  if (!story || !Array.isArray(story)) return null;

  return (
    <div className="bg-[#0A0A0A] text-[#EDEDED] py-16 border-b border-[#222222]">
      <div className="max-w-7xl mx-auto px-6 space-y-24">
        <div className="font-mono text-xs text-red-500 uppercase tracking-widest mb-12">
          // EVOLUTION & CHRONICLES [STORY ARCHIVE]
        </div>

        {story.map((s, i) => (
          <section 
            key={s.year || i} 
            className={`relative border border-[#222222] p-8 md:p-12 bg-[#111111] overflow-hidden`}
          >
            {/* Ghost background watermark year */}
            <span className="absolute right-4 bottom-0 text-7xl md:text-9xl font-extrabold font-mono tracking-tighter text-neutral-800/30 select-none pointer-events-none">
              {s.ghost || s.year}
            </span>

            <div className={`flex flex-col ${i % 2 ? "md:flex-row-reverse" : "md:flex-row"} gap-8 md:gap-16 items-center relative z-10`}>
              
              <div className="w-full md:w-1/2 space-y-4 font-mono">
                <span className="text-xs text-red-500 font-bold border border-[#333333] px-2 py-1 bg-[#0A0A0A] inline-block">
                  {s.year}
                </span>
                <h3 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight text-[#EDEDED]">
                  {s.title}
                </h3>
                <p className="text-sm md:text-base text-neutral-400 leading-relaxed font-sans">
                  {s.text}
                </p>
              </div>

              <div className="w-full md:w-1/2 border border-[#222222] p-2 bg-black">
                <img 
                  src={s.image} 
                  alt={s.title} 
                  className="w-full h-[320px] md:h-[380px] object-cover filter grayscale contrast-125 hover:grayscale-0 transition-all duration-700" 
                />
              </div>

            </div>
          </section>
        ))}
      </div>
    </div>
  );
}