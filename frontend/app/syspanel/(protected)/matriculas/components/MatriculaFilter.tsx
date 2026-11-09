// frontend/app/syspanel/matriculas/components/MatriculaFilter.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Search, ArrowUpDown, X, ChevronDown, Check, ArrowLeftRight } from "lucide-react";
import CustomDatePicker from "../../../../components/ui/CustomDatePicker";
import ExportImportModal from "../../components/ExportImport";

interface MatriculaFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedDate: string;
  setSelectedDate: (value: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
  exportData: Record<string, unknown>[]; // Tipado estricto sin any
  onImportData?: (importedJson: Record<string, unknown>[]) => Promise<void> | void;
}

export default function MatriculaFilter({
  searchTerm,
  setSearchTerm,
  selectedDate,
  setSelectedDate,
  sortOrder,
  setSortOrder,
  exportData,
  onImportData,
}: MatriculaFilterProps) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const hasFilters = searchTerm !== "" || selectedDate !== "" || sortOrder !== "recientes";

  const closeDropdown = useCallback(() => {
    setIsSortOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSortOpen) {
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
  }, [isSortOpen, closeDropdown]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedDate("");
    setSortOrder("recientes");
  };

  const sortOptions = [
    { id: "recientes", label: "Más recientes primero" },
    { id: "antiguos", label: "Más antiguos primero" },
    { id: "az", label: "Estudiante (A - Z)" },
    { id: "za", label: "Estudiante (Z - A)" },
  ];

  const currentSortLabel = sortOptions.find((opt) => opt.id === sortOrder)?.label || "Ordenar por";

  return (
    <>
      {/* Contenedor adaptativo: columna en móvil, fila horizontal perfecta en desktop (lg+) */}
      <div className="bg-white p-4 sm:p-5 border border-slate-200/85 rounded-3xl shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 select-none w-full">
        
        {/* Buscador Principal */}
        <div className="relative w-full lg:w-80 group">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#16275d] transition-colors">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Buscar por alumno, DNI, apoderado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-3 lg:py-2.5 bg-slate-50/80 hover:bg-slate-50 border border-slate-200/90 rounded-2xl lg:rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16275d]/10 focus:border-[#16275d] focus:bg-white transition-all shadow-xs"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              title="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Contenedor de Filtros Secundarios y Botones */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 lg:gap-2.5 w-full lg:w-auto">

          {/* Selector de Fecha */}
          <div className="w-full lg:w-auto">
            <CustomDatePicker
              selectedDate={selectedDate}
              onChange={setSelectedDate}
            />
          </div>

          {/* Menú Desplegable de Ordenamiento */}
          <div className="relative w-full lg:w-auto" ref={sortRef}>
            <button
              type="button"
              onClick={(e) => {
                if (isSortOpen) {
                  e.currentTarget.blur();
                  closeDropdown();
                } else {
                  setIsSortOpen(true);
                }
              }}
              className={`w-full lg:w-auto flex items-center justify-between gap-2.5 px-3.5 py-3 lg:py-2.5 border rounded-2xl lg:rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs bg-slate-50/80 hover:bg-slate-50 outline-none ${
                isSortOpen
                  ? "border-[#16275d] text-[#16275d] ring-2 ring-[#16275d]/10 bg-white"
                  : "border-slate-200/90 text-slate-700"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#16275d] shrink-0" />
                <span className="truncate">{currentSortLabel}</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${isSortOpen ? "rotate-180 text-[#16275d]" : ""}`} />
            </button>

            {isSortOpen && (
              <div className="absolute left-0 lg:right-0 lg:left-auto mt-2 w-full lg:w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-[99999] overflow-hidden p-1.5 animate-in fade-in zoom-in-95 duration-150">
                {sortOptions.map((option) => {
                  const isSelected = sortOrder === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={(e) => {
                        e.currentTarget.blur();
                        setSortOrder(option.id);
                        closeDropdown();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer outline-none ${
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

          {/* Botón de Limpiar Inteligente */}
          {hasFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="w-full lg:w-auto flex items-center justify-center gap-1.5 px-3.5 py-3 lg:py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 text-xs font-bold rounded-2xl lg:rounded-xl transition-all shadow-xs shrink-0 cursor-pointer animate-in fade-in duration-200 outline-none"
              title="Limpiar filtros"
            >
              <X className="w-3.5 h-3.5 text-rose-500" />
              <span>Limpiar</span>
            </button>
          )}

          {/* Botón de Exportar / Importar */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full lg:w-auto flex items-center justify-center gap-2 px-4 lg:px-3.5 py-3 lg:py-2.5 bg-amber-400 hover:bg-amber-500 text-[#111c38] text-xs font-bold rounded-2xl lg:rounded-xl transition-all shadow-xs shrink-0 cursor-pointer outline-none border border-amber-300/50"
            title="Exportar o Importar datos"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Exportar / Importar</span>
          </button>

        </div>
      </div>

      {/* Modal de Exportación e Importación */}
      <ExportImportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Gestión de Matrículas"
        data={exportData}
        filename=""
        onImportData={onImportData}
      />
    </>
  );
}