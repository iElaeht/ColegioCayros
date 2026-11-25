"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  itemName?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  itemName = "registros",
}: PaginationProps) {
  const safeTotalItems = Math.max(0, Number(totalItems) || 0);
  const safeItemsPerPage = Math.max(1, Number(itemsPerPage) || 15);
  const safeTotalPages = Math.max(0, Number(totalPages) || 0);
  const rawPage = Math.max(1, Number(currentPage) || 1);
  const safeCurrentPage = safeTotalPages > 0 ? Math.min(rawPage, safeTotalPages) : 1;

  if (safeTotalPages <= 1 && safeTotalItems === 0) return null;

  const startItem = safeTotalItems === 0 ? 0 : (safeCurrentPage - 1) * safeItemsPerPage + 1;
  const endItem = Math.min(safeCurrentPage * safeItemsPerPage, safeTotalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4 border-t border-slate-100 select-none bg-white">
      <p className="text-xs font-medium text-slate-500">
        Mostrando <span className="font-bold text-slate-800">{startItem}</span> a{" "}
        <span className="font-bold text-slate-800">{endItem}</span> de{" "}
        <span className="font-bold text-slate-800">{safeTotalItems}</span> {itemName}
      </p>

      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-slate-400 hidden md:inline">
          Página <strong className="text-slate-800">{safeCurrentPage}</strong> de {safeTotalPages}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              onPageChange(safeCurrentPage - 1);
            }}
            disabled={safeCurrentPage <= 1}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200/90 rounded-xl hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer outline-none"
          >
            <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            Anterior
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              onPageChange(safeCurrentPage + 1);
            }}
            disabled={safeCurrentPage >= safeTotalPages || safeTotalPages === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200/90 rounded-xl hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer outline-none"
          >
            Siguiente
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}