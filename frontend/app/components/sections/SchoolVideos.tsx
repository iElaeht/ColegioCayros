"use client";

import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Play, X, ExternalLink } from "lucide-react";

// Lista con los videos restantes
const videoList = [
  "FBkVZYphD9A",
  "QusCmzU7PRA",
  "OZ9rEkyb47I",
  "cS9HV5MAhA4",
  "CnY3kYtgfnQ",
  "eAtwz9gUKWc",
  "fJlHGsfwS8o",
  "4NN8Q6_hCyI",
  "vRj48gQiU0U"
].map((id, index) => ({
  id: index + 1,
  videoId: id,
  thumbnail: `https://img.youtube.com/vi/${id}/hq720.jpg`,
  fallbackThumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
  videoUrl: `https://www.youtube.com/embed/${id}`
}));

export default function SchoolVideos() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });
  const [selectedVideo, setSelectedVideo] = useState<{ videoUrl: string } | null>(null);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

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
    <section id="Videos" className="w-full bg-white px-6 py-24 sm:px-10 lg:px-16 text-[#1B2A4A] select-none">
      <div className="mx-auto max-w-5xl">
        
        <div className="mb-16 flex flex-col items-start">
          <div className="flex items-center gap-3 mb-3">
            <span aria-hidden="true" className="h-3.5 w-3.5 flex-shrink-0 rounded-[2px] bg-yellow-400" />
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Videos</h2>
          </div>
          <p className="text-slate-600 text-[15px] font-normal leading-relaxed text-justify max-w-[500px]">
            Explora nuestros momentos educativos a través de nuestra videoteca, mostrando nuestras actividades y el día a día en el colegio.
          </p>
        </div>

        <div className="w-full relative group">
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="absolute -left-12 top-1/2 -translate-y-1/2 z-20 bg-[#1B2A4A] hover:bg-yellow-400 text-white p-2.5 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-default"
          >
            <ChevronLeft className="w-5 h-5 stroke-[3]" />
          </button>

          <div className="overflow-hidden cursor-grab" ref={emblaRef}>
            <div className="flex -ml-6">
              {videoList.map((video) => (
                <div className="flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] min-w-0 pl-6" key={video.id}>
                  <div 
                    onClick={() => setSelectedVideo({ videoUrl: video.videoUrl })}
                    className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-100 cursor-pointer group/item shadow-sm hover:shadow-lg transition-all"
                  >
                    <img src={video.thumbnail} alt="Video" className="absolute inset-0 w-full h-full object-cover" onError={(e) => (e.target as HTMLImageElement).src = video.fallbackThumbnail} />
                    <div className="absolute inset-0 bg-[#1B2A4A]/40 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Play className="w-12 h-12 text-white fill-current drop-shadow-md" />
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] min-w-0 pl-6">
                <a
                  href="https://www.youtube.com/@ColegioCayrosOficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/card relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-[#16275d] border-2 border-dashed border-[#16275d]/20 hover:border-yellow-400 p-6 flex flex-col items-center justify-center text-center transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-white/10 group-hover/card:bg-yellow-400 flex items-center justify-center text-white group-hover/card:text-[#16275d] transition-all duration-300 mb-3">
                    <ExternalLink className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">Más videos</h3>
                  <p className="text-xs text-white/70 max-w-[200px]">Visita nuestro canal oficial de YouTube.</p>
                </a>
              </div>
            </div>
          </div>

          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="absolute -right-12 top-1/2 -translate-y-1/2 z-20 bg-[#1B2A4A] hover:bg-yellow-400 text-white p-2.5 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-default"
          >
            <ChevronRight className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
      </div>

      {selectedVideo && (
        <div onClick={() => setSelectedVideo(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 cursor-pointer">
          <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-5xl cursor-default">
            <button 
                onClick={() => setSelectedVideo(null)} 
                className="absolute -top-12 right-0 text-white hover:text-yellow-400 transition-colors"
            >
              <X className="w-8 h-8 stroke-[2]" />
            </button>
            <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-black">
              <iframe 
                src={`${selectedVideo.videoUrl}?autoplay=1&rel=0&modestbranding=1`} 
                className="w-full h-full" 
                allow="autoplay; encrypted-media" 
                allowFullScreen 
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}