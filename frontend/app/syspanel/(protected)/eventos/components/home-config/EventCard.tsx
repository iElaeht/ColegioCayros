// frontend/app/syspanel/(protected)/eventos/components/home-config/EventCard.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar } from "lucide-react";

interface EventItem {
  id: number;
  src: string;
  alt: string;
  isActive: boolean;
  createdAt?: string;
}

interface EventCardProps {
  item?: EventItem;
  isSelected?: boolean;
  isInteractive?: boolean;
  selectionNumber?: number | null;
  hideDetails?: boolean;
  onClick?: () => void;
}

export default function EventCard({
  item,
  isSelected = false,
  isInteractive = false,
  selectionNumber = null,
  hideDetails = false,
  onClick,
}: EventCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (!item || !item.src) {
    return (
      <div className="rounded-xl border border-slate-100 bg-slate-50 aspect-[16/10] w-full flex items-center justify-center text-xs text-slate-400">
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

  const titleText = item.alt && item.alt.trim() !== "" ? item.alt : "Evento sin título";

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`group bg-white rounded-xl transition-all duration-300 flex flex-col cursor-pointer border border-slate-100 hover:border-slate-200 shadow-xs hover:shadow-md ${
        hideDetails ? "p-1 gap-0" : "p-2 gap-2.5"
      }`}
    >
      <div className={`relative w-full rounded-lg bg-slate-100 overflow-hidden isolate ${
        hideDetails ? "aspect-[4/3] rounded-lg" : "aspect-[16/10]"
      }`}>
        <Image 
          src={imageSrc} 
          alt={titleText} 
          fill 
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105" 
          unoptimized
        />

        <div className="absolute inset-0 bg-slate-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {isInteractive && isSelected && selectionNumber !== null && (
          <div className="absolute top-2.5 right-2.5 z-30">
            <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-[11px] font-bold shadow-md shadow-amber-500/40">
              {selectionNumber}
            </div>
          </div>
        )}
      </div>

      {!hideDetails && (
        <div className="flex flex-col gap-1 px-1 pb-0.5">
          <h3 
            title={titleText}
            className="text-xs font-medium text-slate-600 tracking-tight truncate group-hover:text-amber-600 transition-colors"
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