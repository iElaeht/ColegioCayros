"use client";

import { Video as VideoIcon, Plus } from "lucide-react";
import VideoCard from "./VideoCard";
import VideoFilters, { SortOption } from "./VideoFilters";
import VideoPagination from "./VideoPagination";

interface VideoItem {
  id: number;
  src: string;
  alt: string;
  isActive: boolean;
  createdAt?: string;
}

interface VideoGridProps {
  videos: VideoItem[];
  onToggleStatus: (id: number) => void;
  onOpenEdit: (item: VideoItem) => void;
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

export default function VideoGrid({
  videos,
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
}: VideoGridProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-xs space-y-6 w-full select-none">
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 w-full">
        <div className="flex-1 w-full min-w-0">
          <VideoFilters
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
          <span className="truncate">Nuevo Video</span>
        </button>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-16 sm:py-20 px-4 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <VideoIcon className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div className="space-y-1">
            <p className="text-slate-800 text-sm font-bold">No hay videos registrados todavía</p>
            <p className="text-slate-400 text-xs font-medium">
              Sube un archivo de video o añade un enlace usando el botón superior.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 items-start">
          {videos.map((item) => (
            <div key={item.id} className="w-full">
              <VideoCard item={item} onToggleStatus={onToggleStatus} onOpenEdit={onOpenEdit} />
            </div>
          ))}
        </div>
      )}

      <div className="w-full pt-2">
        <VideoPagination
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