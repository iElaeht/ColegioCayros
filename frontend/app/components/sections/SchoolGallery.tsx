"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const galleryImages = [
  { id: 1, src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop", alt: "Clases escolares interactivas" },
  { id: 2, src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop", alt: "Estudiantes en las instalaciones" },
  { id: 3, src: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1200&auto=format&fit=crop", alt: "Ambiente de estudio y biblioteca" },
  { id: 4, src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop", alt: "Clases escolares interactivas" },
  { id: 5, src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop", alt: "Estudiantes en las instalaciones" },
  { id: 6, src: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1200&auto=format&fit=crop", alt: "Ambiente de estudio y biblioteca" },
];

export default function SchoolGallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <section id="Gallery" className="w-full bg-[#111c38] px-6 py-24 sm:px-10 lg:px-16 text-white select-none">
      <div className="mx-auto max-w-5xl">
        
        {/* Encabezado con la descripción restaurada, justificada y margen sutilmente ampliado */}
        <div className="mb-16 flex flex-col items-start">
          <div className="flex items-center gap-3 mb-3">
            <span aria-hidden="true" className="h-3.5 w-3.5 flex-shrink-0 rounded-[2px] bg-yellow-400" />
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Galería
            </h2>
          </div>
          <p className="text-white/80 text-[15px] font-normal leading-relaxed text-justify max-w-[500px]">
            Momentos destacados de nuestra comunidad educativa, reflejando el compromiso, el esfuerzo y la alegría que nos caracteriza en el día a día.
          </p>
        </div>

        <div className="w-full relative group">
          <button
            onClick={scrollPrev}
            className="absolute -left-12 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-yellow-400 text-[#111c38] p-2.5 rounded-full shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5 stroke-[3]" />
          </button>

          <div className="overflow-hidden cursor-grab" ref={emblaRef}>
            <div className="flex -ml-6">
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
                    
                    <div className="absolute inset-0 bg-[#111c38]/40 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-white/90">{image.alt}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={scrollNext}
            className="absolute -right-12 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-yellow-400 text-[#111c38] p-2.5 rounded-full shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
      </div>

      {selectedImage && (
        <div onClick={() => setSelectedImage(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 cursor-pointer">
          <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-4xl bg-[#111c38] rounded-xl overflow-hidden shadow-2xl border border-white/20 p-4 pt-3 flex flex-col items-center cursor-default">
            <div className="w-full flex justify-end mb-2">
              <button onClick={() => setSelectedImage(null)} className="bg-white text-[#111c38] hover:bg-yellow-400 w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md">
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