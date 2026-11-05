// frontend/app/syspanel/(protected)/eventos/components/grid/EventPagination.tsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface EventPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export default function EventPagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: EventPaginationProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const safeTotalPages = totalPages || 1;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-2 w-full select-none">
      
      {/* Total general y rango actual */}
      <div className="text-xs sm:text-sm text-slate-500 font-medium text-center sm:text-left">
        Mostrando <span className="font-bold text-[#16275d]">{startItem}-{endItem}</span> de <span className="font-bold text-[#16275d]">{totalItems}</span> elementos
      </div>

      {/* Controles de paginación limpios y responsivos */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
          title="Página anterior"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">Anterior</span>
        </button>

        <div className="px-4 py-2.5 bg-[#16275d]/5 border border-[#16275d]/20 rounded-2xl shadow-xs text-xs font-extrabold text-[#16275d] tracking-wide">
          <span>{currentPage}</span> <span className="text-slate-400 font-normal">/</span> <span>{safeTotalPages}</span>
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= safeTotalPages}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
          title="Página siguiente"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

    </div>
  );
}