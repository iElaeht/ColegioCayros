// frontend/components/EventsSection.tsx
"use client";

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Plus, Calendar } from 'lucide-react';

interface EventItem {
  id: number;
  src: string;
  date: string;
  title: string;
  description: string;
}

interface BackendEvent {
  id: number;
  src: string;
  createdAt: string;
  titulo?: string;
  descripcion?: string;
  alt: string;
}

export default function EventsSection() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    slidesToScroll: 1,
    dragFree: true,
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
    const fetchEvents = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/eventos?soloDestacadas=true');
        if (res.ok) {
          const data: BackendEvent[] = await res.json();
          const formatted: EventItem[] = data.map((item) => ({
            id: item.id,
            src: item.src.startsWith("http") ? item.src : `http://localhost:4000${item.src}`,
            date: new Date(item.createdAt).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
            title: item.titulo || item.alt,
            description: item.descripcion || item.alt,
          }));
          setEvents(formatted);
        }
      } catch (error) {
        console.error("Error al cargar eventos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    queueMicrotask(() => {
      onSelect();
    });

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (loading) {
    return (
      <section id="Eventos" className="py-24 px-6 bg-[#16275d] text-white flex justify-center items-center">
        <p className="text-white/70 animate-pulse font-['Open_Sans',sans-serif]">Cargando eventos...</p>
      </section>
    );
  }

  return (
    <section id="Eventos" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-8 bg-[#16275d] text-white select-none font-['Poppins',sans-serif] overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col items-center">

        {/* Cabecera Responsiva */}
        <div className="w-full mb-10 sm:mb-14 flex flex-col items-start max-w-2xl px-1">
          <div className="flex items-center gap-3 mb-3">
            <span aria-hidden="true" className="h-3.5 w-3.5 flex-shrink-0 rounded-[2px] bg-[#f8de32]" />
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Eventos
            </h2>
          </div>
          <p className="text-white/80 text-sm sm:text-base leading-relaxed text-left font-['Open_Sans',sans-serif]">
            Novedades y actividades de nuestra comunidad educativa Cayros.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="w-full rounded-2xl border-2 border-dashed border-white/20 bg-[#111f4a] p-10 sm:p-14 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white mb-4 shadow-sm">
              <Calendar className="w-7 h-7 text-[#f8de32]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Sección de Eventos</h3>
            <p className="text-sm text-white/70 max-w-sm mx-auto font-['Open_Sans',sans-serif]">
              Próximamente contenido disponible.
            </p>
          </div>
        ) : (
          <div className="w-full relative px-1 group">
            {/* Botón Izquierdo (Oculto en móvil, visible en sm+) */}
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="hidden sm:flex absolute -left-5 lg:-left-6 top-[42%] -translate-y-1/2 z-20 bg-white hover:bg-[#f8de32] text-[#111c38] p-3 rounded-full shadow-xl transition-all duration-300 cursor-pointer items-center justify-center opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-default"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5 stroke-[3]" />
            </button>

            {/* Carrusel Embla */}
            <div className="overflow-hidden cursor-grab active:cursor-grabbing py-2" ref={emblaRef}>
              <div className="flex -ml-4 sm:-ml-5">
                {events.map((event) => (
                  <div
                    className="flex-[0_0_85%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] lg:flex-[0_0_25%] min-w-0 pl-4 sm:pl-5"
                    key={event.id}
                  >
                    <article className="bg-white rounded-2xl overflow-hidden h-full flex flex-col shadow-lg cursor-default border border-slate-100 transition-transform duration-300 hover:-translate-y-1">
                      <div className="relative aspect-[4/3] w-full bg-slate-200 shrink-0">
                        <Image
                          src={event.src}
                          alt={event.title}
                          fill
                          className="object-cover"
                          draggable={false}
                          unoptimized
                        />
                      </div>
                      <div className="p-4 sm:p-5 flex flex-col justify-between flex-grow gap-2">
                        <div>
                          <span className="text-slate-500 text-xs font-semibold font-['Open_Sans',sans-serif] uppercase tracking-wider">{event.date}</span>
                          
                          <h3 
                            className="text-[#111c38] font-bold text-sm sm:text-base leading-snug line-clamp-2 mt-1"
                            title={event.title}
                          >
                            {event.title}
                          </h3>

                          <p 
                            className="text-slate-600 text-xs sm:text-sm leading-relaxed font-['Open_Sans',sans-serif] line-clamp-2 mt-1.5"
                            title={event.description}
                          >
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </article>
                  </div>
                ))}

                {/* Tarjeta final: Más eventos */}
                <div className="flex-[0_0_85%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] lg:flex-[0_0_25%] min-w-0 pl-4 sm:pl-5 flex">
                  <Link
                    href="/eventos"
                    className="group/card relative w-full rounded-2xl overflow-hidden bg-[#111f4a] border-2 border-dashed border-white/25 hover:border-[#f8de32] p-6 flex flex-col items-center justify-center text-center shadow-lg transition-all duration-300 cursor-pointer h-full min-h-[300px]"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/10 group-hover/card:bg-[#f8de32] flex items-center justify-center text-white group-hover/card:text-[#16275d] transition-all duration-300 mb-3 shadow-inner">
                      <Plus className="w-6 h-6 transition-transform duration-300 group-hover/card:scale-110 stroke-[2.5]" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-1">Más eventos</h3>
                    <p className="text-xs text-white/70 max-w-[200px] font-['Open_Sans',sans-serif]">
                      Explora todos los eventos.
                    </p>
                  </Link>
                </div>

              </div>
            </div>

            {/* Botón Derecho (Oculto en móvil, visible en sm+) */}
            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="hidden sm:flex absolute -right-5 lg:-right-6 top-[42%] -translate-y-1/2 z-20 bg-white hover:bg-[#f8de32] text-[#111c38] p-3 rounded-full shadow-xl transition-all duration-300 cursor-pointer items-center justify-center opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-default"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}