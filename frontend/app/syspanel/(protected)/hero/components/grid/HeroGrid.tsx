"use client";

import { ImageIcon, Plus } from "lucide-react";
import HeroCard, { HeroSlideItem } from "./HeroCard";
import HeroFilters, { SortOption } from "./HeroFilters";
import HeroPagination from "./HeroPagination";

interface HeroGridProps {
  images: HeroSlideItem[];
  onToggleStatus: (id: number) => void;
  onOpenEdit: (item: HeroSlideItem) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  onOpenCreate: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export default function HeroGrid({
  images,
  onToggleStatus,
  onOpenEdit,
  searchQuery,
  onSearchChange,
  selectedDate,
  onDateChange,
  sortOption,
  onSortChange,
  onOpenCreate,
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: HeroGridProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-xs space-y-6 w-full select-none">
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 w-full">
        <div className="flex-1 w-full min-w-0">
          <HeroFilters
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            selectedDate={selectedDate}
            onDateChange={onDateChange}
            sortOption={sortOption}
            onSortChange={onSortChange}
          />
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.currentTarget.blur();
            onOpenCreate();
          }}
          className="w-full xl:w-auto inline-flex items-center justify-center gap-2 bg-[#16275d] hover:bg-[#111c38] text-amber-400 text-xs font-bold px-5 py-3 rounded-xl border border-[#16275d] shadow-sm transition-colors duration-200 cursor-pointer shrink-0 group truncate focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 text-amber-400 stroke-[2.5] shrink-0" />
          <span className="truncate">Nuevo Banner</span>
        </button>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-16 sm:py-20 px-4 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <ImageIcon className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div className="space-y-1">
            <p className="text-slate-800 text-sm font-bold">No hay slides en el Hero todavía</p>
            <p className="text-slate-400 text-xs font-medium">
              Sube un nuevo banner usando el botón superior.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 items-start">
          {images.map((item) => (
            <div key={item.id} className="w-full">
              <HeroCard
                item={item}
                onToggleStatus={onToggleStatus}
                onOpenEdit={onOpenEdit}
              />
            </div>
          ))}
        </div>
      )}

      <div className="w-full pt-2">
        <HeroPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
}