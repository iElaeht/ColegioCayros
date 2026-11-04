// frontend/components/Pagination.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
}: PaginationProps) {
  const safeTotalItems = Number(totalItems) || 0;
  const safeCurrentPage = Number(currentPage) || 1;
  const safeItemsPerPage = Number(itemsPerPage) || 10;
  const safeTotalPages = Number(totalPages) || 0;

  if (safeTotalPages <= 1 && safeTotalItems === 0) return null;

  const startItem = safeTotalItems === 0 ? 0 : (safeCurrentPage - 1) * safeItemsPerPage + 1;
  const endItem = Math.min(safeCurrentPage * safeItemsPerPage, safeTotalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4 border-t border-slate-100">
      <p className="text-sm text-slate-500">
        Mostrando <span className="font-semibold text-slate-700">{startItem}</span> a{" "}
        <span className="font-semibold text-slate-700">{endItem}</span> de{" "}
        <span className="font-semibold text-slate-700">{safeTotalItems}</span> solicitudes
      </p>

      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-400 hidden md:inline">
          Página <strong className="text-slate-700">{safeCurrentPage}</strong> de {safeTotalPages}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(safeCurrentPage - 1)}
            disabled={safeCurrentPage === 1}
            className="flex items-center gap-1 px-3.5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>

          <button
            onClick={() => onPageChange(safeCurrentPage + 1)}
            disabled={safeCurrentPage === safeTotalPages || safeTotalPages === 0}
            className="flex items-center gap-1 px-3.5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
          >
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}