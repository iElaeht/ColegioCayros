"use client";

import GalleryHomeCard, { GalleryHomeItem } from "./GalleryHomeCard";

interface GalleryHomeGridProps {
  allImages: GalleryHomeItem[];
  selectedIds: number[];
  onOpenModal: () => void;
}

const HOME_LIMIT = 8;

export default function GalleryHomeGrid({
  allImages,
  selectedIds,
  onOpenModal,
}: GalleryHomeGridProps) {
  const selectedItems = selectedIds
    .map((id) => allImages.find((img) => img.id === id))
    .filter((img): img is GalleryHomeItem => img !== undefined);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2 select-none transform-gpu">
      {selectedItems.map((item, index) => (
        <div
          key={item.id}
          className="relative group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all transform-gpu"
        >
          <div className="aspect-[4/3] w-full overflow-hidden transform-gpu">
            <GalleryHomeCard
              item={item}
              isSelected={false}
              isInteractive={false}
              selectionNumber={null}
              hideDetails={true}
            />
          </div>
          <div className="absolute top-2.5 left-2.5 z-20 w-6 h-6 rounded-xl bg-[#16275d] text-amber-400 text-xs font-bold flex items-center justify-center shadow-md border border-white/20 pointer-events-none">
            {index + 1}
          </div>
        </div>
      ))}

      {Array.from({ length: Math.max(0, HOME_LIMIT - selectedItems.length) }).map((_, index) => (
        <div
          key={`empty-${index}`}
          onClick={onOpenModal}
          className="border-2 border-dashed border-slate-200 hover:border-[#16275d] rounded-2xl aspect-[4/3] flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-[#16275d] bg-slate-50/60 hover:bg-[#16275d]/5 transition-all cursor-pointer group transform-gpu shadow-2xs"
        >
          <span className="text-xl font-bold group-hover:scale-110 transition-transform duration-200 text-slate-400 group-hover:text-[#16275d] transform-gpu">
            +
          </span>
          <span className="text-xs font-semibold tracking-tight">Espacio vacío</span>
        </div>
      ))}
    </div>
  );
}