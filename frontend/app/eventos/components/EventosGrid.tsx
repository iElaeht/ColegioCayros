// frontend/app/eventos/components/EventosGrid.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Calendar, X } from "lucide-react";

export interface EventoItem {
  id: number;
  titulo: string | null;
  descripcion: string | null;
  src: string;
  alt: string;
  isActive: boolean;
  isFeatured?: boolean;
  createdAt: string;
}

interface EventosGridProps {
  items: EventoItem[];
}

export default function EventosGrid({ items }: EventosGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Formatear la fecha a un formato amigable
  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
      return new Date(dateString).toLocaleDateString('es-ES', options);
    } catch {
      return "Actividad Institucional";
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-gray-200/80 shadow-sm">
        <p className="text-gray-500 text-sm font-['Open_Sans',sans-serif]">
          No se encontraron eventos registrados en el panel de control.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Grid de Eventos con la estructura limpia de la captura */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((event) => {
          const imageUrl = event.src.startsWith("http")
            ? event.src
            : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${event.src}`;

          return (
            <div
              key={event.id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 flex flex-col group shadow-xs hover:shadow-md"
            >
              {/* Contenedor de Imagen (Al hacer clic abre el modal) */}
              <div 
                onClick={() => setSelectedImage(imageUrl)}
                className="relative aspect-[16/10] w-full bg-slate-50 overflow-hidden cursor-pointer"
              >
                <Image
                  src={imageUrl}
                  alt={event.alt || event.titulo || "Evento institucional"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Contenido de la Tarjeta */}
              <div className="p-6 sm:p-7 flex flex-col flex-grow space-y-3">
                
                {/* Fecha limpia sin fondos (Estilo Minimalista) */}
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(event.createdAt)}</span>
                </div>

                {/* Título */}
                <h3 className="text-lg sm:text-xl font-bold text-[#111c38] leading-snug font-['Poppins',sans-serif] group-hover:text-[#16275d] transition-colors">
                  {event.titulo || "Evento sin título"}
                </h3>

                {/* Descripción */}
                <p className="text-gray-600 text-sm leading-relaxed pt-1 font-['Open_Sans',sans-serif] line-clamp-3">
                  {event.descripcion || "Sin descripción detallada para este evento."}
                </p>

              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Vista Previa con Blur */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-8 animate-in fade-in duration-200"
        >
          {/* Botón de cierre "X" */}
          <button
            onClick={() => setSelectedImage(null)}
            aria-label="Cerrar vista previa"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/80 hover:text-white transition-colors cursor-pointer outline-none z-50 p-2"
          >
            <X className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2]" />
          </button>

          {/* Contenedor de la Imagen Adaptado */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl h-[75vh] sm:h-[85vh] flex items-center justify-center px-2"
          >
            <Image
              src={selectedImage}
              alt="Vista previa de evento institucional"
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