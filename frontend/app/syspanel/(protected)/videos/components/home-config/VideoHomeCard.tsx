// frontend/app/syspanel/(protected)/videos/components/home-config/VideoHomeCard.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, Music2, Globe, Star } from "lucide-react";

interface VideoItem {
  id: number;
  src: string;
  alt: string;
  isActive: boolean;
  isFeatured?: boolean;
  order?: number;
  createdAt?: string;
}

interface VideoCardProps {
  item?: VideoItem;
  isSelected?: boolean;
  isInteractive?: boolean;
  selectionNumber?: number | null;
  hideDetails?: boolean;
  onClick?: () => void;
}

const tiktokThumbnailCache: Record<string, string> = {};

export default function VideoCard({
  item,
  isSelected = false,
  isInteractive = false,
  selectionNumber = null,
  hideDetails = false,
  onClick,
}: VideoCardProps) {
  const [, setIsHovered] = useState(false);

  // 1. Extraemos las propiedades de manera segura por si item es undefined
  const itemSrc = item?.src || "";
  const isHttpUrl = itemSrc.startsWith('http://') || itemSrc.startsWith('https://');
  const fullUrl = isHttpUrl ? itemSrc : `http://localhost:4000${itemSrc}`;
  const isYouTube = isHttpUrl && (itemSrc.includes('youtube.com') || itemSrc.includes('youtu.be'));
  const isTikTok = isHttpUrl && itemSrc.includes('tiktok.com');

  // Lógica para extraer la miniatura inicial si es YouTube
  let initialThumbnail = "";
  if (isYouTube) {
    let videoId = "";
    if (itemSrc.includes("youtu.be/")) {
      videoId = itemSrc.split("youtu.be/")[1]?.split("?")[0];
    } else if (itemSrc.includes("watch?v=")) {
      videoId = itemSrc.split("watch?v=")[1]?.split("&")[0];
    } else if (itemSrc.includes("embed/")) {
      videoId = itemSrc.split("embed/")[1]?.split("?")[0];
    }
    if (videoId) {
      initialThumbnail = `https://img.youtube.com/vi/${videoId}/hq720.jpg`;
    }
  } else if (isTikTok) {
    initialThumbnail = tiktokThumbnailCache[fullUrl] || "";
  }

  // 2. Todos los Hooks se llaman siempre incondicionalmente al nivel superior
  const [tiktokThumb, setTiktokThumb] = useState(initialThumbnail);

  // Obtener miniatura de TikTok de forma asíncrona vía oEmbed
  useEffect(() => {
    if (isTikTok && !tiktokThumb && !tiktokThumbnailCache[fullUrl]) {
      fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(fullUrl)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.thumbnail_url) {
            tiktokThumbnailCache[fullUrl] = data.thumbnail_url;
            setTiktokThumb(data.thumbnail_url);
          }
        })
        .catch(() => {});
    }
  }, [isTikTok, fullUrl, tiktokThumb]);

  // 3. La validación de carga se realiza DESPUÉS de declarar los Hooks
  if (!item || !item.src) {
    return (
      <div className="rounded-xl border border-slate-100 bg-slate-50 aspect-[16/10] w-full flex items-center justify-center text-xs text-slate-400">
        Cargando...
      </div>
    );
  }

  const activeThumb = tiktokThumb || initialThumbnail;

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

  const titleText = item.alt && item.alt.trim() !== "" ? item.alt : "Video sin título";

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`group bg-white rounded-xl transition-colors duration-200 flex flex-col cursor-pointer border border-slate-100 hover:border-slate-200 shadow-xs hover:shadow-md transform-gpu ${
        hideDetails ? "p-1 gap-0" : "p-2 gap-2.5"
      }`}
    >
      <div className={`relative w-full rounded-lg bg-slate-900 overflow-hidden isolate transform-gpu flex items-center justify-center ${
        hideDetails ? "aspect-[4/3] rounded-lg" : "aspect-[16/10]"
      }`}>
        {activeThumb ? (
          <Image 
            src={activeThumb} 
            alt={titleText} 
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            unoptimized
            className="object-cover transition-transform duration-300 transform-gpu group-hover:scale-105" 
          />
        ) : isTikTok ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white p-2 text-center">
            <Music2 className="w-8 h-8 text-pink-500 mb-1 shrink-0 animate-pulse" />
            <span className="text-[10px] font-semibold text-white line-clamp-2">TikTok</span>
          </div>
        ) : isYouTube ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-300 p-2 text-center">
            <span className="text-red-500 font-bold text-base">YT</span>
            <span className="text-[10px] font-semibold text-slate-400">YouTube</span>
          </div>
        ) : isHttpUrl ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-300 p-2 text-center">
            <Globe className="w-8 h-8 text-amber-400 mb-1 shrink-0" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Enlace Externo</span>
          </div>
        ) : (
          <video 
            src={fullUrl}
            className="w-full h-full object-cover transition-transform duration-300 transform-gpu group-hover:scale-105"
            preload="metadata"
            muted
          />
        )}

        <div className="absolute inset-0 bg-slate-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

        {/* Indicador de Slot / Destacado o Número de Selección (Espejo exacto del Hero) */}
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