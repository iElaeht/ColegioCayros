// frontend/app/syspanel/(protected)/videos/components/home-config/VideoHomeGrid.tsx
"use client";

import VideoCard from "./VideoCard";

interface VideoItem {
  id: number;
  src: string;
  alt: string;
  isActive: boolean;
  isFeatured?: boolean;
  createdAt?: string;
}

interface VideoHomeGridProps {
  allVideos: VideoItem[];
  selectedIds: number[];
  onOpenModal: () => void;
}

export default function VideoHomeGrid({
  allVideos,
  selectedIds,
  onOpenModal,
}: VideoHomeGridProps) {
  const HOME_LIMIT = 8;

  const selectedItems = selectedIds
    .map((id) => allVideos.find((vid) => vid.id === id))
    .filter((vid): vid is VideoItem => vid !== undefined);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
      {selectedItems.map((item, index) => (
        <div
          key={item.id}
          className="relative group bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs"
        >
          <div className="aspect-[4/3] w-full overflow-hidden">
            <VideoCard
              item={item}
              isSelected={false}
              isInteractive={false}
              hideDetails={true}
            />
          </div>
          <div className="absolute top-2 left-2 z-10 w-5 h-5 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold flex items-center justify-center shadow-sm pointer-events-none">
            {index + 1}
          </div>
        </div>
      ))}

      {Array.from({
        length: Math.max(0, HOME_LIMIT - selectedItems.length),
      }).map((_, index) => (
        <div
          key={`empty-${index}`}
          onClick={onOpenModal}
          className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl aspect-[4/3] flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-indigo-600 bg-slate-50/50 hover:bg-indigo-50/30 transition-all cursor-pointer group"
        >
          <span className="text-lg font-light group-hover:scale-110 transition-transform">
            +
          </span>
          <span className="text-[10px] font-medium tracking-tight">Vacío</span>
        </div>
      ))}
    </div>
  );
}