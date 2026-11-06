// frontend/app/syspanel/hero/components/Grid/HeroFilters.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Search, ArrowUpDown, Check, ChevronDown } from "lucide-react";
import CustomDatePicker from "../../../../../components/ui/CustomDatePicker";

export type SortOption = "oldest" | "newest" | "az" | "za";

interface HeroFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

export default function HeroFilters({
  searchQuery,
  onSearchChange,
  selectedDate,
  onDateChange,
  sortOption,
  onSortChange,
}: HeroFiltersProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cierre seguro encapsulado
  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  // Manejo de clics fuera y tecla ESC limpia
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDropdownOpen) {
        e.preventDefault();
        e.stopPropagation();
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown, { capture: true });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, [isDropdownOpen, closeDropdown]);

  const sortLabels: Record<SortOption, string> = {
    oldest: "Antiguos",
    newest: "Recientes",
    az: "A - Z",
    za: "Z - A",
  };

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 w-full select-none">
      {/* Buscador por título */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 shrink-0 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por título..."
          className="w-full bg-white text-slate-800 text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-200/90 focus:border-[#16275d] focus:ring-2 focus:ring-[#16275d]/10 outline-none transition-all font-medium shadow-xs"
        />
      </div>

      {/* Contenedor para Fecha y Orden */}
      <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
        <div className="w-full sm:w-auto">
          <CustomDatePicker
            selectedDate={selectedDate}
            onChange={onDateChange}
          />
        </div>

        {/* Menú Desplegable de Ordenamiento */}
        <div className="relative w-full sm:w-auto" ref={dropdownRef}>
          <button
            type="button"
            onClick={(e) => {
              if (isDropdownOpen) {
                e.currentTarget.blur();
                closeDropdown();
              } else {
                setIsDropdownOpen(true);
              }
            }}
            className={`w-full sm:w-auto flex items-center justify-between sm:justify-start gap-3 px-3.5 py-3 border rounded-xl text-xs font-semibold transition-colors duration-200 cursor-pointer shadow-xs bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16275d]/20 active:scale-[0.98] ${
              isDropdownOpen
                ? "border-[#16275d] text-[#16275d] ring-2 ring-[#16275d]/10"
                : "border-slate-200/90 hover:bg-slate-50 text-slate-700"
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#16275d] shrink-0" />
              <span className="truncate">{sortLabels[sortOption]}</span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ml-auto sm:ml-0 ${
                isDropdownOpen ? "rotate-180 text-[#16275d]" : ""
              }`}
            />
          </button>

          {/* Ventana Flotante con z-index extremadamente alto */}
          {isDropdownOpen && (
            <div className="absolute right-0 sm:right-0 mt-2 w-full sm:w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[99999] p-1.5 animate-in fade-in zoom-in-95 duration-150">
              {(
                [
                  { id: "oldest", label: "Más antiguos primero" },
                  { id: "newest", label: "Más recientes primero" },
                  { id: "az", label: "Nombre (A - Z)" },
                  { id: "za", label: "Nombre (Z - A)" },
                ] as const
              ).map((option) => {
                const isSelected = sortOption === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      onSortChange(option.id);
                      closeDropdown();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? "text-[#16275d] bg-[#16275d]/10 font-bold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#16275d] shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}