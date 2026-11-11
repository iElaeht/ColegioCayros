// frontend/app/galeria/components/GalleryGrid.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Tag, X } from "lucide-react";

export interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
}

interface GalleryGridProps {
  items: GalleryItem[];
}

export default function GalleryGrid({ items }: GalleryGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-gray-200/80">
        <p className="text-gray-500 text-sm font-['Open_Sans',sans-serif]">
          No se encontraron imágenes en la galería institucional.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Grid de Imágenes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const imageUrl = item.src.startsWith("http")
            ? item.src
            : `http://localhost:4000${item.src}`;

          return (
            <div
              key={item.id}
              onClick={() => setSelectedImage(imageUrl)}
              className="group bg-white border border-gray-200/80 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
            >
              {/* Contenedor de Imagen */}
              <div className="relative w-full h-56 sm:h-60 overflow-hidden bg-gray-100">
                <Image
                  src={imageUrl}
                  alt={item.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#16275d]/85 backdrop-blur-md text-amber-400 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-md">
                  <Tag className="w-3 h-3" />
                  {item.isFeatured ? "Destacada" : "Institucional"}
                </div>
              </div>

              {/* Contenido de la Tarjeta */}
              <div className="p-5 sm:p-6 flex flex-col justify-between flex-grow space-y-3">
                <h3 className="text-base sm:text-lg font-bold text-[#111c38] font-['Poppins',sans-serif] group-hover:text-amber-600 transition-colors line-clamp-2">
                  {item.alt}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Vista Previa (Minimalista con Blur y X sin fondo) */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-8 animate-in fade-in duration-200"
        >
          {/* Botón de cierre "X" limpio y sin fondo (Responsivo) */}
          <button
            onClick={() => setSelectedImage(null)}
            aria-label="Cerrar vista previa"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/80 hover:text-white transition-colors cursor-pointer outline-none z-50 p-2"
          >
            <X className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2]" />
          </button>

          {/* Contenedor de la Imagen Adaptado para Móviles y Escritorio */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl h-[75vh] sm:h-[85vh] flex items-center justify-center px-2"
          >
            <Image
              src={selectedImage}
              alt="Vista previa institucional"
              fill
              className="object-contain rounded-xl"
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}