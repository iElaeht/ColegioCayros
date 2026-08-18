"use client";

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';

const videoList = [
  { id: 1, title: "Ceremonia de Juramentación", thumbnail: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: 2, title: "Actividades recreativas", thumbnail: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: 3, title: "Presentación de danzas", thumbnail: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: 4, title: "Ceremonia de Juramentación", thumbnail: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: 5, title: "Actividades recreativas", thumbnail: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: 6, title: "Presentación de danzas", thumbnail: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
];

export default function SchoolVideos() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selectedVideo, setSelectedVideo] = useState<{ title: string; videoUrl: string } | null>(null);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  // Bloquea el scroll del body cuando el modal está activo
  useEffect(() => {
    if (selectedVideo) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedVideo]);

  return (
    <section id="Videos" className="w-full bg-white px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
        
        <div className="mb-14 flex items-center gap-3">
          <span aria-hidden="true" className="h-3.5 w-3.5 flex-shrink-0 rounded-[2px] bg-yellow-400" />
          <h2 className="text-2xl font-bold tracking-tight text-[#1B2A4A] sm:text-3xl">
            Videos
          </h2>
        </div>

        <div className="w-full relative group">
          <button onClick={scrollPrev} className="absolute -left-12 top-1/2 -translate-y-1/2 z-20 bg-[#111c38] hover:bg-yellow-400 text-white p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-6">
              {videoList.map((video) => (
                <div className="flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] min-w-0 pl-6" key={video.id}>
                  <div 
                    onClick={() => setSelectedVideo({ title: video.title, videoUrl: video.videoUrl })}
                    className="relative aspect-[16/10] w-full rounded-xl overflow-hidden cursor-pointer group/item shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Image src={video.thumbnail} alt={video.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-[#111c38]/40 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white text-[#111c38] flex items-center justify-center">
                            <Play className="w-6 h-6 fill-current ml-1" />
                        </div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-[#1B2A4A]">{video.title}</p>
                </div>
              ))}
            </div>
          </div>

          <button onClick={scrollNext} className="absolute -right-12 top-1/2 -translate-y-1/2 z-20 bg-[#111c38] hover:bg-yellow-400 text-white p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {selectedVideo && (
        <div onClick={() => setSelectedVideo(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 cursor-pointer">
          <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-4xl bg-[#111c38] rounded-xl overflow-hidden shadow-2xl p-4 pt-3 flex flex-col items-center cursor-default">
            <div className="w-full flex justify-end mb-2">
              <button onClick={() => setSelectedVideo(null)} className="bg-white text-[#111c38] hover:bg-yellow-400 w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md">
                <X className="w-5 h-5 stroke-[3]" />
              </button>
            </div>
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
              <iframe src={`${selectedVideo.videoUrl}?autoplay=1`} className="w-full h-full" allowFullScreen />
            </div>
            <p className="text-center text-white/90 text-sm mt-3 font-medium font-['Open_Sans',sans-serif]">{selectedVideo.title}</p>
          </div>
        </div>
      )}
    </section>
  );
}