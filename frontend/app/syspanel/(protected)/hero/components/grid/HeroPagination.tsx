// frontend/app/syspanel/hero/components/Grid/HeroPagination.tsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export default function HeroPagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: HeroPaginationProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const safeTotalPages = totalPages || 1;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200/80 mt-6 w-full select-none">
      
      {/* Total general y rango actual compactos */}
      <div className="text-xs text-slate-500 font-medium text-center sm:text-left">
        Mostrando <span className="font-bold text-[#16275d]">{startItem}-{endItem}</span> de <span className="font-bold text-[#16275d]">{totalItems}</span>
      </div>

      {/* Controles de paginación limpios y responsivos */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16275d]/20"
          title="Página anterior"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">Anterior</span>
        </button>

        <div className="px-3.5 py-2 bg-slate-50/80 border border-slate-200/60 rounded-xl shadow-2xs text-xs font-bold text-slate-700 tracking-wide">
          <span className="text-[#16275d]">{currentPage}</span> / <span className="text-slate-900">{safeTotalPages}</span>
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= safeTotalPages}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16275d]/20"
          title="Página siguiente"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

    </div>
  );
}