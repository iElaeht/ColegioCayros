// frontend/components/Pagination.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  itemName?: string; // Prop opcional para cambiar "mensajes" por "solicitudes", etc.
}

export default function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  itemName = "registros",
}: PaginationProps) {
  // Aseguramos que los valores sean números válidos para evitar NaN
  const safeTotalItems = Number(totalItems) || 0;
  const safeCurrentPage = Number(currentPage) || 1;
  const safeItemsPerPage = Number(itemsPerPage) || 15;
  const safeTotalPages = Number(totalPages) || 0;

  if (safeTotalPages <= 1 && safeTotalItems === 0) return null;

  // Calculamos el rango actual de forma segura
  const startItem = safeTotalItems === 0 ? 0 : (safeCurrentPage - 1) * safeItemsPerPage + 1;
  const endItem = Math.min(safeCurrentPage * safeItemsPerPage, safeTotalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4 border-t border-slate-100 select-none bg-white">
      {/* Indicador de detalle de registros seguro */}
      <p className="text-xs font-medium text-slate-500">
        Mostrando <span className="font-bold text-slate-800">{startItem}</span> a{" "}
        <span className="font-bold text-slate-800">{endItem}</span> de{" "}
        <span className="font-bold text-slate-800">{safeTotalItems}</span> {itemName}
      </p>

      {/* Controles de Paginación */}
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
            disabled={safeCurrentPage === 1}
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
            disabled={safeCurrentPage === safeTotalPages || safeTotalPages === 0}
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