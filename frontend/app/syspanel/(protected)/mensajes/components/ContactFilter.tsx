"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, ArrowUpDown, X, ChevronDown, Check } from "lucide-react";
import CustomDatePicker from "../../../../components/ui/CustomDatePicker";

interface ContactFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedDate: string;
  setSelectedDate: (value: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
}

export default function ContactFilter({
  searchTerm,
  setSearchTerm,
  selectedDate,
  setSelectedDate,
  sortOrder,
  setSortOrder,
}: ContactFilterProps) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Comprueba si hay filtros activos
  const hasFilters = searchTerm !== "" || selectedDate !== "" || sortOrder !== "recientes";

  // Cerrar el menú desplegable al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedDate("");
    setSortOrder("recientes");
  };

  const sortOptions = [
    { id: "recientes", label: "Más recientes primero" },
    { id: "antiguos", label: "Más antiguos primero" },
    { id: "az", label: "Nombre (A - Z)" },
    { id: "za", label: "Nombre (Z - A)" },
  ];

  const currentSortLabel = sortOptions.find((opt) => opt.id === sortOrder)?.label || "Ordenar por";

  return (
    <div className="bg-white p-4 sm:p-5 border border-slate-200/80 rounded-2xl shadow-sm flex flex-col lg:flex-row items-center justify-between gap-3">
      {/* Buscador Principal */}
      <div className="relative w-full lg:w-96 group">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#6eb5ec] transition-colors">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          placeholder="Buscar por DNI, nombre o teléfono..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50/80 hover:bg-slate-50 border border-slate-200/90 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6eb5ec]/20 focus:border-[#6eb5ec] focus:bg-white transition-all shadow-sm"
        />
      </div>

      {/* Contenedor de Filtros */}
      <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">

        {/* Llamada al componente CustomDatePicker que creamos */}
        <CustomDatePicker
          selectedDate={selectedDate}
          onChange={setSelectedDate}
        />

        {/* Menú Desplegable de Ordenamiento */}
        <div className="relative" ref={sortRef}>
          <button
            type="button"
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-2.5 pl-3.5 pr-3 py-2 bg-slate-50/80 hover:bg-slate-50 border border-slate-200/90 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#6eb5ec]/20 focus:border-[#6eb5ec] transition-all cursor-pointer shadow-sm"
          >
            <ArrowUpDown className="w-4 h-4 text-[#6eb5ec]" />
            <span className="font-medium text-slate-700">{currentSortLabel}</span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`} />
          </button>

          {isSortOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden py-1.5">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSortOrder(option.id);
                    setIsSortOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-xs text-left transition-colors ${
                    sortOrder === option.id
                      ? "bg-[#6eb5ec]/10 text-[#6eb5ec] font-semibold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>{option.label}</span>
                  {sortOrder === option.id && <Check className="w-3.5 h-3.5 text-[#6eb5ec]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Botón de Limpiar */}
        <button
          onClick={handleClearFilters}
          disabled={!hasFilters}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all shadow-sm shrink-0 ${
            hasFilters
              ? "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200/60 cursor-pointer active:scale-95"
              : "bg-slate-100/40 text-slate-300 border border-slate-200/40 cursor-not-allowed opacity-50"
          }`}
          title={hasFilters ? "Limpiar filtros y orden" : "Sin filtros aplicados"}
        >
          <X className={`w-4 h-4 ${hasFilters ? "text-rose-500" : "text-slate-300"}`} />
          <span className="hidden sm:inline">Limpiar</span>
        </button>

      </div>
    </div>
  );
}