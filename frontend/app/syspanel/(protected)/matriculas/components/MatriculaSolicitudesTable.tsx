"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Trash2,
  FileText,
  Mail,
  Phone,
  Calendar,
  User,
  X,
  Building,
  ShieldCheck,
  AlertTriangle,
  School,
  KeyRound,
} from "lucide-react";
import MatriculaFilter from "./MatriculaFilter";
import Pagination from "./Pagination";

export interface PagoMatriculaResumen {
  id: number;
  codigoPago: string;
  estado: string;
  accesoHabilitado: boolean;
  habilitadoHasta: string | null;
  numeroOperacion: string | null;
  montoPagado: string | number | null;
  fechaSubidaVoucher: string | null;
}

export interface SolicitudMatricula {
  id: number;
  sede: string;
  nombresEstudiante: string;
  apellidosEstudiante: string;
  dniEstudiante: string;
  nivel: string;
  grado: string;
  nombresApoderado: string;
  telefono: string;
  email?: string | null;
  mensaje?: string | null;
  tieneOpcion?: string | null;
  detalleOpcion?: string | null;
  createdAt: string;
  pagoMatricula?: PagoMatriculaResumen | null;
  [key: string]: unknown;
}

interface MatriculaSolicitudesTableProps {
  solicitudes: SolicitudMatricula[];
  loading: boolean;
  isRefreshing: boolean;
  onRefresh: () => Promise<void> | void;
  onDeleteOne: (id: number) => Promise<boolean>;
  onDeleteSelected: (ids: number[]) => Promise<void>;
  onImportData: (importedJson: Record<string, unknown>[]) => Promise<void>;
}

const ITEMS_PER_PAGE = 10;

