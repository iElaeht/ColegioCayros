// frontend/components/EducationalLevels.tsx
"use client";

import React, { useState } from 'react';
import Image from 'next/image';

const levels = [
  {
    id: "inicial",
    title: "INICIAL",
    bgColor: "bg-[#f8de32]",
    textColor: "text-[#16275d]",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
  },
  {
    id: "primaria",
    title: "PRIMARIA",
    bgColor: "bg-[#6eb5ec]",
    textColor: "text-white",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
  },
  {
    id: "secundaria",
    title: "SECUNDARIA",
    bgColor: "bg-[#16275d]",
    textColor: "text-white",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
  }
];

export default function EducationalLevels() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <section id="Levels" className="w-full bg-white px-4 sm:px-8 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        
        {/* Cabecera optimizada y responsiva */}
        <div className="mb-10 sm:mb-16 flex flex-col items-start max-w-2xl">
          <div className="flex items-center gap-3 mb-3">
            <span aria-hidden="true" className="h-3.5 w-3.5 flex-shrink-0 rounded-[2px] bg-[#f8de32]" />
            <h2 className="text-2xl font-bold tracking-tight text-[#16275d] sm:text-3xl lg:text-4xl">
              Niveles Educativos
            </h2>
          </div>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed text-left">
            Participación comprometida de los padres de familia y la sociedad civil organizada en los procesos educativos de los estudiantes.
          </p>
        </div>

        {/* Grid de Tarjetas Responsivo */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 shadow-xl rounded-2xl overflow-hidden border border-slate-100">
          {levels.map((level) => (
            <article 
              key={level.id}
              onClick={() => setActiveVideo(level.videoUrl)}
              className={`${level.bgColor} ${level.textColor} relative cursor-pointer group h-[220px] sm:h-[280px] lg:h-[320px] flex flex-col justify-center items-center overflow-hidden transition-all duration-300`}
            >
              {/* Imagen con clip-path interactiva (Hover en desktop, visible/táctil en móvil) */}
              <div 
                className="absolute inset-2 opacity-0 group-hover:opacity-100 sm:group-hover:opacity-100 transition-all duration-500 ease-in-out z-10 overflow-hidden rounded-xl shadow-inner"
                style={{
                  clipPath: 'polygon(0% 16px, 16px 0%, 100% 0%, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0% 100%)'
                }}
              >
                <div className="relative w-full h-full scale-105 group-hover:scale-100 transition-transform duration-700">
                  <Image src={level.image} alt={level.title} fill className="object-cover" />
                  <div className={`absolute inset-0 ${level.bgColor} opacity-80 mix-blend-multiply`} />
                  <div className="absolute inset-0 bg-black/25" />
                </div>
              </div>

              {/* Contenido centrado */}
              <div className="relative z-20 flex flex-col items-center justify-center text-center transition-transform duration-300 group-hover:scale-95 px-4">
                <h3 className="text-sm sm:text-base font-bold tracking-[0.25em] m-0 drop-shadow-sm">
                  {level.title}
                </h3>
                
                <div className="mt-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="15" viewBox="0 0 15 17" fill="none">
                    <path 
                      d="M15 8.55909L0.450607 16.5774L0.450608 0.540815L15 8.55909Z" 
                      fill="#16275d"
                      className="opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  </svg>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Modal de Video Institucional */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-video">
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-50 bg-black/60 hover:bg-[#f8de32] hover:text-[#16275d] text-white w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer font-bold shadow"
              aria-label="Cerrar video"
            >
              ✕
            </button>
            <iframe
              src={activeVideo}
              title="Video Institucional"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}