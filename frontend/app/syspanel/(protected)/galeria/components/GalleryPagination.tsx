// frontend/app/syspanel/galeria/components/GalleryPagination.tsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export default function GalleryPagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: GalleryPaginationProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const safeTotalPages = totalPages || 1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 pt-6 border-t border-slate-200/80 mt-6">
      
      {/* Izquierda: Total general de imágenes */}
      <div className="text-xs text-slate-500 font-medium text-center md:text-left">
        Total: <span className="font-bold text-slate-800">{totalItems}</span> {totalItems === 1 ? "imagen" : "imágenes"}
      </div>

      {/* Centro: Botones de navegación y contador de página */}
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
        >
          <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Anterior</span>
        </button>

        <div className="px-3.5 py-2 bg-slate-50/80 border border-slate-200/60 rounded-xl shadow-2xs text-xs font-bold text-slate-700 tracking-wide">
          Página <span className="text-slate-900">{currentPage}</span> de <span className="text-slate-900">{safeTotalPages}</span>
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= safeTotalPages}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
        >
          <span>Siguiente</span>
          <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>

      {/* Derecha: Rango de visualización actual (Mostrando X a Y) */}
      <div className="text-xs text-slate-500 font-medium text-center md:text-right">
        Mostrando <span className="font-bold text-slate-800">{startItem}</span> - <span className="font-bold text-slate-800">{endItem}</span>
      </div>

    </div>
  );
}