import React from 'react';

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-[#222222] bg-[#050505] text-[#EDEDED] px-6 py-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 font-mono">
        <div className="text-xs text-neutral-400">
          GLOBAL COMMISSION: OPEN
          <div className="w-32 h-[1px] bg-red-500 mt-2"></div>
        </div>

        <div className="text-center">
          <a href="mailto:contact@studio-noir.com" className="text-2xl md:text-5xl font-extrabold hover:text-red-500 transition-colors tracking-tighter">
            contact@studio-noir.com
          </a>
        </div>

        <div className="text-xs space-y-1 text-neutral-400 text-right">
          <div className="flex gap-4 justify-end">
            <a href="#instagram" className="hover:text-white">INSTAGRAM</a>
            <a href="#vimeo" className="hover:text-white">VIMEO</a>
            <a href="#arena" className="hover:text-white">ARE.NA</a>
          </div>
          <p className="mt-2 text-[10px] text-neutral-600">© 2026 STUDIO.NOIR // ALL RIGHTS RESERVED</p>
        </div>
      </div>
    </footer>
  );
}