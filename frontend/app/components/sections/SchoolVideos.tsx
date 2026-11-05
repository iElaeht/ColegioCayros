// frontend/components/SchoolVideos.tsx
"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, X, ExternalLink, Video as VideoIcon, Music2 } from "lucide-react";

interface VideoItem {
  id: number;
  src: string;
  alt: string;
  isActive: boolean;
  isFeatured?: boolean;
  createdAt?: string;
}

const tiktokThumbnailCache: Record<string, string> = {};

function VideoCard({ video, onSelectVideo }: { video: VideoItem; onSelectVideo: (data: { src: string; isEmbed: boolean; isTikTok: boolean }) => void }) {
  const isHttp = video.src.startsWith("http");
  const fullUrl = isHttp ? video.src : `http://localhost:4000${video.src}`;
  const isTikTok = video.src.includes("tiktok.com");

  let initialThumbnail = "";
  let embedUrl = fullUrl;
  let isEmbed = true;

  if (isTikTok) {
    initialThumbnail = tiktokThumbnailCache[fullUrl] || "";
  } else if (video.src.includes("youtube.com") || video.src.includes("youtu.be")) {
    let videoId = "";
    if (video.src.includes("youtu.be/")) {
      videoId = video.src.split("youtu.be/")[1]?.split("?")[0];
    } else if (video.src.includes("watch?v=")) {
      videoId = video.src.split("watch?v=")[1]?.split("&")[0];
    } else if (video.src.includes("embed/")) {
      videoId = video.src.split("embed/")[1]?.split("?")[0];
    }

    if (videoId) {
      initialThumbnail = `https://img.youtube.com/vi/${videoId}/hq720.jpg`;
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
  } else if (!isHttp && video.src.match(/\.(mp4|webm|ogg|mov)$/i)) {
    isEmbed = false;
  }

  const [tiktokThumb, setTiktokThumb] = useState(initialThumbnail);

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

  return (
    <div className="flex-[0_0_85%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-4 sm:pl-6">
      <div 
        onClick={() => onSelectVideo({ src: embedUrl, isEmbed, isTikTok })}
        className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-900 cursor-pointer group/item shadow-md hover:shadow-xl transition-all flex items-center justify-center border border-slate-100"
      >
        {activeThumb ? (
          <Image 
            src={activeThumb} 
            alt={video.alt || "Video institucional"} 
            fill
            unoptimized
            className="object-cover transition-transform duration-700 group-hover/item:scale-105" 
          />
        ) : isTikTok ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white p-4 text-center">
            <Music2 className="w-10 h-10 text-pink-500 mb-1.5 shrink-0 animate-pulse" />
            <span className="text-xs font-bold text-white line-clamp-2">{video.alt || "TikTok Video"}</span>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-300 p-4 text-center">
            <VideoIcon className="w-10 h-10 text-yellow-400 mb-1.5 shrink-0" />
            <span className="text-xs font-semibold text-slate-200 line-clamp-2">{video.alt || "Enlace Externo"}</span>
          </div>
        )}

        <div className="absolute inset-0 bg-[#1B2A4A]/40 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Play className="w-12 h-12 text-white fill-current drop-shadow-md transform transition-transform group-hover/item:scale-110" />
        </div>
      </div>
      <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-3 truncate px-1">{video.alt}</p>
    </div>
  );
}

function TikTokPlayer({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    const blockquote = document.createElement("blockquote");
    blockquote.className = "tiktok-embed";
    blockquote.setAttribute("cite", url);
    blockquote.setAttribute("data-video-id", url.split("/video/")[1]?.split("?")[0] || "");
    blockquote.style.width = "100%";
    blockquote.style.maxWidth = "325px";
    blockquote.style.minWidth = "250px";
    blockquote.style.height = "100%";
    blockquote.style.margin = "0 auto";

    const section = document.createElement("section");
    const a = document.createElement("a");
    a.target = "_blank";
    a.href = url;
    section.appendChild(a);
    blockquote.appendChild(section);

    if (containerRef.current && isMounted) {
      containerRef.current.appendChild(blockquote);
    }

    const script = document.createElement("script");
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      isMounted = false;
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [url]);

  return (
    <div className="relative w-full max-w-[325px] h-[75vh] max-h-[600px] min-h-[450px] overflow-y-auto overflow-x-hidden rounded-2xl flex justify-center bg-transparent">
      <div ref={containerRef} className="w-full h-full flex justify-center" />
    </div>
  );
}

