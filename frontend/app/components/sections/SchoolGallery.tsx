"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";

const galleryImages = [
  { id: 1, src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop", alt: "Clases escolares interactivas" },
  { id: 2, src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop", alt: "Estudiantes en las instalaciones" },
  { id: 3, src: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1200&auto=format&fit=crop", alt: "Ambiente de estudio y biblioteca" },
  { id: 4, src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop", alt: "Clases escolares interactivas" },
  { id: 5, src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop", alt: "Estudiantes en las instalaciones" },
  { id: 6, src: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1200&auto=format&fit=crop", alt: "Ambiente de estudio y biblioteca" },
  { id: 7, src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop", alt: "Laboratorio de cómputo" },
  { id: 8, src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop", alt: "Áreas deportivas" },
];

export default function SchoolGallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

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
    queueMicrotask(() => {
      onSelect();
    });
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Efecto para bloquear/desbloquear el scroll del body cuando el modal está abierto
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedImage]);

  return (
    <section id="Gallery" className="w-full bg-[#16275d] px-6 py-24 sm:px-10 lg:px-16 text-white select-none">
      <div className="mx-auto max-w-5xl">
        
        {/* Encabezado limpio */}
        <div className="mb-16 flex flex-col items-start">
          <div className="flex items-center gap-3 mb-3">
            <span aria-hidden="true" className="h-3.5 w-3.5 flex-shrink-0 rounded-[2px] bg-[#f8de32]" />
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Galería
            </h2>
          </div>
          <p className="text-white/80 text-[15px] font-normal leading-relaxed text-justify max-w-[500px]">
            Momentos destacados de nuestra comunidad educativa, reflejando el compromiso, el esfuerzo y la alegría que nos caracteriza en el día a día.
          </p>
        </div>

        <div className="w-full relative group">
          {/* Botón Anterior */}
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="absolute -left-12 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-[#f8de32] text-[#16275d] p-2.5 rounded-full shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-default"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5 stroke-[3]" />
          </button>

          <div className="overflow-hidden cursor-grab" ref={emblaRef}>
            <div className="flex -ml-6">
              {/* Mapeo de las imágenes */}
              {galleryImages.map((image) => (
                <div className="flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] min-w-0 pl-6" key={image.id}>
                  <div 
                    onClick={() => setSelectedImage({ src: image.src, alt: image.alt })}
                    className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-800 cursor-pointer group/item shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Image 
                      src={image.src} 
                      alt={image.alt} 
                      fill 
                      className="object-cover" 
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-[#16275d]/40 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-white/90">{image.alt}</p>
                </div>
              ))}

              {/* Tarjeta final interactiva con icono '+' que redirige a /galeria */}
              <div className="flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] min-w-0 pl-6">
                <Link
                  href="/galeria"
                  className="group/card relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-gradient-to-br from-[#111f4a] to-[#1e3578] border-2 border-dashed border-[#f8de32]/40 hover:border-[#f8de32] p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-[#f8de32]/10 group-hover/card:bg-[#f8de32] flex items-center justify-center text-[#f8de32] group-hover/card:text-[#16275d] transition-all duration-300 mb-3 shadow-inner">
                    <Plus className="w-6 h-6 transition-transform duration-300 group-hover/card:scale-110 stroke-[2.5]" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">Más imágenes</h3>
                  <p className="text-xs text-white/70 max-w-[200px]">
                    Explora todos los álbumes y momentos de nuestra comunidad en la galería completa.
                  </p>
                </Link>
                {/* Espacio reservado invisible para alinear el pie de texto con las demás tarjetas */}
                <p className="mt-3 text-sm font-semibold opacity-0 select-none">Galería Completa</p>
              </div>

            </div>
          </div>

          {/* Botón Siguiente */}
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="absolute -right-12 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-[#f8de32] text-[#16275d] p-2.5 rounded-full shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-default"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
      </div>

      {selectedImage && (
        <div onClick={() => setSelectedImage(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 cursor-pointer">
          <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-4xl bg-[#16275d] rounded-xl overflow-hidden shadow-2xl border border-white/20 p-4 pt-3 flex flex-col items-center cursor-default">
            <div className="w-full flex justify-end mb-2">
              <button onClick={() => setSelectedImage(null)} className="bg-white text-[#16275d] hover:bg-[#f8de32] w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md">
                <X className="w-5 h-5 stroke-[3]" />
              </button>
            </div>
            <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden">
              <Image src={selectedImage.src} alt={selectedImage.alt} fill className="object-contain" />
            </div>
            <p className="text-center text-white/90 text-sm mt-3 font-medium pb-1">{selectedImage.alt}</p>
          </div>
        </div>
      )}
    </section>
  );
}