// frontend/app/syspanel/matriculas/components/MatriculaSolicitudesTable.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Trash2, Mail, Phone, Calendar, User, BookOpen } from "lucide-react";
import ToastAlertMatricula from "./ToastAlertMatricula";
import MatriculaFilter from "./MatriculaFilter";
import Pagination from "./Pagination";

export interface SolicitudMatricula {
  id: number;
  nombresEstudiante: string;
  apellidosEstudiante: string;
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

  const fetchSolicitudes = async () => {
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
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta solicitud de pre-inscripción?")) return;
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
    <div className="space-y-4 relative">
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
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
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
              <table className="w-full text-left border-collapse text-xs table-fixed">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-3 w-14 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span>#</span>
                        <span className="text-slate-300 font-light">|</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-4 w-[28%] text-center">Estudiante</th>
                    <th className="py-3.5 px-4 w-44 text-center">Nivel / Grado</th>
                    <th className="py-3.5 px-4 w-[22%] text-center">Apoderado</th>
                    <th className="py-3.5 px-4 w-36 text-center">Contacto</th>
                    <th className="py-3.5 px-4 w-32 text-center">Fecha</th>
                    <th className="py-3.5 px-4 w-20 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {paginatedData.map((item, index) => {
                    const absoluteIndex = (currentPage - 1) * itemsPerPage + index + 1;
                    const nombreCompleto = `${item.nombresEstudiante} ${item.apellidosEstudiante}`;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        
                        <td className="py-4 px-3 text-center text-slate-400 font-bold relative">
                          <div className="flex items-center justify-center gap-2">
                            <span>{absoluteIndex}</span>
                            <span className="absolute right-0 top-2 bottom-2 w-[1px] bg-slate-100" />
                          </div>
                        </td>

                        <td className="py-4 px-4 font-bold text-slate-900 truncate" title={nombreCompleto}>
                          <div className="flex items-center gap-2 truncate">
                            <User className="w-4 h-4 text-blue-900 shrink-0" />
                            <span className="truncate">{nombreCompleto}</span>
                          </div>
                        </td>

                        <td className="py-4 px-4 truncate" title={`${item.nivel} - ${item.grado}`}>
                          <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 font-bold px-2.5 py-1 rounded-lg border border-amber-200/60 truncate">
                            <BookOpen className="w-3 h-3 text-amber-600 shrink-0" />
                            <span className="truncate">{item.nivel} - {item.grado}</span>
                          </span>
                        </td>

                        <td className="py-4 px-4 text-slate-800 font-semibold truncate" title={item.nombresApoderado}>
                          <span className="truncate block">{item.nombresApoderado}</span>
                        </td>

                        <td className="py-4 px-4 space-y-0.5 truncate">
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

                        <td className="py-4 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                            {new Date(item.createdAt).toLocaleDateString("es-PE", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </td>

                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => handleDelete(item.id)}
                              disabled={deletingId === item.id}
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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
    </div>
  );
}