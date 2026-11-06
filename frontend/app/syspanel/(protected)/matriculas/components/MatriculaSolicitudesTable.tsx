// frontend/app/syspanel/matriculas/components/MatriculaSolicitudesTable.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Trash2, FileText, Mail, Phone, Calendar, User, BookOpen, X, Building, ShieldCheck, AlertTriangle } from "lucide-react";
import ToastAlertMatricula from "./ToastAlertMatricula";
import MatriculaFilter from "./MatriculaFilter";
import Pagination from "./Pagination";

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
  createdAt: string;
}

interface Props {
  onCountChange?: (count: number) => void;
}

export default function MatriculaSolicitudesTable({ onCountChange }: Props) {
  const [solicitudes, setSolicitudes] = useState<SolicitudMatricula[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados de Filtros y Orden
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [sortOrder, setSortOrder] = useState("recientes");

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Estado para el Modal de Detalle y Modal de Confirmación de Eliminación
  const [selectedSolicitud, setSelectedSolicitud] = useState<SolicitudMatricula | null>(null);
  const [solicitudToDelete, setSolicitudToDelete] = useState<SolicitudMatricula | null>(null);

  const fetchSolicitudes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/matricula-inscripcion");
      const data = await res.json();
      if (Array.isArray(data)) {
        setSolicitudes(data);
        if (onCountChange) onCountChange(data.length);
      }
    } catch (err) {
      console.error("Error al cargar solicitudes:", err);
      setToast({ message: "Error al conectar con el servidor.", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [onCountChange]);

  useEffect(() => {
    fetchSolicitudes();
  }, [fetchSolicitudes]);

  // Manejo de bloqueo de scroll seguro y tecla ESC en los modales
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
      }
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [selectedSolicitud, solicitudToDelete]);

  const confirmDelete = async () => {
    if (!solicitudToDelete) return;
    const id = solicitudToDelete.id;
    setDeletingId(id);

    try {
      const res = await fetch(`http://localhost:4000/api/matricula-inscripcion/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const updated = solicitudes.filter((item) => item.id !== id);
        setSolicitudes(updated);
        if (onCountChange) onCountChange(updated.length);
        setToast({ message: "Solicitud eliminada con éxito.", type: "success" });
        setSolicitudToDelete(null);
      } else {
        setToast({ message: "No se pudo eliminar la solicitud.", type: "error" });
      }
    } catch (err) {
      console.error("Error al eliminar la solicitud:", err);
      setToast({ message: "Error de red al intentar eliminar.", type: "error" });
    } finally {
      setDeletingId(null);
    }
  };

  // Filtrado por buscador y fecha
  const filtered = solicitudes.filter((item) => {
    const q = searchTerm.toLowerCase();
    const fullName = `${item.nombresEstudiante} ${item.apellidosEstudiante}`.toLowerCase();
    const matchesSearch =
      fullName.includes(q) ||
      item.nombresApoderado.toLowerCase().includes(q) ||
      item.dniEstudiante.includes(q) ||
      item.sede.toLowerCase().includes(q) ||
      item.telefono.includes(q);

    let matchesDate = true;
    if (selectedDate) {
      const itemDate = new Date(item.createdAt).toISOString().split("T")[0];
      matchesDate = itemDate === selectedDate;
    }

    return matchesSearch && matchesDate;
  });

  // Ordenamiento
  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === "recientes") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortOrder === "antiguos") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortOrder === "az") {
      return `${a.nombresEstudiante} ${a.apellidosEstudiante}`.localeCompare(`${b.nombresEstudiante} ${b.apellidosEstudiante}`);
    }
    if (sortOrder === "za") {
      return `${b.nombresEstudiante} ${b.apellidosEstudiante}`.localeCompare(`${a.nombresEstudiante} ${a.apellidosEstudiante}`);
    }
    return 0;
  });

  // Paginación final
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginatedData = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reiniciar a página 1 si cambia el filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDate, sortOrder]);

  return (
    <div className="space-y-4 relative select-none">
      {/* Toast flotante */}
      {toast && (
        <ToastAlertMatricula
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Componente de Filtros */}
      <MatriculaFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      {/* Tabla de registros */}
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
              <table className="w-full text-left border-collapse text-xs min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-3 w-12 text-center">#</th>
                    <th className="py-3.5 px-4 w-[28%]">Estudiante</th>
                    <th className="py-3.5 px-4 w-40">Nivel / Grado</th>
                    <th className="py-3.5 px-4 w-[22%] hidden md:table-cell">Apoderado</th>
                    <th className="py-3.5 px-4 w-36 hidden lg:table-cell">Contacto</th>
                    <th className="py-3.5 px-4 w-28 hidden sm:table-cell">Fecha</th>
                    <th className="py-3.5 px-4 w-24 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {paginatedData.map((item, index) => {
                    const absoluteIndex = (currentPage - 1) * itemsPerPage + index + 1;
                    const nombreCompleto = `${item.nombresEstudiante} ${item.apellidosEstudiante}`;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        
                        <td className="py-4 px-3 text-center text-slate-400 font-bold">
                          {absoluteIndex}
                        </td>

                        <td className="py-4 px-4 font-bold text-slate-900 truncate" title={nombreCompleto}>
                          <div className="flex items-center gap-2 truncate">
                            <User className="w-4 h-4 text-[#16275d] shrink-0" />
                            <span className="truncate">{nombreCompleto}</span>
                          </div>
                        </td>

                        <td className="py-4 px-4 truncate">
                          <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 font-bold px-2.5 py-1 rounded-lg border border-amber-200/60 truncate">
                            <BookOpen className="w-3 h-3 text-amber-600 shrink-0" />
                            <span className="truncate">{item.nivel} - {item.grado}</span>
                          </span>
                        </td>

                        <td className="py-4 px-4 text-slate-800 font-semibold truncate hidden md:table-cell" title={item.nombresApoderado}>
                          <span className="truncate block">{item.nombresApoderado}</span>
                        </td>

                        <td className="py-4 px-4 space-y-0.5 truncate hidden lg:table-cell">
                          <div className="flex items-center gap-1.5 text-slate-700 truncate" title={item.telefono}>
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{item.telefono}</span>
                          </div>
                          {item.email && (
                            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] truncate" title={item.email}>
                              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{item.email}</span>
                            </div>
                          )}
                        </td>

                        <td className="py-4 px-4 text-slate-500 text-[11px] whitespace-nowrap hidden sm:table-cell">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                            {new Date(item.createdAt).toLocaleDateString("es-PE", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </td>

                        {/* ACCIONES */}
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
                                setSolicitudToDelete(item); // Abre el modal minimalista de confirmación
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

            {/* Componente de Paginación */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={sorted.length}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        )}
      </div>

      {/* MODAL DE DETALLE DE LA SOLICITUD */}
      {selectedSolicitud && (
        <div className="fixed inset-0 z-[99999] overflow-y-auto bg-slate-950/65 backdrop-blur-md flex min-h-full items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden my-auto flex flex-col">
            
            {/* Cabecera del Modal */}
            <div className="bg-[#16275d] text-white px-6 py-4.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold tracking-tight">Detalle de Pre-Inscripción</h3>
                  <p className="text-xs text-slate-300 font-medium">ID Solicitud #{selectedSolicitud.id}</p>
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

            {/* Contenido del Modal */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              
              {/* Sede y Fecha */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Building className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Sede</span>
                    <span className="text-xs font-bold text-slate-800">{selectedSolicitud.sede}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-[#16275d] shrink-0" />
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Fecha de Registro</span>
                    <span className="text-xs font-bold text-slate-800">
                      {new Date(selectedSolicitud.createdAt).toLocaleString("es-PE", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Datos del Estudiante */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#16275d] flex items-center gap-2 border-b border-slate-100 pb-2">
                  <User className="w-4 h-4 text-amber-500" />
                  Datos del Estudiante
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Nombres y Apellidos</span>
                    <span className="font-bold text-slate-900">{selectedSolicitud.nombresEstudiante} {selectedSolicitud.apellidosEstudiante}</span>
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

              {/* Datos del Apoderado y Contacto */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#16275d] flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Phone className="w-4 h-4 text-[#16275d]" />
                  Apoderado y Contacto
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block font-medium">Nombre del Apoderado</span>
                    <span className="font-bold text-slate-900">{selectedSolicitud.nombresApoderado}</span>
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

              {/* Mensaje o Comentarios Adicionales */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#16275d] flex items-center gap-2 border-b border-slate-100 pb-2">
                  Mensaje / Comentarios
                </h4>
                <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 italic font-medium">
                  {selectedSolicitud.mensaje || "Sin comentarios adicionales registrados en la solicitud."}
                </p>
              </div>

            </div>

            {/* Pie del Modal */}
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

      {/* MODAL MINIMALISTA DE CONFIRMACIÓN DE ELIMINACIÓN */}
      {solicitudToDelete && (
        <div className="fixed inset-0 z-[99999] overflow-y-auto bg-slate-950/65 backdrop-blur-md flex min-h-full items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden my-auto flex flex-col">
            
            {/* Cabecera del Modal */}
            <div className="bg-rose-600 text-white px-6 py-4.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold tracking-tight">Confirmar Eliminación</h3>
                  <p className="text-xs text-rose-100 font-medium">Esta acción no se puede deshacer</p>
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

            {/* Contenido del Modal */}
            <div className="p-6 sm:p-7 space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                ¿Estás seguro de eliminar la solicitud de pre-inscripción de <strong className="text-slate-900">{solicitudToDelete.nombresEstudiante} {solicitudToDelete.apellidosEstudiante}</strong>?
              </p>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs text-slate-500">
                <span className="block font-bold text-slate-700">DNI: {solicitudToDelete.dniEstudiante}</span>
                <span className="block text-[11px] text-slate-400 mt-0.5">Nivel: {solicitudToDelete.nivel} - {solicitudToDelete.grado}</span>
              </div>
            </div>

            {/* Pie del Modal con Botones de Acción */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
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