// frontend/app/academico/primaria/components/PrimariaDetails.tsx
"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, BookOpen, Award } from "lucide-react";

// Rutas actualizadas apuntando directamente a la carpeta public/images/primaria/
const SLIDES = [
  { id: 1, src: "/images/primaria/Image-1.jpg", alt: "Actividades en Nivel Primaria 1" },
  { id: 2, src: "/images/primaria/Image-2.jpg", alt: "Actividades en Nivel Primaria 2" },
  { id: 3, src: "/images/primaria/Image-3.jpg", alt: "Actividades en Nivel Primaria 3" },
];

const INTERVAL_TIME = 5000;

export default function PrimariaDetails() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const startTimeRef = useRef<number>(Date.now());
  const elapsedBeforePauseRef = useRef<number>(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    startTimeRef.current = Date.now();
    elapsedBeforePauseRef.current = 0;
    setProgress(0);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  // Manejo del progreso y cambio automático inteligente (Pausa con hover)
  useEffect(() => {
    if (!emblaApi || isPaused) return;

    startTimeRef.current = Date.now() - elapsedBeforePauseRef.current;

    const interval = 50; 
    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const currentProgress = Math.min((elapsed / INTERVAL_TIME) * 100, 100);
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        emblaApi.scrollNext();
        startTimeRef.current = Date.now();
        elapsedBeforePauseRef.current = 0;
        setProgress(0);
      }
    };

    const timer = window.setInterval(updateProgress, interval);
    return () => window.clearInterval(timer);
  }, [emblaApi, isPaused, selectedIndex]);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
    elapsedBeforePauseRef.current = 0;
    setProgress(0);
    startTimeRef.current = Date.now();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
    elapsedBeforePauseRef.current = 0;
    setProgress(0);
    startTimeRef.current = Date.now();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (!emblaApi) return;
    emblaApi.scrollTo(index);
    elapsedBeforePauseRef.current = 0;
    setProgress(0);
    startTimeRef.current = Date.now();
  }, [emblaApi]);

  const handleMouseEnter = () => {
    setIsPaused(true);
    elapsedBeforePauseRef.current = Date.now() - startTimeRef.current;
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    startTimeRef.current = Date.now() - elapsedBeforePauseRef.current;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      
      {/* Lado Izquierdo: Información Detallada (6 Columnas) */}
      <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
        
        {/* Bloque de Misión y Visión */}
        <div className="bg-white border border-gray-200/80 p-8 rounded-3xl shadow-sm space-y-5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#16275d]/5 text-[#16275d] flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600">Excelencia Académica</span>
              <h3 className="text-xl font-bold text-[#111c38] font-['Poppins',sans-serif]">
                Misión y Visión del Nivel
              </h3>
            </div>
          </div>

          <div className="space-y-4 text-gray-600 text-sm font-['Open_Sans',sans-serif] leading-relaxed">
            <p>
              <strong className="text-[#111c38]">Misión:</strong> Formar integralmente a los estudiantes de primaria mediante un alto nivel académico, pensamiento crítico y sólidas bases éticas, promoviendo su talento y autonomía en cada etapa.
            </p>
            <div className="border-t border-gray-100 pt-3">
              <p>
                <strong className="text-[#111c38]">Visión:</strong> Consolidarnos como la institución líder en educación primaria en Chincha, destacando por nuestros logros académicos, competencias tecnológicas y formación en valores.
              </p>
            </div>
          </div>
        </div>

        {/* Bloque Informativo sobre lo que Brindamos */}
        <div className="bg-white border border-gray-200/80 p-8 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#16275d]">Formación Integral</span>
              <h4 className="text-lg font-bold text-[#111c38] font-['Poppins',sans-serif]">
                ¿Qué impulsamos en Primaria?
              </h4>
            </div>
          </div>

          <p className="text-gray-600 text-sm font-['Open_Sans',sans-serif] leading-relaxed">
            Desarrollamos competencias avanzadas en matemática, comunicación, ciencias y tecnología. Fomentamos el trabajo en equipo, la oratoria, el deporte y las expresiones artísticas para que cada alumno descubra y potencie su máximo potencial.
          </p>
        </div>

      </div>

      {/* Lado Derecho: Carrusel Inteligente y Puntos debajo de la carta (6 Columnas) */}
      <div className="lg:col-span-6 space-y-4 order-1 lg:order-2">
        
        {/* Contenedor de la Imagen */}
        <div 
          className="relative group overflow-hidden rounded-3xl border border-gray-200/80 shadow-md bg-gray-100"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            className="relative w-full h-[340px] sm:h-[390px]" 
            ref={emblaRef}
          >
            <div className="flex h-full">
              {SLIDES.map((slide) => (
                <div className="relative flex-[0_0_100%] h-full min-w-0 overflow-hidden" key={slide.id}>
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Flechas Minimalistas Sin Fondo */}
          <button
            onClick={scrollPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 text-white/90 hover:text-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] hover:scale-110"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-9 h-9 stroke-[2.5]" />
          </button>

          <button
            onClick={scrollNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 text-white/90 hover:text-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] hover:scale-110"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-9 h-9 stroke-[2.5]" />
          </button>
        </div>

        {/* Puntos Dinámicos Indicadores (Colocados debajo de la carta de imagen) */}
        <div className="flex items-center justify-center gap-2.5 pt-1">
          {SLIDES.map((_, index) => {
            const isActive = index === selectedIndex;
            return (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`relative h-2 rounded-full overflow-hidden transition-all duration-300 cursor-pointer bg-gray-200 ${
                  isActive ? "w-10 bg-gray-300" : "w-2.5 hover:bg-gray-400"
                }`}
                aria-label={`Ir a diapositiva ${index + 1}`}
              >
                {isActive && (
                  <div
                    className="absolute top-0 left-0 bottom-0 bg-amber-500 rounded-full transition-all duration-75 ease-linear"
                    style={{ width: `${isPaused ? progress : progress}%` }}
                  />
                )}
              </button>
            );
          })}
        </div>

      </div>

    </div>
  );
}