export default function SchoolVideos() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start', dragFree: true });
  const [selectedVideo, setSelectedVideo] = useState<{ src: string; isEmbed: boolean; isTikTok: boolean } | null>(null);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchPublicVideos = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/videos?soloActivas=true&soloDestacadas=true");
        if (!res.ok) throw new Error("Error al obtener los videos públicos");
        const data = await res.json();
        
        if (isMounted && Array.isArray(data)) {
          setVideos(data);
        }
      } catch (error) {
        console.error("Error al cargar los videos para la web:", error);
      }
    };

    fetchPublicVideos();
    return () => {
      isMounted = false;
    };
  }, []);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    queueMicrotask(onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    document.body.style.overflow = selectedVideo ? "hidden" : "unset";
  }, [selectedVideo]);

  return (
    <section id="Videos" className="w-full bg-white px-4 sm:px-8 py-16 sm:py-24 lg:py-32 text-[#1B2A4A] select-none overflow-hidden">
      <div className="mx-auto max-w-6xl">
        
        {/* Cabecera optimizada y responsiva */}
        <div className="mb-10 sm:mb-16 flex flex-col items-start max-w-2xl">
          <div className="flex items-center gap-3 mb-3">
            <span aria-hidden="true" className="h-3.5 w-3.5 flex-shrink-0 rounded-[2px] bg-yellow-400" />
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">Videos</h2>
          </div>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed text-left">
            Explora nuestros momentos educativos a través de nuestra videoteca, mostrando nuestras actividades y el día a día en el colegio.
          </p>
        </div>

        {videos.length === 0 ? (
          <div className="w-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-10 sm:p-14 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-[#1B2A4A] flex items-center justify-center text-white mb-4 shadow-sm">
              <VideoIcon className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#1B2A4A] mb-1">Sección de Videos</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Próximamente contenido disponible.
            </p>
          </div>
        ) : (
          <div className="w-full relative group">
            {/* Botón Izquierdo (Oculto en móvil, visible en sm+) */}
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="hidden sm:flex absolute -left-5 lg:-left-6 top-[38%] -translate-y-1/2 z-20 bg-[#1B2A4A] hover:bg-yellow-400 text-white p-3 rounded-full shadow-xl transition-all duration-300 items-center justify-center opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-default"
            >
              <ChevronLeft className="w-5 h-5 stroke-[3]" />
            </button>

            {/* Carrusel Embla */}
            <div className="overflow-hidden cursor-grab active:cursor-grabbing px-1 py-2" ref={emblaRef}>
              <div className="flex -ml-4 sm:-ml-6">
                {videos.map((video) => (
                  <VideoCard key={video.id} video={video} onSelectVideo={setSelectedVideo} />
                ))}

                {/* Tarjeta final: Canal oficial */}
                <div className="flex-[0_0_85%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-4 sm:pl-6">
                  <a
                    href="https://www.youtube.com/@ColegioCayrosOficial"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/card relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#16275d] border-2 border-dashed border-[#16275d]/20 hover:border-yellow-400 p-6 flex flex-col items-center justify-center text-center transition-all duration-300 shadow-md hover:shadow-2xl"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/10 group-hover/card:bg-yellow-400 flex items-center justify-center text-white group-hover/card:text-[#16275d] transition-all duration-300 mb-3 shadow-inner">
                      <ExternalLink className="w-6 h-6 transition-transform duration-300 group-hover/card:scale-110" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-1">Más videos</h3>
                    <p className="text-xs text-white/70 max-w-[200px]">Visita nuestro canal oficial de YouTube.</p>
                  </a>
                  <p className="text-xs sm:text-sm font-semibold opacity-0 select-none mt-3">Canal Oficial</p>
                </div>
              </div>
            </div>

            {/* Botón Derecho (Oculto en móvil, visible en sm+) */}
            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="hidden sm:flex absolute -right-5 lg:-right-6 top-[38%] -translate-y-1/2 z-20 bg-[#1B2A4A] hover:bg-yellow-400 text-white p-3 rounded-full shadow-xl transition-all duration-300 items-center justify-center opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-default"
            >
              <ChevronRight className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        )}
      </div>

      {/* Modal de Reproducción */}
      {selectedVideo && (
        <div onClick={() => setSelectedVideo(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-4 cursor-pointer overflow-y-auto animate-fadeIn">
          <div onClick={(e) => e.stopPropagation()} className="relative cursor-default flex items-center justify-center w-full max-w-4xl my-auto">
            <button 
                onClick={() => setSelectedVideo(null)} 
                className="absolute -top-10 sm:-top-12 right-0 z-50 text-white/70 hover:text-white transition-colors cursor-pointer p-1"
            >
              <X className="w-7 h-7 stroke-[2.5]" />
            </button>

            {selectedVideo.isTikTok ? (
              <TikTokPlayer url={selectedVideo.src} />
            ) : (
              <div className="w-full aspect-video max-h-[80vh] rounded-2xl overflow-hidden shadow-2xl bg-black flex items-center justify-center border border-white/20">
                {selectedVideo.isEmbed ? (
                  <iframe 
                    src={`${selectedVideo.src}${selectedVideo.src.includes('?') ? '&' : '?'}autoplay=1&rel=0&modestbranding=1`} 
                    className="w-full h-full border-0" 
                    allow="autoplay; encrypted-media; picture-in-picture" 
                    allowFullScreen 
                  />
                ) : (
                  <video 
                    src={selectedVideo.src} 
                    className="w-full h-full object-contain" 
                    controls 
                    autoPlay 
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}