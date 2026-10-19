import React from 'react';

export default function ProjectModal({ project, onClose }) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#111111]/90 flex justify-end">
      <div className="bg-[#F4F4F0] text-[#111111] w-full md:w-3/4 h-full overflow-y-auto p-6 md:p-12 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center border-b-2 border-[#111111] pb-4 mb-8 font-mono">
            <span className="font-bold text-lg">INDEX // {project.num} : {project.title}</span>
            <button 
              onClick={onClose}
              className="bg-[#111111] text-white px-4 py-2 font-bold hover:bg-[#FF3300] transition-colors"
            >
              [CLOSE ✕]
            </button>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-extrabold uppercase mb-2">{project.title}</h3>
              <p className="font-mono text-sm max-w-xl">{project.description}</p>
            </div>

            <div className="space-y-6">
              {project.images.map((img, idx) => (
                <div key={idx} className="border-2 border-[#111111] p-2 bg-white">
                  <img src={img} alt="Archive visual" className="w-full h-auto object-cover max-h-[500px]" />
                  <div className="font-mono text-xs mt-2 text-neutral-600 flex justify-between">
                    <span>FRAME 0{idx + 1}</span>
                    <span>{project.specs.camera || "ARCHIVAL SCAN"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t-2 border-[#111111] pt-6 mt-12 flex justify-between items-center font-mono text-xs">
          <span>END OF ARCHIVE BLOCK</span>
          <button onClick={onClose} className="underline font-bold">
            ← BACK TO INDEX
          </button>
        </div>
      </div>
    </div>
  );
}