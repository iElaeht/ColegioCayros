// frontend/components/SchoolGallery.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Plus, X, Image as ImageIcon } from "lucide-react";

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  isFeatured?: boolean;
  order?: number;
}

export default function SchoolGallery() {
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start', dragFree: true });
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const HOME_LIMIT = 8;

  useEffect(() => {
    const fetchFeaturedImages = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/galeria"); 
        if (res.ok) {
          const data = await res.json();
          
          const slots: (GalleryItem | null)[] = Array(HOME_LIMIT).fill(null);

          data.forEach((img: GalleryItem) => {
            if (img.isFeatured && img.order && img.order >= 1 && img.order <= HOME_LIMIT) {
              slots[img.order - 1] = img;
            }
          });

          const orderedFeatured = slots.filter((img): img is GalleryItem => img !== null);
          
          if (orderedFeatured.length === 0) {
            const fallback = data.filter((img: GalleryItem) => img.isFeatured).slice(0, HOME_LIMIT);
            setGalleryImages(fallback);
          } else {
            setGalleryImages(orderedFeatured);
          }
          
          if (emblaApi) {
            emblaApi.reInit();
          }
        }
      } catch (error) {
        console.error("Error al cargar las imágenes destacadas del home:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedImages();
  }, [emblaApi]);

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
    <section id="Gallery" className="w-full bg-[#16275d] px-4 sm:px-8 py-16 sm:py-24 lg:py-32 text-white select-none overflow-hidden">
      <div className="mx-auto max-w-6xl">
        
        {/* Cabecera optimizada y responsiva */}
        <div className="mb-10 sm:mb-16 flex flex-col items-start max-w-2xl">
          <div className="flex items-center gap-3 mb-3">
            <span aria-hidden="true" className="h-3.5 w-3.5 flex-shrink-0 rounded-[2px] bg-[#f8de32]" />
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Galería
            </h2>
          </div>
          <p className="text-white/80 text-sm sm:text-base leading-relaxed text-left">
            Momentos destacados de nuestra comunidad educativa, reflejando el compromiso, el esfuerzo y la alegría que nos caracteriza en el día a día.
          </p>
        </div>

        {!loading && galleryImages.length === 0 ? (
          <div className="w-full rounded-2xl border-2 border-dashed border-white/25 bg-[#111f4a] p-10 sm:p-14 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white mb-4 shadow-sm">
              <ImageIcon className="w-7 h-7 text-[#f8de32]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Sección de Galería</h3>
            <p className="text-sm text-white/70 max-w-sm mx-auto">
              Próximamente contenido disponible.
            </p>
          </div>
        ) : (
          <div className="w-full relative group">
            {/* Botón Izquierdo (Oculto en móvil, visible en sm+) */}
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="hidden sm:flex absolute -left-5 lg:-left-6 top-[38%] -translate-y-1/2 z-20 bg-white hover:bg-[#f8de32] text-[#16275d] p-3 rounded-full shadow-xl transition-all duration-300 cursor-pointer items-center justify-center opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-default"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5 stroke-[3]" />
            </button>

            {/* Carrusel Embla */}
            <div className="overflow-hidden cursor-grab active:cursor-grabbing px-1 py-2" ref={emblaRef}>
              <div className="flex -ml-4 sm:-ml-6">
                {!loading && galleryImages.map((image) => {
                  const imageSrc = image.src.startsWith('http') ? image.src : `http://localhost:4000${image.src}`;
                  return (
                    <div className="flex-[0_0_85%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-4 sm:pl-6" key={image.id}>
                      <div 
                        onClick={() => setSelectedImage({ src: imageSrc, alt: image.alt || "Imagen del colegio" })}
                        className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-800 cursor-pointer group/item shadow-md hover:shadow-xl transition-all border border-white/10"
                      >
                        <Image 
                          src={imageSrc} 
                          alt={image.alt || "Galería Colegio"} 
                          fill 
                          className="object-cover transition-transform duration-700 group-hover/item:scale-105" 
                          draggable={false}
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-[#16275d]/40 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                      </div>
                      <p className="mt-3 text-xs sm:text-sm font-semibold text-white/90 truncate px-1">{image.alt || "Sin título"}</p>
                    </div>
                  );
                })}

                {/* Tarjeta final: Más imágenes */}
                <div className="flex-[0_0_85%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-4 sm:pl-6">
                  <Link
                    href="/galeria"
                    className="group/card relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#111f4a] border-2 border-dashed border-white/25 hover:border-[#f8de32] p-6 flex flex-col items-center justify-center text-center shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/10 group-hover/card:bg-[#f8de32] flex items-center justify-center text-white group-hover/card:text-[#16275d] transition-all duration-300 mb-3 shadow-inner">
                      <Plus className="w-6 h-6 transition-transform duration-300 group-hover/card:scale-110 stroke-[2.5]" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-1">Más imágenes</h3>
                    <p className="text-xs text-white/70 max-w-[200px]">Explora la galería completa.</p>
                  </Link>
                  <p className="mt-3 text-xs sm:text-sm font-semibold opacity-0 select-none">Galería Completa</p>
                </div>

              </div>
            </div>

            {/* Botón Derecho (Oculto en móvil, visible en sm+) */}
            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="hidden sm:flex absolute -right-5 lg:-right-6 top-[38%] -translate-y-1/2 z-20 bg-white hover:bg-[#f8de32] text-[#16275d] p-3 rounded-full shadow-xl transition-all duration-300 cursor-pointer items-center justify-center opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-default"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        )}
      </div>

      {/* Modal de Imagen Ampliada */}
      {selectedImage && (
        <div onClick={() => setSelectedImage(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 cursor-pointer animate-fadeIn">
          <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-4xl bg-[#16275d] rounded-2xl overflow-hidden shadow-2xl border border-white/20 p-4 sm:p-6 pt-3 flex flex-col items-center cursor-default">
            <div className="w-full flex justify-end mb-2">
              <button onClick={() => setSelectedImage(null)} className="bg-white text-[#16275d] hover:bg-[#f8de32] w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md font-bold">
                <X className="w-5 h-5 stroke-[3]" />
              </button>
            </div>
            <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-black/40">
              <Image src={selectedImage.src} alt={selectedImage.alt} fill className="object-contain" unoptimized />
            </div>
            <p className="text-center text-white/95 text-xs sm:text-sm mt-4 font-medium px-2 pb-1">{selectedImage.alt}</p>
          </div>
        </div>
      )}
    </section>
  );
}