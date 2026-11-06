// frontend/app/syspanel/hero/components/home-config/HeroFilterHome.tsx
"use client";

import { Search, X } from "lucide-react";

interface HeroFilterHomeProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeTab: "all" | "selected";
  onTabChange: (tab: "all" | "selected") => void;
  totalImagesCount: number;
  selectedCount: number;
}

export default function HeroFilterHome({
  searchTerm,
  onSearchChange,
  activeTab,
  onTabChange,
  totalImagesCount,
  selectedCount,
}: HeroFilterHomeProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full select-none">
      {/* Buscador y botón limpiar */}
      <div className="relative w-full sm:max-w-md">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar banner por título..."
          className="w-full pl-10 pr-9 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200/85 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#16275d] focus:ring-2 focus:ring-[#16275d]/10 transition-all duration-200 shadow-2xs font-semibold"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-[#16275d] transition-colors duration-200 cursor-pointer"
            title="Limpiar búsqueda"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Pestañas de filtrado (Todos / Destacados) */}
      <div className="grid grid-cols-2 sm:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/60 shrink-0">
        <button
          type="button"
          onClick={() => onTabChange("all")}
          className={`px-3 py-1.5 sm:px-3.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer text-center truncate ${
            activeTab === "all"
              ? "bg-[#16275d] text-white shadow-2xs"
              : "text-slate-600 hover:text-[#16275d]"
          }`}
        >
          Todos ({totalImagesCount})
        </button>

        <button
          type="button"
          onClick={() => onTabChange("selected")}
          className={`px-3 py-1.5 sm:px-3.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer text-center truncate ${
            activeTab === "selected"
              ? "bg-[#16275d] text-amber-400 shadow-2xs"
              : "text-slate-600 hover:text-[#16275d]"
          }`}
        >
          Destacados ({selectedCount})
        </button>
      </div>
    </div>
  );
}