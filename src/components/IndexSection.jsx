import React from 'react';

export default function IndexSection({ items }) {
  return (
    <main id="work" className="max-w-7xl mx-auto px-6 py-16 bg-[#0A0A0A] text-[#EDEDED]">
      <div className="space-y-32">
        {items.map((item) => (
          <section key={item.num} id={`section-${item.num}`} className="border-b border-[#222222] pb-24">
            
            {/* Header Block */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
              <div className="flex items-baseline gap-6">
                <span className="text-7xl md:text-9xl font-extrabold font-mono tracking-tighter text-neutral-700 leading-none">
                  {item.num}
                </span>
                <div>
                  <h2 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight text-[#EDEDED] mb-1">
                    {item.title}
                  </h2>
                  <div className="font-mono text-xs text-red-500 uppercase tracking-widest">
                    {item.subtitle}
                  </div>
                </div>
              </div>

              <div className="text-right font-mono text-xs max-w-xs text-neutral-400">
                <p className="font-bold text-neutral-300">{item.tagline || item.description}</p>
                <div className="text-red-500 mt-1">― ❖</div>
              </div>
            </div>

            {/* Grid for Lookbooks / Motion */}
            {!item.isBts && !item.isReferences && !item.isContactForm && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                {item.images.map((img, idx) => (
                  <div key={idx} className="border border-[#222222] p-3 bg-[#111111] group">
                    <div className="overflow-hidden mb-3 bg-black">
                      <img 
                        src={img.url} 
                        alt={item.title} 
                        className="w-full h-[480px] object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 filter grayscale contrast-125 hover:grayscale-0" 
                      />
                    </div>
                    <div className="font-mono text-xs text-neutral-400 flex justify-between pt-2 border-t border-[#222222]">
                      <span className="text-neutral-300">{img.label}</span>
                      <span className="text-red-500 font-bold">{img.meta}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* BTS Section */}
            {item.isBts && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6 items-center">
                <div className="md:col-span-2 border border-[#222222] p-3 bg-[#111111]">
                  <div className="overflow-hidden mb-3">
                    <img src={item.images[0].url} alt="BTS" className="w-full h-[420px] object-cover filter grayscale contrast-125" />
                  </div>
                  <div className="font-mono text-xs text-neutral-400 flex justify-between pt-2 border-t border-[#222222]">
                    <span>{item.images[0].label}</span>
                    <span className="text-red-500 font-bold">{item.images[0].meta}</span>
                  </div>
                </div>

                <div className="border border-[#222222] p-6 bg-[#111111] font-mono text-xs space-y-4 text-neutral-300">
                  <div className="border-b border-[#222222] pb-2 text-center text-red-500 tracking-wider">
                    [ LIGHTING SCHEMATIC ]
                  </div>
                  <div className="border border-dashed border-[#333333] p-4 text-center text-neutral-500 bg-[#0A0A0A]">
                    [DARKROOM RIG MAP]
                  </div>
                  <ul className="space-y-2 pt-2 text-neutral-400">
                    {item.diagramSpecs.map((spec, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-red-500">▪</span> {spec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* References Table */}
            {item.isReferences && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6 items-start">
                <div className="md:col-span-2 border border-[#222222] bg-[#111111]">
                  {item.referencesList.map((ref, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 border-b border-[#222222] last:border-b-0 font-mono text-xs hover:bg-[#1A1A1A] transition-colors">
                      <div className="flex gap-4">
                        <span className="font-bold text-neutral-600">{ref.num}</span>
                        <span className="font-bold text-neutral-200">{ref.name}</span>
                      </div>
                      <span className="text-red-500">{ref.type}</span>
                    </div>
                  ))}
                </div>

                <div className="border border-[#222222] p-3 bg-[#111111] rotate-[1deg]">
                  <img src={item.images[0]} alt="Reference" className="w-full h-[230px] object-cover filter grayscale mb-2" />
                  <div className="font-mono text-xs text-right text-red-500">
                    mood over matter.
                  </div>
                </div>
              </div>
            )}

            {/* Contact Form Section for 05 */}
            {item.isContactForm && (
              <div id="contact" className="border border-[#222222] p-8 bg-[#111111] mt-6 max-w-3xl">
                <div className="font-mono text-xs text-red-500 mb-4">// DIRECT DISPATCH FORM</div>
                <form onSubmit={(e) => { e.preventDefault(); alert('Inquiry Dispatched Successfully.'); }} className="space-y-6 font-mono text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-neutral-400 mb-2">YOUR NAME / ENTITY</label>
                      <input type="text" placeholder="e.g. Studio Vertex" className="w-full bg-[#0A0A0A] border border-[#333333] p-3 text-white focus:border-red-500 outline-none" required />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-2">EMAIL ADDRESS</label>
                      <input type="email" placeholder="name@domain.com" className="w-full bg-[#0A0A0A] border border-[#333333] p-3 text-white focus:border-red-500 outline-none" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-2">PROJECT SCOPE & TIMELINE</label>
                    <textarea rows="4" placeholder="Describe lookbook requirements, dates, or location..." className="w-full bg-[#0A0A0A] border border-[#333333] p-3 text-white focus:border-red-500 outline-none"></textarea>
                  </div>
                  <button type="submit" className="bg-red-600 text-white font-bold px-6 py-3 uppercase tracking-widest hover:bg-red-700 transition-colors w-full md:w-auto">
                    [DISPATCH INQUIRY]
                  </button>
                </form>
              </div>
            )}

          </section>
        ))}
      </div>
    </main>
  );
}