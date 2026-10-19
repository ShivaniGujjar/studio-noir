import React from 'react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#0A0A0A] text-[#EDEDED] border-b border-[#222222] px-6 py-4 flex flex-wrap justify-between items-center text-xs tracking-widest uppercase font-mono">
      <div className="flex items-center gap-6">
        <span className="bg-red-600 text-white px-2 py-1 font-bold">V.02 // INDEX</span>
        <a href="#home" className="hover:text-red-500 font-bold transition-colors">HOME</a>
        <a href="#archive" className="hover:text-red-500 transition-colors">ARCHIVE</a>
      </div>
      <div className="flex items-center gap-6 text-neutral-400">
        <span className="hidden md:inline">STATUS: OPEN FOR COMMISSION</span>
        <a href="#contact" className="border border-[#333333] px-3 py-1 hover:border-red-500 hover:text-white transition-colors">
          [INQUIRE]
        </a>
      </div>
    </header>
  );
}