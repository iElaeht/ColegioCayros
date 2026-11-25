"use client";

import React, { useState } from "react";
import { Search, Filter, RotateCcw, RefreshCw, FileSpreadsheet, Trash2, Info } from "lucide-react";

export type FiltroEstadoPago =
  | "TODOS"
  | "PENDIENTE_SUBIDA"
  | "EN_REVISION"
  | "OBSERVADO_RECHAZADO"
  | "CONFIRMADO"
  | "COMPLETADO";

interface PagosFiltrosBarProps {
  busqueda: string;
  onBusquedaChange: (valor: string) => void;
  estadoFiltro: FiltroEstadoPago;
  onEstadoFiltroChange: (estado: FiltroEstadoPago) => void;
  conteos: Record<FiltroEstadoPago, number>;
  onLimpiar: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  onOpenExportImport: () => void;
  totalSeleccionados?: number;
  onEliminarSeleccionados?: () => void;
}

const ESTADOS_OPCIONES: { value: FiltroEstadoPago; label: string }[] = [
  { value: "TODOS", label: "Todos" },
  { value: "EN_REVISION", label: "En revisión" },
  { value: "PENDIENTE_SUBIDA", label: "Pendiente subida" },
  { value: "OBSERVADO_RECHAZADO", label: "Observado (48h)" },
  { value: "CONFIRMADO", label: "Confirmado" },
  { value: "COMPLETADO", label: "Completado" },
];

export default function PagosFiltrosBar({
  busqueda,
  onBusquedaChange,
  estadoFiltro,
  onEstadoFiltroChange,
  conteos,
  onLimpiar,
  onRefresh,
  isRefreshing = false,
  onOpenExportImport,
  totalSeleccionados = 0,
  onEliminarSeleccionados,
}: PagosFiltrosBarProps) {
  const [mostrarAviso, setMostrarAviso] = useState(false);
  const hayFiltrosActivos = busqueda.trim() !== "" || estadoFiltro !== "TODOS";
  const puedeEliminar = totalSeleccionados > 0 && Boolean(onEliminarSeleccionados);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-5 shadow-xs space-y-3.5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            placeholder="Buscar por ID, DNI, alumno, apoderado o N° op..."
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs sm:text-sm text-[#111c38] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#16275d] transition-all"
          />
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 shrink-0">
          {hayFiltrosActivos && (
            <button
              type="button"
              onClick={onLimpiar}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" />
              <span>Limpiar</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-60 text-xs font-bold text-[#111c38] transition-colors cursor-pointer"
            title="Actualizar registros"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-[#16275d] shrink-0 ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
            <span>Actualizar</span>
          </button>

          <button
            type="button"
            onClick={onOpenExportImport}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#111c38] hover:bg-[#16275d] text-white text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Exportar / Importar</span>
          </button>

          <div
            className="relative col-span-2 sm:col-span-1"
            onMouseEnter={() => {
              if (!puedeEliminar) setMostrarAviso(true);
            }}
            onMouseLeave={() => setMostrarAviso(false)}
          >
            <button
              type="button"
              disabled={!puedeEliminar}
              onClick={() => {
                if (puedeEliminar && onEliminarSeleccionados) {
                  onEliminarSeleccionados();
                } else {
                  setMostrarAviso((prev) => !prev);
                }
              }}
              className={`w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                puedeEliminar
                  ? "bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
                  : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
              }`}
            >
              <Trash2 className="w-3.5 h-3.5 shrink-0" />
              <span>
                {totalSeleccionados > 0 ? `Eliminar (${totalSeleccionados})` : "Eliminar"}
              </span>
            </button>

            {!puedeEliminar && mostrarAviso && (
              <div
                role="tooltip"
                className="absolute right-0 sm:left-1/2 sm:-translate-x-1/2 top-full mt-2 z-30 w-64 p-2.5 rounded-xl bg-[#111c38] text-white text-[11px] leading-snug shadow-xl border border-slate-700 flex items-start gap-2 pointer-events-none"
              >
                <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Debe seleccionar al menos un dato para eliminar (o usar el ícono de eliminar en
                  una fila para borrar uno).
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 border-t border-slate-100">
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
          <Filter className="w-3.5 h-3.5" /> Estado:
        </span>

        {ESTADOS_OPCIONES.map((op) => {
          const activo = estadoFiltro === op.value;
          return (
            <button
              key={op.value}
              type="button"
              onClick={() => onEstadoFiltroChange(op.value)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activo
                  ? "bg-[#111c38] text-amber-400 shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-[#111c38]"
              }`}
            >
              <span>{op.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                  activo ? "bg-white/15 text-white" : "bg-white text-slate-700"
                }`}
              >
                {conteos[op.value] ?? 0}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}