function toLocalDateKey(dateValue: string): string {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function MatriculaSolicitudesTable({
  solicitudes,
  loading,
  isRefreshing,
  onRefresh,
  onDeleteOne,
  onDeleteSelected,
  onImportData,
}: MatriculaSolicitudesTableProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [sortOrder, setSortOrder] = useState("recientes");
  const [currentPage, setCurrentPage] = useState(1);

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedSolicitud, setSelectedSolicitud] = useState<SolicitudMatricula | null>(null);
  const [solicitudToDelete, setSolicitudToDelete] = useState<SolicitudMatricula | null>(null);

  useEffect(() => {
    setSelectedIds((prev) => prev.filter((id) => solicitudes.some((item) => item.id === id)));
  }, [solicitudes]);

  const confirmDelete = useCallback(async () => {
    if (!solicitudToDelete || deletingId !== null) return;
    const id = solicitudToDelete.id;
    setDeletingId(id);

    try {
      const ok = await onDeleteOne(id);
      if (ok) {
        setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
        setSolicitudToDelete(null);
      }
    } finally {
      setDeletingId(null);
    }
  }, [solicitudToDelete, deletingId, onDeleteOne]);

  const handleBatchDelete = useCallback(
    async (ids: number[]) => {
      await onDeleteSelected(ids);
      setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
    },
    [onDeleteSelected],
  );

  useEffect(() => {
    if (!selectedSolicitud && !solicitudToDelete) return;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        setSelectedSolicitud(null);
        setSolicitudToDelete(null);
        return;
      }

      if (e.key === "Enter" && solicitudToDelete && deletingId === null) {
        const target = e.target as HTMLElement | null;
        if (target?.dataset?.cancelDelete === "true") return;
        e.preventDefault();
        e.stopPropagation();
        confirmDelete();
      }
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [selectedSolicitud, solicitudToDelete, deletingId, confirmDelete]);

  const filtered = solicitudes.filter((item) => {
    const q = searchTerm.toLowerCase();
    const fullName = `${item.nombresEstudiante} ${item.apellidosEstudiante}`.toLowerCase();
    const codigoPago = item.pagoMatricula?.codigoPago?.toLowerCase() || "";
    const matchesSearch =
      fullName.includes(q) ||
      codigoPago.includes(q) ||
      item.nombresApoderado.toLowerCase().includes(q) ||
      item.dniEstudiante.includes(q) ||
      item.sede.toLowerCase().includes(q) ||
      item.telefono.includes(q) ||
      (item.detalleOpcion && item.detalleOpcion.toLowerCase().includes(q));

    const matchesDate = !selectedDate || toLocalDateKey(item.createdAt) === selectedDate;
    return matchesSearch && matchesDate;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === "recientes") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortOrder === "antiguos") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortOrder === "az") {
      return `${a.nombresEstudiante} ${a.apellidosEstudiante}`.localeCompare(
        `${b.nombresEstudiante} ${b.apellidosEstudiante}`,
      );
    }
    if (sortOrder === "za") {
      return `${b.nombresEstudiante} ${b.apellidosEstudiante}`.localeCompare(
        `${a.nombresEstudiante} ${a.apellidosEstudiante}`,
      );
    }
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedData = sorted.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  const pageIds = paginatedData.map((item) => item.id);
  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));

  const toggleSelectAllPage = () => {
    if (allPageSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const toggleSelectRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id],
    );
  };

  return (
    <div className="space-y-4 relative select-none">
      <MatriculaFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        currentPage={safePage}
        setCurrentPage={setCurrentPage}
        exportData={sorted}
        onImportData={onImportData}
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
        selectedIds={selectedIds}
        onDeleteSelected={handleBatchDelete}
      />

      <div className="bg-white border border-slate-200/85 rounded-3xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">
            Cargando solicitudes de inscripción...
          </div>
        ) : sorted.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">
            No se encontraron solicitudes registradas con los filtros seleccionados.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs min-w-[680px]">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={allPageSelected}
                        onChange={toggleSelectAllPage}
                        aria-label="Seleccionar todas las filas de la página"
                        className="w-4 h-4 rounded border-slate-300 text-[#16275d] focus:ring-[#16275d] cursor-pointer accent-[#16275d]"
                      />
                    </th>
                    <th className="py-3.5 px-4">Estudiante</th>
                    <th className="py-3.5 px-4">ID Pago</th>
                    <th className="py-3.5 px-4">Apoderado</th>
                    <th className="py-3.5 px-4">Fecha</th>
                    <th className="py-3.5 px-4 w-24 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {paginatedData.map((item) => {
                    const nombreCompleto = `${item.nombresEstudiante} ${item.apellidosEstudiante}`;
                    const isChecked = selectedIds.includes(item.id);

                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors ${
                          isChecked ? "bg-amber-50/40" : "hover:bg-slate-50/80"
                        }`}
                      >
                        <td className="py-4 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSelectRow(item.id)}
                            aria-label={`Seleccionar a ${nombreCompleto}`}
                            className="w-4 h-4 rounded border-slate-300 text-[#16275d] focus:ring-[#16275d] cursor-pointer accent-[#16275d]"
                          />
                        </td>

                        <td
                          className="py-4 px-4 font-bold text-slate-900 truncate max-w-[240px]"
                          title={nombreCompleto}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <User className="w-4 h-4 text-[#16275d] shrink-0" />
                            <span className="truncate">{nombreCompleto}</span>
                          </div>
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap">
                          {item.pagoMatricula?.codigoPago ? (
                            <span className="font-mono font-bold text-[#111c38] text-[11px] bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/70">
                              {item.pagoMatricula.codigoPago}
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">
                              Sin ID asignado
                            </span>
                          )}
                        </td>

                        <td
                          className="py-4 px-4 text-slate-800 font-semibold truncate max-w-[220px]"
                          title={item.nombresApoderado}
                        >
                          <span className="truncate block">{item.nombresApoderado}</span>
                        </td>

                        <td className="py-4 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            {new Date(item.createdAt).toLocaleDateString("es-PE", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </td>

                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.currentTarget.blur();
                                setSelectedSolicitud(item);
                              }}
                              className="p-2 text-[#16275d] hover:bg-[#16275d]/10 rounded-xl transition-colors cursor-pointer outline-none"
                              title="Ver detalle completo"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.currentTarget.blur();
                                setSolicitudToDelete(item);
                              }}
                              disabled={deletingId === item.id}
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer outline-none disabled:opacity-50"
                              title="Eliminar solicitud"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={sorted.length}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {selectedSolicitud && (
        <div className="fixed inset-0 z-[99999] overflow-y-auto bg-slate-950/65 backdrop-blur-md flex min-h-full items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden my-auto flex flex-col">
            <div className="bg-[#16275d] text-white px-6 py-4.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold tracking-tight">
                    Detalle de Pre-Inscripción
                  </h3>
                  <p className="text-xs text-slate-300 font-medium">
                    ID Solicitud #{selectedSolicitud.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  setSelectedSolicitud(null);
                }}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer outline-none"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="bg-[#111c38] text-white p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <KeyRound className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-amber-400">
                      ID Único de Pago Generado
                    </span>
                    <span className="font-mono text-sm font-bold text-white">
                      {selectedSolicitud.pagoMatricula?.codigoPago || "No asignado"}
                    </span>
                  </div>
                </div>
                {selectedSolicitud.pagoMatricula?.estado && (
                  <span className="inline-block self-start sm:self-center text-[11px] font-bold px-3 py-1 rounded-full bg-white/10 text-amber-300">
                    {selectedSolicitud.pagoMatricula.estado.replace("_", " ")}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Building className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Sede</span>
                    <span className="text-xs font-bold text-slate-800">
                      {selectedSolicitud.sede}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-[#16275d] shrink-0" />
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      Fecha de Registro
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {new Date(selectedSolicitud.createdAt).toLocaleString("es-PE", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#16275d] flex items-center gap-2 border-b border-slate-100 pb-2">
                  <User className="w-4 h-4 text-amber-500" />
                  Datos del Estudiante
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Nombres y Apellidos</span>
                    <span className="font-bold text-slate-900">
                      {selectedSolicitud.nombresEstudiante} {selectedSolicitud.apellidosEstudiante}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">DNI del Estudiante</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {selectedSolicitud.dniEstudiante}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Nivel Educativo</span>
                    <span className="font-bold text-slate-900">{selectedSolicitud.nivel}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Grado al que postula</span>
                    <span className="inline-block bg-amber-50 text-amber-900 font-bold px-2.5 py-0.5 rounded-md border border-amber-200/60 mt-0.5">
                      {selectedSolicitud.grado}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#16275d] flex items-center gap-2 border-b border-slate-100 pb-2">
                  <School className="w-4 h-4 text-amber-600" />
                  Procedencia Escolar
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block font-medium">¿Viene de otro colegio?</span>
                    <span
                      className={`inline-block font-bold px-2.5 py-0.5 rounded-md mt-0.5 ${
                        selectedSolicitud.tieneOpcion === "Si"
                          ? "bg-amber-100 text-amber-900 border border-amber-200"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {selectedSolicitud.tieneOpcion === "Si" ? "Sí" : "No / No especificado"}
                    </span>
                  </div>
                  {selectedSolicitud.tieneOpcion === "Si" && (
                    <div className="sm:col-span-2">
                      <span className="text-slate-400 block font-medium">
                        Institución de Procedencia (Traslado)
                      </span>
                      <span className="font-bold text-slate-900 text-sm">
                        {selectedSolicitud.detalleOpcion || "No especificado"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#16275d] flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Phone className="w-4 h-4 text-[#16275d]" />
                  Apoderado y Contacto
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block font-medium">Nombre del Apoderado</span>
                    <span className="font-bold text-slate-900">
                      {selectedSolicitud.nombresApoderado}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Teléfono / Celular</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {selectedSolicitud.telefono}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Correo Electrónico</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {selectedSolicitud.email || "No especificado"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#16275d] flex items-center gap-2 border-b border-slate-100 pb-2">
                  Mensaje / Comentarios
                </h4>
                <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 italic font-medium">
                  {selectedSolicitud.mensaje ||
                    "Sin comentarios adicionales registrados en la solicitud."}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  setSelectedSolicitud(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#16275d] hover:bg-[#111c38] text-amber-400 text-xs font-bold transition-all shadow-sm cursor-pointer outline-none border border-[#16275d]"
              >
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}

      {solicitudToDelete && (
        <div className="fixed inset-0 z-[99999] overflow-y-auto bg-slate-950/65 backdrop-blur-md flex min-h-full items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden my-auto flex flex-col">
            <div className="bg-rose-600 text-white px-6 py-4.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold tracking-tight">Confirmar Eliminación</h3>
                  <p className="text-xs text-rose-100 font-medium">
                    Presiona Enter para confirmar o Esc para cancelar
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  setSolicitudToDelete(null);
                }}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer outline-none"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <div className="p-6 sm:p-7 space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                ¿Estás seguro de eliminar la solicitud de pre-inscripción de{" "}
                <strong className="text-slate-900">
                  {solicitudToDelete.nombresEstudiante} {solicitudToDelete.apellidosEstudiante}
                </strong>
                ?
              </p>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs text-slate-500 space-y-1">
                <span className="block font-bold text-slate-700">
                  DNI: {solicitudToDelete.dniEstudiante}
                </span>
                {solicitudToDelete.pagoMatricula?.codigoPago && (
                  <span className="block font-mono font-bold text-[#16275d] text-[11px]">
                    ID Pago: {solicitudToDelete.pagoMatricula.codigoPago}
                  </span>
                )}
                <span className="block text-[11px] text-slate-400">
                  Nivel: {solicitudToDelete.nivel} - {solicitudToDelete.grado}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                data-cancel-delete="true"
                onClick={(e) => {
                  e.currentTarget.blur();
                  setSolicitudToDelete(null);
                }}
                disabled={deletingId === solicitudToDelete.id}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all border border-slate-200 shadow-2xs cursor-pointer outline-none disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  confirmDelete();
                }}
                disabled={deletingId === solicitudToDelete.id}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer outline-none disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {deletingId === solicitudToDelete.id ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}