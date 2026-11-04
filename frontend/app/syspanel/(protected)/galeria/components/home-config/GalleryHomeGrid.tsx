// frontend/app/syspanel/(protected)/galeria/components/home-config/GalleryHomeGrid.tsx
"use client";

import GalleryHomeCard from "./GalleryHomeCard";

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  isActive: boolean;
  isFeatured?: boolean;
  createdAt?: string;
}

interface GalleryHomeGridProps {
  allImages: GalleryItem[];
  selectedIds: number[];
  onOpenModal: () => void;
}

export default function GalleryHomeGrid({
  allImages,
  selectedIds,
  onOpenModal,
}: GalleryHomeGridProps) {
  const HOME_LIMIT = 8;

  const selectedItems = selectedIds
    .map((id) => allImages.find((img) => img.id === id))
    .filter((img): img is GalleryItem => img !== undefined);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2 transform-gpu">
      {selectedItems.map((item) => (
        <div
          key={item.id}
          className="relative group bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs transform-gpu"
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
        </div>
      ))}

      {Array.from({
        length: Math.max(0, HOME_LIMIT - selectedItems.length),
      }).map((_, index) => (
        <div
          key={`empty-${index}`}
          onClick={onOpenModal}
          className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl aspect-[4/3] flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-indigo-600 bg-slate-50/50 hover:bg-indigo-50/30 transition-colors duration-200 cursor-pointer group transform-gpu"
        >
          <span className="text-lg font-light group-hover:scale-110 transition-transform duration-200 transform-gpu">
            +
          </span>
          <span className="text-[10px] font-medium tracking-tight">Vacío</span>
        </div>
      ))}
    </div>
  );
}