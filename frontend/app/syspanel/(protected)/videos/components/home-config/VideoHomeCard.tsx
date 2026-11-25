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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const tiktokThumbnailCache: Record<string, string> = {};

function extractYouTubeId(url: string): string {
  if (url.includes("youtu.be/")) {
    return url.split("youtu.be/")[1]?.split("?")[0] || "";
  }
  if (url.includes("watch?v=")) {
    return url.split("watch?v=")[1]?.split("&")[0] || "";
  }
  if (url.includes("embed/")) {
    return url.split("embed/")[1]?.split("?")[0] || "";
  }
  return "";
}

function formatDate(dateString?: string): string {
  if (!dateString) return "Reciente";
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "Reciente";
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Reciente";
  }
}

export default function VideoCard({
  item,
  isSelected = false,
  isInteractive = false,
  selectionNumber = null,
  hideDetails = false,
  onClick,
}: VideoCardProps) {
  const itemSrc = item?.src || "";
  const isHttpUrl = itemSrc.startsWith("http://") || itemSrc.startsWith("https://");
  const fullUrl = isHttpUrl ? itemSrc : `${API_URL}${itemSrc}`;
  const isYouTube = isHttpUrl && (itemSrc.includes("youtube.com") || itemSrc.includes("youtu.be"));
  const isTikTok = isHttpUrl && itemSrc.includes("tiktok.com");

  let initialThumbnail = "";
  if (isYouTube) {
    const videoId = extractYouTubeId(itemSrc);
    if (videoId) {
      initialThumbnail = `https://img.youtube.com/vi/${videoId}/hq720.jpg`;
    }
  } else if (isTikTok) {
    initialThumbnail = tiktokThumbnailCache[fullUrl] || "";
  }

  const [tiktokThumb, setTiktokThumb] = useState(initialThumbnail);

  useEffect(() => {
    if (!isTikTok || tiktokThumb || tiktokThumbnailCache[fullUrl]) return;

    const controller = new AbortController();
    fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(fullUrl)}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.thumbnail_url) {
          tiktokThumbnailCache[fullUrl] = data.thumbnail_url;
          setTiktokThumb(data.thumbnail_url);
        }
      })
      .catch(() => {});

    return () => controller.abort();
  }, [isTikTok, fullUrl, tiktokThumb]);

  if (!item || !item.src) {
    return (
      <div className="rounded-xl border border-slate-100 bg-slate-50 aspect-[16/10] w-full flex items-center justify-center text-xs text-slate-400">
        Cargando...
      </div>
    );
  }

  const activeThumb = tiktokThumb || initialThumbnail;
  const titleText = item.alt && item.alt.trim() !== "" ? item.alt : "Video sin título";

  return (
    <div
      onClick={onClick}
      className={`group bg-white rounded-xl transition-all duration-200 flex flex-col cursor-pointer border shadow-xs hover:shadow-md select-none ${
        isSelected
          ? "border-[#16275d] ring-2 ring-[#16275d]/10 bg-amber-50/20"
          : "border-slate-200/80 hover:border-[#16275d]/40"
      } ${hideDetails ? "p-1 gap-0" : "p-2 gap-2.5"}`}
    >
      <div
        className={`relative w-full rounded-lg bg-slate-900 overflow-hidden flex items-center justify-center ${
          hideDetails ? "aspect-[4/3] rounded-lg" : "aspect-[16/10]"
        }`}
      >
        {activeThumb ? (
          <Image
            src={activeThumb}
            alt={titleText}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
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
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Enlace Externo
            </span>
          </div>
        ) : (
          <video
            src={fullUrl}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            preload="metadata"
            muted
          />
        )}

        <div className="absolute inset-0 bg-slate-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

        {isInteractive && isSelected && selectionNumber !== null ? (
          <div className="absolute top-2.5 right-2.5 z-30">
            <div className="w-6 h-6 rounded-full bg-[#16275d] text-amber-400 flex items-center justify-center text-[11px] font-bold shadow-md border border-amber-400/40">
              {selectionNumber}
            </div>
          </div>
        ) : (
          <div className="absolute top-2 left-2 z-20 flex items-center gap-1 bg-slate-900/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            <Star
              className={`w-3 h-3 ${
                item.isFeatured ? "text-amber-400 fill-amber-400" : "text-slate-400"
              }`}
            />
            <span>{item.isFeatured && item.order ? `#${item.order}` : "Libre"}</span>
          </div>
        )}
      </div>

      {!hideDetails && (
        <div className="flex flex-col gap-1 px-1 pb-0.5">
          <h3
            title={titleText}
            className="text-xs font-bold text-[#16275d] tracking-tight truncate group-hover:text-amber-600 transition-colors duration-200"
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