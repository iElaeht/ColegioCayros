// frontend/app/syspanel/galeria/components/GalleryGrid.tsx
import { ImageIcon, Plus } from "lucide-react";
import GalleryCard from "./GalleryCard";
import GalleryFilters, { SortOption } from "./GalleryFilters";
import GalleryPagination from "./GalleryPagination";

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  isActive: boolean;
  isFeatured?: boolean;
  order?: number;
  featuredOrder?: number;
  createdAt?: string;
}

interface GalleryGridProps {
  images: GalleryItem[];
  onToggleStatus: (id: number) => void;
  onOpenEdit: (item: GalleryItem) => void;
  onDelete: (id: number) => void;
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

export default function GalleryGrid({
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
}: GalleryGridProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-sm space-y-6 w-full select-none transform-gpu">
      
      {/* Barra superior unificada: Filtros + Botón Nueva Imagen */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 w-full">
        <div className="flex-1 w-full min-w-0">
          <GalleryFilters
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            selectedDate={selectedDate}
            onDateChange={onDateChange}
            sortOption={sortOption}
            onSortChange={onSortChange}
          />
        </div>

        {/* Botón de Nueva Imagen */}
        <button
          type="button"
          onClick={onOpenCreate}
          className="w-full xl:w-auto inline-flex items-center justify-center gap-2.5 bg-[#16275d] hover:bg-[#111c38] text-amber-400 text-xs sm:text-sm font-bold px-6 py-3.5 rounded-2xl shadow-md transition-all cursor-pointer shrink-0 group truncate border border-[#16275d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16275d]/20 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 text-amber-400 stroke-[3] shrink-0 transform group-hover:scale-110 transition-transform" />
          <span className="truncate">Nueva Imagen</span>
        </button>
      </div>

      {/* Contenido del Grid o Estado Vacío */}
      {images.length === 0 ? (
        <div className="text-center py-16 sm:py-24 px-4 bg-slate-50/60 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-100/60 text-[#16275d] flex items-center justify-center shrink-0 shadow-xs">
            <ImageIcon className="w-7 h-7 stroke-[2]" />
          </div>
          <div className="space-y-1 max-w-sm">
            <p className="text-[#16275d] text-sm sm:text-base font-bold">
              No hay imágenes en la galería todavía
            </p>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">
              Sube una nueva fotografía institucional usando el botón superior.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 items-start">
          {images.map((item) => (
            <div key={item.id} className="w-full">
              <GalleryCard
                item={item}
                onToggleStatus={onToggleStatus}
                onOpenEdit={onOpenEdit}
              />
            </div>
          ))}
        </div>
      )}

      {/* Componente de Paginación */}
      <div className="w-full pt-4 border-t border-slate-100">
        <GalleryPagination
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