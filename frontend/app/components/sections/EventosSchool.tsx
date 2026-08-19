"use client";

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface EventItem {
  id: number;
  src: string;
  date: string;
  title: string;
  description: string;
}

const events: EventItem[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop",
    date: "02 ene. de 2025",
    title: "Matrícula abierta 2025",
    description: "Inicial, primaria y secundaria. Inglés intensivo, computación y natación.",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?q=80&w=1200&auto=format&fit=crop",
    date: "12 ene. de 2025",
    title: "Experiencias lúdicas",
    description: "Actividades de aprendizaje a través del juego para los más pequeños.",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1573497491208-6b1acb260507?q=80&w=1200&auto=format&fit=crop",
    date: "13 ene. de 2025",
    title: "Apoyo psicológico permanente",
    description: "Contamos con un profesional en psicología permanente.",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1600965962102-9d260a71890d?q=80&w=1200&auto=format&fit=crop",
    date: "13 ene. de 2025",
    title: "Clases de natación",
    description: "Contamos con piscina propia y saludable.",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop",
    date: "13 ene. de 2025",
    title: "Matrícula 2025",
    description: "El colegio abrió la matrícula en los 3 niveles educativos.",
  },
];

export default function EventsSection() {
  // Configurado con loop: false para mantener consistencia con la galería
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    slidesToScroll: 1,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    // Evita renders en cascada síncronos al montar
    queueMicrotask(() => {
      onSelect();
    });

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section id="Eventos" className="py-40 px-6 bg-[#16275d] text-white select-none font-['Poppins',sans-serif]">
      <div className="max-w-6xl mx-auto flex flex-col items-center">

        {/* Cabecera limpia sin enlace lateral superior */}
        <div className="w-full mb-12 flex flex-col items-start px-2">
          <div className="flex items-center gap-3 mb-3">
            <span aria-hidden="true" className="h-3.5 w-3.5 flex-shrink-0 rounded-[2px] bg-[#f8de32]" />
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Eventos
            </h2>
          </div>
          <p className="text-white/80 text-[15px] font-normal leading-relaxed text-justify max-w-[500px] font-['Open_Sans',sans-serif]">
            Novedades y actividades de nuestra comunidad educativa Cayros.
          </p>
        </div>

        <div className="w-full relative px-2 group">
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="absolute -left-4 sm:-left-5 top-[38%] -translate-y-1/2 z-20 bg-white hover:bg-[#f8de32] text-[#111c38] p-2.5 rounded-full shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-default"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5 stroke-[3]" />
          </button>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-5">
              {events.map((event) => (
                <div
                  className="flex-[0_0_85%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] lg:flex-[0_0_25%] min-w-0 pl-5"
                  key={event.id}
                >
                  <article className="bg-white rounded-lg overflow-hidden h-full flex flex-col shadow-lg cursor-default">
                    <div className="relative aspect-[4/3] w-full bg-slate-200 shrink-0">
                      <Image
                        src={event.src}
                        alt={event.title}
                        fill
                        className="object-cover"
                        draggable={false}
                      />
                    </div>
                    <div className="p-4 flex flex-col gap-1.5">
                      <span className="text-slate-500 text-xs font-['Open_Sans',sans-serif]">{event.date}</span>
                      <h3 className="text-[#111c38] font-bold text-base leading-snug">
                        {event.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed font-['Open_Sans',sans-serif]">
                        {event.description}
                      </p>
                    </div>
                  </article>
                </div>
              ))}

              {/* Tarjeta final interactiva con icono '+' que redirige a /eventos */}
              <div className="flex-[0_0_85%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] lg:flex-[0_0_25%] min-w-0 pl-5 flex">
                <Link
                  href="/eventos"
                  className="group/card relative w-full rounded-lg overflow-hidden bg-gradient-to-br from-[#111f4a] to-[#1e3578] border-2 border-dashed border-[#f8de32]/40 hover:border-[#f8de32] p-6 flex flex-col items-center justify-center text-center shadow-lg transition-all duration-300 cursor-pointer h-full min-h-[280px]"
                >
                  <div className="w-12 h-12 rounded-full bg-[#f8de32]/10 group-hover/card:bg-[#f8de32] flex items-center justify-center text-[#f8de32] group-hover/card:text-[#16275d] transition-all duration-300 mb-3 shadow-inner">
                    <Plus className="w-6 h-6 transition-transform duration-300 group-hover/card:scale-110 stroke-[2.5]" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">Más eventos</h3>
                  <p className="text-xs text-white/70 max-w-[200px] font-['Open_Sans',sans-serif]">
                    Explora todas las actividades y próximos eventos en la sección completa.
                  </p>
                </Link>
              </div>

            </div>
          </div>

          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="absolute -right-4 sm:-right-5 top-[38%] -translate-y-1/2 z-20 bg-white hover:bg-[#f8de32] text-[#111c38] p-2.5 rounded-full shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-default"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
      </div>
    </section>
  );
}