"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, ArrowUpDown, Check, ChevronDown } from "lucide-react";
import CustomDatePicker from "../../../../../components/ui/CustomDatePicker";

export type SortOption = "oldest" | "newest" | "az" | "za";

interface EventFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

const SORT_OPTIONS: ReadonlyArray<{ id: SortOption; label: string }> = [
  { id: "oldest", label: "Más antiguos primero" },
  { id: "newest", label: "Más recientes primero" },
  { id: "az", label: "Nombre (A - Z)" },
  { id: "za", label: "Nombre (Z - A)" },
];

const SORT_LABELS: Record<SortOption, string> = {
  oldest: "Antiguos",
  newest: "Recientes",
  az: "A - Z",
  za: "Z - A",
};

export default function EventFilters({
  searchQuery,
  onSearchChange,
  selectedDate,
  onDateChange,
  sortOption,
  onSortChange,
}: EventFiltersProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 w-full select-none">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por título..."
          className="w-full bg-white text-slate-800 text-xs sm:text-sm pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-[#16275d] focus:ring-2 focus:ring-[#16275d]/10 outline-none transition-all font-semibold shadow-xs"
        />
      </div>

      <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
        <div className="w-full sm:w-auto">
          <CustomDatePicker selectedDate={selectedDate} onChange={onDateChange} />
        </div>

        <div className="relative w-full sm:w-auto" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className={`w-full sm:w-auto flex items-center justify-between sm:justify-start gap-3 px-3.5 py-3 border rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs bg-white ${
              isDropdownOpen
                ? "border-[#16275d] text-[#16275d] ring-2 ring-[#16275d]/10"
                : "border-slate-200 hover:bg-slate-50 text-slate-700"
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <ArrowUpDown className="w-4 h-4 text-[#16275d] shrink-0" />
              <span className="truncate">{SORT_LABELS[sortOption]}</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-auto sm:ml-0 ${
                isDropdownOpen ? "rotate-180 text-[#16275d]" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 sm:right-0 left-0 sm:left-auto mt-2 w-full sm:w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-1.5 animate-in fade-in zoom-in-95 duration-150">
              {SORT_OPTIONS.map((option) => {
                const isSelected = sortOption === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      onSortChange(option.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                      isSelected
                        ? "text-[#16275d] bg-amber-100/60 font-bold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#16275d] shrink-0 ml-2" />}
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