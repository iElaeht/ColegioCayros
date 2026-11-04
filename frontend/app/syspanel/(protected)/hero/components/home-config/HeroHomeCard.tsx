// frontend/app/syspanel/(protected)/hero/components/home-config/HeroHomeCard.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar, Star } from "lucide-react";

interface HeroSlideItem {
  id: number;
  title?: string | null;
  imageUrl: string;
  isActive: boolean;
  isFeatured?: boolean;
  order?: number;
  createdAt?: string;
}

interface HeroHomeCardProps {
  item?: HeroSlideItem;
  isSelected?: boolean;
  isInteractive?: boolean;
  selectionNumber?: number | null;
  hideDetails?: boolean;
  onClick?: () => void;
}

export default function HeroHomeCard({
  item,
  isSelected = false,
  isInteractive = false,
  selectionNumber = null,
  hideDetails = false,
  onClick,
}: HeroHomeCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (!item || !item.imageUrl) {
    return (
      <div className="rounded-xl border border-slate-100 bg-slate-50 aspect-[16/10] w-full flex items-center justify-center text-xs text-slate-400 transform-gpu">
        Cargando...
      </div>
    );
  }

  const imageSrc = item.imageUrl.startsWith('http')   
    ? item.imageUrl 
    : `http://localhost:4000${item.imageUrl}`;

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

  const titleText = item.title && item.title.trim() !== "" ? item.title : "Banner sin título";

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`group bg-white rounded-xl transition-colors duration-200 flex flex-col cursor-pointer border border-slate-100 hover:border-slate-200 shadow-xs hover:shadow-md transform-gpu ${
        hideDetails ? "p-1 gap-0" : "p-2 gap-2.5"
      }`}
    >
      <div className={`relative w-full rounded-lg bg-slate-100 overflow-hidden isolate transform-gpu ${
        hideDetails ? "aspect-[4/3] rounded-lg" : "aspect-[16/10]"
      }`}>
        <Image 
          src={imageSrc} 
          alt={titleText} 
          fill 
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 transform-gpu group-hover:scale-105" 
          unoptimized
        />

        <div className="absolute inset-0 bg-slate-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

        {/* Indicador de Slot / Destacado o Número de Selección */}
        {isInteractive && isSelected && selectionNumber !== null ? (
          <div className="absolute top-2.5 right-2.5 z-30 transform-gpu">
            <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-[11px] font-bold shadow-md shadow-amber-500/40">
              {selectionNumber}
            </div>
          </div>
        ) : (
          <div className="absolute top-2 left-2 z-20 flex items-center gap-1 bg-slate-900/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm transform-gpu">
            <Star className={`w-3 h-3 ${item.isFeatured ? "text-amber-400 fill-amber-400" : "text-slate-400"}`} />
            <span>{item.isFeatured && item.order ? `#${item.order}` : "Libre"}</span>
          </div>
        )}
      </div>

      {!hideDetails && (
        <div className="flex flex-col gap-1 px-1 pb-0.5">
          <h3 
            title={titleText}
            className="text-xs font-medium text-slate-600 tracking-tight truncate group-hover:text-amber-600 transition-colors duration-200"
          >
            {titleText}
          </h3>

          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Calendar className="w-3 h-3 text-amber-500/80 shrink-0" />
            <span className="truncate">{formatDate(item.createdAt)}</span>
          </div>
        </div>
      )}
    </div>
  );
}