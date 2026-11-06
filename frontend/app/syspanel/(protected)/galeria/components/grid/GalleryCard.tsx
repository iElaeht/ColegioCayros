// frontend/app/syspanel/(protected)/galeria/components/grid/GalleryCard.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Edit, Eye, EyeOff, Calendar, Star } from "lucide-react";

export interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  isActive: boolean;
  isFeatured?: boolean;
  order?: number;
  featuredOrder?: number;
  createdAt?: string;
}

interface GalleryCardProps {
  item: GalleryItem;
  onToggleStatus: (id: number) => void;
  onOpenEdit: (item: GalleryItem) => void;
}

export default function GalleryCard({ item, onToggleStatus, onOpenEdit }: GalleryCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const imageSrc = item.src.startsWith('http') 
    ? item.src 
    : `http://localhost:4000${item.src}`;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Reciente";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Reciente";
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Reciente";
    }
  };

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative bg-white rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl w-full select-none ${
        item.isActive 
          ? "border-slate-200 hover:border-[#16275d]/30" 
          : "border-slate-200/80 opacity-75 bg-slate-50/60"
      }`}
    >
      {/* Indicador de Slot / Destacado en la esquina superior */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-[#16275d]/85 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-md border border-white/10">
        <Star className={`w-3.5 h-3.5 ${item.isFeatured ? "text-amber-400 fill-amber-400" : "text-slate-400"}`} />
        <span>{item.isFeatured && item.order ? `Slot #${item.order}` : item.isFeatured ? "Destacado Home" : "No asignado"}</span>
      </div>

      {/* Imagen Superior con Efecto Glass y Botón Central en Hover */}
      <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden cursor-pointer" onClick={() => onOpenEdit(item)}>
        <Image 
          src={imageSrc} 
          alt={item.alt || "Imagen de galería"} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${!item.isActive ? "grayscale-[40%]" : ""}`} 
          unoptimized
        />

        <div className={`absolute inset-0 bg-[#16275d]/40 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <div className="w-11 h-11 rounded-2xl bg-white text-[#16275d] shadow-xl flex items-center justify-center transform transition-transform duration-300 scale-90 group-hover:scale-100">
            <Edit className="w-5 h-5 text-amber-500" />
          </div>
        </div>

        {/* Badge de estado flotante superior derecho */}
        <div className="absolute top-3 right-3 z-10">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-md backdrop-blur-md ${
            item.isActive ? "bg-emerald-500/90 text-white" : "bg-slate-900/80 text-slate-300"
          }`}>
            {item.isActive ? "Visible" : "Oculto"}
          </span>
        </div>
      </div>

      {/* Contenido Inferior */}
      <div className="p-4 sm:p-5 flex flex-col gap-3">
        
        {/* Título / Descripción Alternativa */}
        <h3 className="text-xs sm:text-sm font-bold text-[#16275d] tracking-wide line-clamp-1 group-hover:text-amber-600 transition-colors">
          {item.alt || "Imagen sin descripción"}
        </h3>

        {/* Fecha */}
        <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
          <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="truncate">{formatDate(item.createdAt)}</span>
        </div>

        <hr className="border-slate-100 my-0.5" />

        {/* Botón inferior unificado de cambiar estado */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => onToggleStatus(item.id)}
            className={`w-full py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
              item.isActive 
                ? "bg-amber-100/60 text-[#16275d] hover:bg-amber-200/80 border border-amber-200" 
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
            }`}
            title={item.isActive ? "Ocultar imagen" : "Mostrar imagen"}
          >
            {item.isActive ? <EyeOff className="w-4 h-4 shrink-0 text-[#16275d]" /> : <Eye className="w-4 h-4 shrink-0 text-slate-700" />}
            <span>{item.isActive ? "Desactivar visibilidad" : "Activar visibilidad"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}