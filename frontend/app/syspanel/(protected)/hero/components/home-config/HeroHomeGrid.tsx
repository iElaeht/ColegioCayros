// frontend/app/syspanel/(protected)/hero/components/home-config/HeroHomeGrid.tsx
"use client";

import HeroHomeCard from "./HeroHomeCard";
import { HeroSlideItem } from "./HeroHomeConfig";

interface HeroHomeGridProps {
  allImages: HeroSlideItem[];
  selectedIds: number[];
  onOpenModal: () => void;
}

export default function HeroHomeGrid({
  allImages,
  selectedIds,
  onOpenModal,
}: HeroHomeGridProps) {
  const HOME_LIMIT = 8;

  const selectedItems = selectedIds
    .map((id) => allImages.find((img) => img.id === id))
    .filter((img): img is HeroSlideItem => img !== undefined);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2 select-none">
      {selectedItems.map((item) => (
        <div
          key={item.id}
          className="relative group bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs"
        >
          <div className="aspect-[4/3] w-full overflow-hidden">
            <HeroHomeCard
              item={item}
              isSelected={false}
              isInteractive={false}
              selectionNumber={null}
              hideDetails={true}
            />
          </div>
        </div>
      ))}

      {Array.from({
        length: Math.max(0, HOME_LIMIT - selectedItems.length),
      }).map((_, index) => (
        <div
          key={`empty-${index}`}
          onClick={(e) => {
            e.currentTarget.blur();
            onOpenModal();
          }}
          className="border-2 border-dashed border-slate-200 hover:border-[#16275d] rounded-xl aspect-[4/3] flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-[#16275d] bg-slate-50/50 hover:bg-[#16275d]/5 transition-colors duration-200 cursor-pointer group"
        >
          <span className="text-lg font-light group-hover:scale-110 transition-transform duration-200">
            +
          </span>
          <span className="text-[10px] font-bold tracking-tight">Vacío</span>
        </div>
      ))}
    </div>
  );
}