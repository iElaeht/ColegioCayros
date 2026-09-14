// frontend/app/syspanel/videos/components/VideoCard.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Edit, Eye, EyeOff, Calendar, Video as VideoIcon, Globe, Music2 } from "lucide-react";

interface VideoItem {
  id: number;
  src: string;
  alt: string;
  isActive: boolean;
  createdAt?: string;
}

interface VideoCardProps {
  item: VideoItem;
  onToggleStatus: (id: number) => void;
  onOpenEdit: (item: VideoItem) => void;
}

const tiktokThumbnailCache: Record<string, string> = {};

export default function VideoCard({ item, onToggleStatus, onOpenEdit }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const isHttpUrl = item.src.startsWith('http://') || item.src.startsWith('https://');
  const fullUrl = isHttpUrl ? item.src : `http://localhost:4000${item.src}`;
  const isYouTube = isHttpUrl && (item.src.includes('youtube.com') || item.src.includes('youtu.be'));
  const isTikTok = isHttpUrl && item.src.includes('tiktok.com');

  // Lógica para extraer la miniatura inicial (si es YouTube)
  let initialThumbnail = "";
  if (isYouTube) {
    let videoId = "";
    if (item.src.includes("youtu.be/")) {
      videoId = item.src.split("youtu.be/")[1]?.split("?")[0];
    } else if (item.src.includes("watch?v=")) {
      videoId = item.src.split("watch?v=")[1]?.split("&")[0];
    } else if (item.src.includes("embed/")) {
      videoId = item.src.split("embed/")[1]?.split("?")[0];
    }
    if (videoId) {
      initialThumbnail = `https://img.youtube.com/vi/${videoId}/hq720.jpg`;
    }
  } else if (isTikTok) {
    initialThumbnail = tiktokThumbnailCache[fullUrl] || "";
  }

  const [tiktokThumb, setTiktokThumb] = useState(initialThumbnail);

  // Obtener miniatura de TikTok de manera asíncrona vía oEmbed
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
      {/* Contenedor Superior (Vista previa de Video o Miniatura Extraída) */}
      <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden cursor-pointer flex items-center justify-center" onClick={() => onOpenEdit(item)}>
        
        {activeThumb ? (
          <Image 
            src={activeThumb} 
            alt={item.alt || "Vista previa de video"} 
            fill
            unoptimized
            className={`object-cover group-hover:scale-105 transition-transform duration-500 ${!item.isActive ? "grayscale-[40%]" : ""}`} 
          />
        ) : isHttpUrl ? (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 flex flex-col items-center justify-center p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white mb-2 shadow-inner backdrop-blur-xs">
              {isYouTube ? (
                <span className="text-red-500 font-bold text-sm">YT</span>
              ) : isTikTok ? (
                <Music2 className="w-6 h-6 text-pink-500 animate-pulse" />
              ) : (
                <Globe className="w-6 h-6 text-amber-400" />
              )}
            </div>
            <span className="text-[11px] font-medium text-slate-300 line-clamp-1 px-2">
              {isYouTube ? "Enlace de YouTube" : isTikTok ? "Enlace de TikTok" : "Enlace Externo"}
            </span>
          </div>
        ) : (
          <div className="absolute inset-0 bg-slate-950 flex items-center justify-center">
            <video 
              src={`http://localhost:4000${item.src}`}
              className={`w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500 ${!item.isActive ? "grayscale-[40%]" : ""}`}
              muted
              preload="metadata"
            />
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />
          </div>
        )}

        {/* Botón de edición en Hover */}
        <div className={`absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <div className="w-10 h-10 rounded-full bg-white/90 text-slate-900 shadow-lg flex items-center justify-center transform transition-transform duration-300 scale-90 group-hover:scale-100">
            <Edit className="w-4 h-4 text-amber-600" />
          </div>
        </div>

        {/* Badge miniatura de tipo */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-medium text-white flex items-center gap-1 shadow-sm">
          {isHttpUrl ? <Globe className="w-3 h-3 text-amber-400" /> : <VideoIcon className="w-3 h-3 text-emerald-400" />}
          <span>{isHttpUrl ? "URL" : "Archivo"}</span>
        </div>

      </div>

      {/* Contenido Inferior */}
      <div className="p-3.5 sm:p-4 flex flex-col gap-2.5 sm:gap-3">
        
        {/* Título */}
        <h3 className="text-xs font-bold text-slate-800 tracking-wide line-clamp-1 group-hover:text-amber-600 transition-colors" title={item.alt}>
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
            title={item.isActive ? "Ocultar video" : "Mostrar video"}
          >
            {item.isActive ? <EyeOff className="w-3.5 h-3.5 shrink-0" /> : <Eye className="w-3.5 h-3.5 shrink-0" />}
            <span>{item.isActive ? "Desactivar" : "Activar"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}