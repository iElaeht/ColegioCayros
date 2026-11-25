"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Search,
  ArrowUpDown,
  X,
  ChevronDown,
  Check,
  ArrowLeftRight,
  RefreshCw,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import CustomDatePicker from "../../../../components/ui/CustomDatePicker";
import ExportImportModal from "../../components/ExportImport";

interface MatriculaFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedDate: string;
  setSelectedDate: (value: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
  currentPage?: number;
  setCurrentPage?: (page: number) => void;
  exportData: Record<string, unknown>[];
  onImportData?: (importedJson: Record<string, unknown>[]) => Promise<void> | void;
  onRefresh?: () => Promise<void> | void;
  isRefreshing?: boolean;
  selectedIds?: number[];
  onDeleteSelected?: (ids: number[]) => Promise<void> | void;
}

const VALID_SORT_ORDERS = new Set(["recientes", "antiguos", "az", "za"]);

const SORT_OPTIONS = [
  { id: "recientes", label: "Más recientes primero" },
  { id: "antiguos", label: "Más antiguos primero" },
  { id: "az", label: "Estudiante (A - Z)" },
  { id: "za", label: "Estudiante (Z - A)" },
] as const;

export default function MatriculaFilter({
  searchTerm,
  setSearchTerm,
  selectedDate,
  setSelectedDate,
  sortOrder,
  setSortOrder,
  currentPage = 1,
  setCurrentPage,
  exportData,
  onImportData,
  onRefresh,
  isRefreshing = false,
  selectedIds = [],
  onDeleteSelected,
}: MatriculaFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const isHydratingFromUrl = useRef(true);

  const hasFilters = searchTerm !== "" || selectedDate !== "" || sortOrder !== "recientes";
  const hasSelected = selectedIds.length > 0;

  useEffect(() => {
    const urlQ = searchParams.get("q") || "";
    const urlDate = searchParams.get("fecha") || "";
    const rawSort = searchParams.get("orden") || "recientes";
    const urlSort = VALID_SORT_ORDERS.has(rawSort) ? rawSort : "recientes";
    const rawPage = Number(searchParams.get("pagina") || "1");
    const urlPage = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

    setSearchTerm(urlQ);
    setSelectedDate(urlDate);
    setSortOrder(urlSort);
    if (setCurrentPage) {
      setCurrentPage(urlPage);
    }

    isHydratingFromUrl.current = false;
  }, [searchParams, setSearchTerm, setSelectedDate, setSortOrder, setCurrentPage]);

  useEffect(() => {
    if (isHydratingFromUrl.current) return;

    const params = new URLSearchParams(searchParams.toString());

    if (searchTerm.trim()) {
      params.set("q", searchTerm.trim());
    } else {
      params.delete("q");
    }

    if (selectedDate) {
      params.set("fecha", selectedDate);
    } else {
      params.delete("fecha");
    }

    if (sortOrder && sortOrder !== "recientes") {
      params.set("orden", sortOrder);
    } else {
      params.delete("orden");
    }

    if (currentPage > 1) {
      params.set("pagina", String(currentPage));
    } else {
      params.delete("pagina");
    }

    const nextQuery = params.toString();
    const currentQuery = searchParams.toString();

    if (nextQuery !== currentQuery) {
      const targetUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;
      router.replace(targetUrl, { scroll: false });
    }
  }, [searchTerm, selectedDate, sortOrder, currentPage, pathname, router, searchParams]);

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
      if (e.key === "Escape") {
        if (isDeleteModalOpen && !isDeleting) {
          e.preventDefault();
          e.stopPropagation();
          setIsDeleteModalOpen(false);
          return;
        }
        if (isSortOpen) {
          e.preventDefault();
          e.stopPropagation();
          closeDropdown();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown, { capture: true });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, [isSortOpen, isDeleteModalOpen, isDeleting, closeDropdown]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (setCurrentPage) setCurrentPage(1);
  };

  const handleDateChange = (value: string) => {
    setSelectedDate(value);
    if (setCurrentPage) setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value);
    if (setCurrentPage) setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedDate("");
    setSortOrder("recientes");
    if (setCurrentPage) setCurrentPage(1);
  };

  const handleConfirmDelete = async () => {
    if (!onDeleteSelected || selectedIds.length === 0) return;
    setIsDeleting(true);
    try {
      await onDeleteSelected(selectedIds);
      setIsDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.id === sortOrder)?.label || "Ordenar por";

  return (
    <>
      <div className="bg-white p-4 sm:p-5 border border-slate-200/85 rounded-3xl shadow-sm flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 select-none w-full">
        <div className="relative w-full xl:w-72 shrink-0 group">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#16275d] transition-colors">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Buscar alumno, DNI, apoderado..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50/80 hover:bg-slate-50 border border-slate-200/90 rounded-2xl xl:rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16275d]/10 focus:border-[#16275d] focus:bg-white transition-all shadow-xs"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => handleSearchChange("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              title="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-start xl:justify-end gap-2 w-full xl:w-auto">
          <div className="w-full sm:w-auto shrink-0">
            <CustomDatePicker selectedDate={selectedDate} onChange={handleDateChange} />
          </div>

          <div className="relative w-full sm:w-auto shrink-0" ref={sortRef}>
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
              className={`w-full sm:w-auto flex items-center justify-between gap-2 px-3 py-2.5 border rounded-2xl xl:rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs bg-slate-50/80 hover:bg-slate-50 outline-none ${
                isSortOpen
                  ? "border-[#16275d] text-[#16275d] ring-2 ring-[#16275d]/10 bg-white"
                  : "border-slate-200/90 text-slate-700"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#16275d] shrink-0" />
                <span className="truncate">{currentSortLabel}</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
                  isSortOpen ? "rotate-180 text-[#16275d]" : ""
                }`}
              />
            </button>

            {isSortOpen && (
              <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-full sm:w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-[99999] overflow-hidden p-1.5 animate-in fade-in zoom-in-95 duration-150">
                {SORT_OPTIONS.map((option) => {
                  const isSelected = sortOrder === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={(e) => {
                        e.currentTarget.blur();
                        handleSortChange(option.id);
                        closeDropdown();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer outline-none ${
                        isSelected
                          ? "text-[#16275d] bg-[#16275d]/10 font-bold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="truncate">{option.label}</span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[#16275d] shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 text-xs font-bold rounded-2xl xl:rounded-xl transition-all shadow-xs shrink-0 cursor-pointer animate-in fade-in duration-200 outline-none"
              title="Limpiar filtros"
            >
              <X className="w-3.5 h-3.5 text-rose-500" />
              <span>Limpiar</span>
            </button>
          )}

          {onRefresh && (
            <button
              type="button"
              onClick={() => onRefresh()}
              disabled={isRefreshing}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-50 hover:bg-slate-100 disabled:opacity-60 text-slate-700 border border-slate-200/90 text-xs font-bold rounded-2xl xl:rounded-xl transition-all shadow-xs shrink-0 cursor-pointer outline-none"
              title="Actualizar tabla"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-[#16275d] ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span>Actualizar</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2.5 bg-amber-400 hover:bg-amber-500 text-[#111c38] text-xs font-bold rounded-2xl xl:rounded-xl transition-all shadow-xs shrink-0 cursor-pointer outline-none border border-amber-300/50"
            title="Exportar o Importar datos"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Exportar / Importar</span>
          </button>

          {onDeleteSelected && (
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={!hasSelected || isDeleting}
              className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold rounded-2xl xl:rounded-xl transition-all shadow-xs shrink-0 outline-none border ${
                hasSelected && !isDeleting
                  ? "bg-rose-600 hover:bg-rose-700 text-white border-rose-700 cursor-pointer"
                  : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-70"
              }`}
              title={
                hasSelected
                  ? `Eliminar ${selectedIds.length} matrícula(s) seleccionada(s)`
                  : "Selecciona al menos una fila para eliminar"
              }
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Eliminar{hasSelected ? ` (${selectedIds.length})` : ""}</span>
            </button>
          )}
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Confirmar eliminación de matrículas
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  ¿Estás seguro de que deseas eliminar{" "}
                  <strong className="text-slate-900">
                    {selectedIds.length}{" "}
                    {selectedIds.length === 1
                      ? "matrícula seleccionada"
                      : "matrículas seleccionadas"}
                  </strong>
                  ? Esta acción eliminará los registros de forma permanente.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Eliminando...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Sí, eliminar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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