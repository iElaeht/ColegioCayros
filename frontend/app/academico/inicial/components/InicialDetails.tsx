// frontend/app/academico/inicial/components/InicialDetails.tsx
"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Heart, Sparkles } from "lucide-react";

const SLIDES = [
  { id: 1, src: "/images/inicial/Image-1.jpg", alt: "Actividades en Nivel Inicial 1" },
  { id: 2, src: "/images/inicial/Image-2.jpg", alt: "Actividades en Nivel Inicial 2" },
  { id: 3, src: "/images/inicial/Image-3.jpg", alt: "Actividades en Nivel Inicial 3" },
];

const INTERVAL_TIME = 5000; // 5 segundos por imagen

export default function InicialDetails() {
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
              <Heart className="w-5 h-5 text-amber-500 fill-amber-500" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600">Formación Integral</span>
              <h3 className="text-xl font-bold text-[#111c38] font-['Poppins',sans-serif]">
                Misión y Visión del Nivel
              </h3>
            </div>
          </div>

          <div className="space-y-4 text-gray-600 text-sm font-['Open_Sans',sans-serif] leading-relaxed">
            <p>
              <strong className="text-[#111c38]">Misión:</strong> Brindar una educación afectiva y de alta calidad en la primera infancia, estimulando la curiosidad natural, la autonomía, la creatividad y la socialización de los niños en un entorno seguro y cálido.
            </p>
            <div className="border-t border-gray-100 pt-3">
              <p>
                <strong className="text-[#111c38]">Visión:</strong> Ser el nivel inicial de referencia en Chincha, formando niños seguros de sí mismos, felices y con valores sólidos que sirvan de cimiento para su exitosa vida escolar.
              </p>
            </div>
          </div>
        </div>

        {/* Bloque Informativo sobre lo que Brindamos a los Niños */}
        <div className="bg-white border border-gray-200/80 p-8 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#16275d]">Metodología y Cuidado</span>
              <h4 className="text-lg font-bold text-[#111c38] font-['Poppins',sans-serif]">
                ¿Qué brindamos a nuestros pequeños?
              </h4>
            </div>
          </div>

          <p className="text-gray-600 text-sm font-['Open_Sans',sans-serif] leading-relaxed">
            Fomentamos el aprendizaje a través del juego, el arte y la psicomotricidad. Contamos con un programa enfocado en la estimulación del lenguaje, el desarrollo socioemocional y el acompañamiento personalizado para garantizar que cada niño se sienta único, valorado y motivado cada día.
          </p>
        </div>

      </div>

      {/* Lado Derecho: Carruscél y Puntos debajo de la carta (6 Columnas) */}
      <div className="lg:col-span-6 space-y-4 order-1 lg:order-2">
        
        {/* Contenedor de la Imagen más compacto */}
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