// frontend/app/syspanel/(protected)/galeria/components/home-config/GalleryHomeCard.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar } from "lucide-react";

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  isActive: boolean;
  isFeatured?: boolean;
  order?: number;
  createdAt?: string;
}

interface GalleryCardProps {
  item?: GalleryItem;
  isSelected?: boolean;
  isInteractive?: boolean;
  selectionNumber?: number | null;
  hideDetails?: boolean;
  onClick?: () => void;
}

export default function GalleryHomeCard({
  item,
  isSelected = false,
  isInteractive = false,
  selectionNumber = null,
  hideDetails = false,
  onClick,
}: GalleryCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (!item || !item.src) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 aspect-[16/10] w-full flex items-center justify-center text-xs font-medium text-slate-400 select-none transform-gpu">
        Cargando...
      </div>
    );
  }

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

  const titleText = item.alt && item.alt.trim() !== "" ? item.alt : "Imagen sin título";

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`group bg-white rounded-2xl transition-all duration-300 flex flex-col cursor-pointer border shadow-xs hover:shadow-lg select-none transform-gpu ${
        isSelected 
          ? "border-[#16275d] ring-2 ring-[#16275d]/20 bg-[#16275d]/5" 
          : "border-slate-200 hover:border-[#16275d]/40"
      } ${hideDetails ? "p-1.5 gap-0" : "p-3 gap-3"}`}
    >
      <div className={`relative w-full rounded-xl bg-slate-100 overflow-hidden isolate transform-gpu ${
        hideDetails ? "aspect-[4/3] rounded-xl" : "aspect-[16/10]"
      }`}>
        <Image 
          src={imageSrc} 
          alt={titleText} 
          fill 
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 transform-gpu group-hover:scale-105" 
          unoptimized
        />

        <div className="absolute inset-0 bg-[#16275d]/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Únicamente mostramos el número de orden de selección cuando está activo en modo interactivo */}
        {isInteractive && isSelected && selectionNumber !== null && (
          <div className="absolute top-2.5 right-2.5 z-30 transform-gpu">
            <div className="w-7 h-7 rounded-xl bg-[#16275d] text-amber-400 flex items-center justify-center text-xs font-bold shadow-md border border-white/20">
              {selectionNumber}
            </div>
          </div>
        )}
      </div>

      {!hideDetails && (
        <div className="flex flex-col gap-1.5 px-1 pb-1">
          <h3 
            title={titleText}
            className="text-xs sm:text-sm font-bold text-[#16275d] tracking-tight truncate group-hover:text-amber-600 transition-colors duration-200"
          >
            {titleText}
          </h3>

          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
            <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">{formatDate(item.createdAt)}</span>
          </div>
        </div>
      )}
    </div>
  );
}