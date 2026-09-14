// frontend/app/syspanel/(protected)/videos/components/home-config/VideoFilterHome.tsx
"use client";

import { Search, X } from "lucide-react";

interface VideoFilterHomeProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeTab: "all" | "selected";
  onTabChange: (tab: "all" | "selected") => void;
  totalVideosCount: number;
  selectedCount: number;
}

export default function VideoFilterHome({
  searchTerm,
  onSearchChange,
  activeTab,
  onTabChange,
  totalVideosCount,
  selectedCount,
}: VideoFilterHomeProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
      <div className="relative w-full sm:max-w-md">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar video por título..."
          className="w-full pl-10 pr-9 py-2 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200/85 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            title="Limpiar búsqueda"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 shrink-0">
        <button
          type="button"
          onClick={() => onTabChange("all")}
          className={`px-3 py-1.5 sm:px-3.5 rounded-lg text-xs font-medium transition-all cursor-pointer text-center truncate ${
            activeTab === "all"
              ? "bg-white text-slate-900 shadow-2xs font-semibold"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Todos ({totalVideosCount})
        </button>

        <button
          type="button"
          onClick={() => onTabChange("selected")}
          className={`px-3 py-1.5 sm:px-3.5 rounded-lg text-xs font-medium transition-all cursor-pointer text-center truncate ${
            activeTab === "selected"
              ? "bg-white text-indigo-600 shadow-2xs font-semibold"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Seleccionados ({selectedCount})
        </button>
      </div>
    </div>
  );
}