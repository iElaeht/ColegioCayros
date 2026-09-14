// frontend/app/syspanel/galeria/components/GalleryCard.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Edit, Eye, EyeOff, Calendar } from "lucide-react";

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  isActive: boolean;
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
      className={`group relative bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-xl w-full ${
        item.isActive 
          ? "border-slate-200/80 hover:border-amber-400/50" 
          : "border-slate-200/60 opacity-75 bg-slate-50/50"
      }`}
    >
      {/* Imagen Superior con Efecto Glass y Lápiz Central en Hover */}
      <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden cursor-pointer" onClick={() => onOpenEdit(item)}>
        <Image 
          src={imageSrc} 
          alt={item.alt} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${!item.isActive ? "grayscale-[40%]" : ""}`} 
          unoptimized
        />

        <div className={`absolute inset-0 bg-slate-950/30 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <div className="w-10 h-10 rounded-full bg-white/90 text-slate-900 shadow-lg flex items-center justify-center transform transition-transform duration-300 scale-90 group-hover:scale-100">
            <Edit className="w-4 h-4 text-amber-600" />
          </div>
        </div>
      </div>

      {/* Contenido Inferior */}
      <div className="p-3.5 sm:p-4 flex flex-col gap-2.5 sm:gap-3">
        
        {/* Título */}
        <h3 className="text-xs font-bold text-slate-800 tracking-wide line-clamp-1 group-hover:text-amber-600 transition-colors">
          {item.alt}
        </h3>

        {/* Estado y Fecha */}
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[11px] font-semibold tracking-wide shrink-0 ${
            item.isActive ? "text-emerald-600" : "text-slate-400"
          }`}>
            {item.isActive ? "Visible" : "Oculto"}
          </span>

          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] sm:text-xs font-medium truncate">
            <Calendar className="w-3.5 h-3.5 text-amber-500/90 shrink-0" />
            <span className="truncate">{formatDate(item.createdAt)}</span>
          </div>
        </div>

        <hr className="border-slate-100 my-0.5" />

        {/* Botón inferior */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => onToggleStatus(item.id)}
            className={`w-full sm:w-auto px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              item.isActive 
                ? "bg-amber-50 text-amber-700 hover:bg-amber-100/80" 
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
            title={item.isActive ? "Ocultar imagen" : "Mostrar imagen"}
          >
            {item.isActive ? <EyeOff className="w-3.5 h-3.5 shrink-0" /> : <Eye className="w-3.5 h-3.5 shrink-0" />}
            <span>{item.isActive ? "Desactivar" : "Activar"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}