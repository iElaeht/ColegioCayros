// frontend/app/eventos/components/EventosFilters.tsx
"use client";

import React from "react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

export type EventFilterOption = "recientes" | "antiguos" | "az";

interface EventosFiltersProps {
  currentFilter: EventFilterOption;
  onFilterChange: (filter: EventFilterOption) => void;
  onReset: () => void;
  totalResults: number;
}

export default function EventosFilters({
  currentFilter,
  onFilterChange,
  onReset,
  totalResults,
}: EventosFiltersProps) {
  const isFiltered = currentFilter !== "recientes";

  return (
    <div className="bg-white border border-gray-200/80 p-4 sm:p-5 rounded-3xl shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4">
      
      {/* Contador de elementos */}
      <div className="flex items-center gap-2 text-xs sm:text-sm font-['Open_Sans',sans-serif] text-gray-600 font-medium w-full lg:w-auto justify-center lg:justify-start">
        <SlidersHorizontal className="w-4 h-4 text-[#16275d]" />
        <span>Mostrando <strong className="text-[#111c38]">{totalResults}</strong> eventos institucionales</span>
      </div>

      {/* Controles de Orden y Reset */}
      <div className="flex flex-col sm:flex-row items-stretch lg:items-center gap-3 w-full lg:w-auto">
        
        {/* Selector de Orden */}
        <div className="inline-flex flex-col sm:flex-row bg-gray-100 p-1 rounded-2xl text-xs font-semibold gap-1 sm:gap-0">
          <button
            onClick={() => onFilterChange("recientes")}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer text-center ${
              currentFilter === "recientes"
                ? "bg-white text-[#16275d] shadow-xs font-bold"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Más Recientes
          </button>
          
          <button
            onClick={() => onFilterChange("antiguos")}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer text-center ${
              currentFilter === "antiguos"
                ? "bg-white text-[#16275d] shadow-xs font-bold"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Más Antiguos
          </button>

          <button
            onClick={() => onFilterChange("az")}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer text-center ${
              currentFilter === "az"
                ? "bg-white text-[#16275d] shadow-xs font-bold"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Alfabético (A-Z)
          </button>
        </div>

        {/* Botón Limpiar Filtro */}
        <button
          onClick={onReset}
          disabled={!isFiltered}
          className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            isFiltered
              ? "bg-amber-100/70 text-[#16275d] hover:bg-amber-200/80 cursor-pointer shadow-xs"
              : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Limpiar Filtro</span>
        </button>

      </div>
    </div>
  );
}