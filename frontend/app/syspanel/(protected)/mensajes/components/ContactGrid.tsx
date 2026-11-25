"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Trash2,
  Phone,
  Calendar,
  User,
  ShieldCheck,
  MessageSquare,
  X,
  AlertTriangle,
} from "lucide-react";
import { Mensaje } from "../page";

interface ContactGridProps {
  mensajes: Mensaje[];
  loading: boolean;
  error: boolean;
  currentPage: number;
  itemsPerPage: number;
  onDelete: (id: string) => void;
}

function formatLocalDate(fechaStr?: string): string {
  if (!fechaStr) return "N/A";
  const dateOnly = fechaStr.split("T")[0];
  const parts = dateOnly.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  return fechaStr;
}

export default function ContactGrid({
  mensajes,
  loading,
  error,
  currentPage,
  itemsPerPage,
  onDelete,
}: ContactGridProps) {
  const [selectedMensaje, setSelectedMensaje] = useState<Mensaje | null>(null);
  const [mensajeToDelete, setMensajeToDelete] = useState<Mensaje | null>(null);

  useEffect(() => {
    if (!selectedMensaje && !mensajeToDelete) return;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        setSelectedMensaje(null);
        setMensajeToDelete(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [selectedMensaje, mensajeToDelete]);

  const handleConfirmDelete = () => {
    if (!mensajeToDelete) return;
    const targetId = mensajeToDelete.id;
    setMensajeToDelete(null);
    onDelete(targetId);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 select-none">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-20 bg-slate-100 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-rose-50 rounded-3xl border border-rose-100 select-none">
        <p className="text-rose-600 font-bold text-xs">No se pudieron cargar los mensajes.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-2 text-xs text-rose-400 underline cursor-pointer font-medium"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  if (mensajes.length === 0) {
    return (
      <div className="p-12 text-center border border-dashed border-slate-300 rounded-3xl select-none">
        <p className="text-slate-400 text-xs font-medium">
          No se encontraron mensajes con los filtros seleccionados.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/85 rounded-3xl overflow-hidden shadow-sm select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left min-w-[700px]">
          <thead className="bg-slate-50/80 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200 tracking-wider">
            <tr>
              <th className="px-4 py-3.5 w-12 text-center">#</th>
              <th className="px-6 py-3.5">DNI</th>
              <th className="px-6 py-3.5">Nombres</th>
              <th className="px-6 py-3.5 hidden md:table-cell">Teléfono</th>
              <th className="px-6 py-3.5">Asunto</th>
              <th className="px-6 py-3.5 hidden sm:table-cell">Fecha</th>
              <th className="px-4 py-3.5 w-24 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {mensajes.map((msg, index) => {
              const numeroSerie = (currentPage - 1) * itemsPerPage + index + 1;

              return (
                <tr key={msg.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-4 text-center font-bold text-slate-400 text-xs">
                    {numeroSerie}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">{msg.dni}</td>
                  <td
                    className="px-6 py-4 text-slate-800 font-semibold truncate max-w-[180px]"
                    title={msg.nombre}
                  >
                    {msg.nombre}
                  </td>
                  <td className="px-6 py-4 text-slate-700 hidden md:table-cell">{msg.telefono}</td>
                  <td
                    className="px-6 py-4 text-slate-500 truncate max-w-[200px]"
                    title={msg.asunto}
                  >
                    {msg.asunto}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-[11px] whitespace-nowrap hidden sm:table-cell">
                    {formatLocalDate(msg.fecha)}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.currentTarget.blur();
                          setSelectedMensaje(msg);
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
                          setMensajeToDelete(msg);
                        }}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer outline-none"
                        title="Eliminar mensaje"
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

      {selectedMensaje && (
        <div className="fixed inset-0 z-[99999] overflow-y-auto bg-slate-950/65 backdrop-blur-md flex min-h-full items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden my-auto flex flex-col">
            <div className="bg-[#16275d] text-white px-6 py-4.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold tracking-tight">Detalle del Mensaje</h3>
                  <p className="text-xs text-slate-300 font-medium">
                    ID Mensaje #{selectedMensaje.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  setSelectedMensaje(null);
                }}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer outline-none"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-[#16275d] shrink-0" />
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">
                    Fecha de Recepción
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {selectedMensaje.fecha
                      ? new Date(selectedMensaje.fecha).toLocaleString("es-PE", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "N/A"}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#16275d] flex items-center gap-2 border-b border-slate-100 pb-2">
                  <User className="w-4 h-4 text-amber-500" />
                  Información del Remitente
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block font-medium">Nombres Completos</span>
                    <span className="font-bold text-slate-900">{selectedMensaje.nombre}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">DNI</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {selectedMensaje.dni}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Teléfono / Celular</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {selectedMensaje.telefono}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#16275d] flex items-center gap-2 border-b border-slate-100 pb-2">
                  Asunto del Mensaje
                </h4>
                <p className="text-xs font-bold text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200/60 leading-relaxed">
                  {selectedMensaje.asunto}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  setSelectedMensaje(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#16275d] hover:bg-[#111c38] text-amber-400 text-xs font-bold transition-all shadow-sm cursor-pointer outline-none border border-[#16275d]"
              >
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}

      {mensajeToDelete && (
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
                    Esta acción no se puede deshacer
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  setMensajeToDelete(null);
                }}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer outline-none"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <div className="p-6 sm:p-7 space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                ¿Estás seguro de eliminar el mensaje enviado por{" "}
                <strong className="text-slate-900">{mensajeToDelete.nombre}</strong> (DNI:{" "}
                {mensajeToDelete.dni})?
              </p>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs text-slate-500 italic">
                &quot;{mensajeToDelete.asunto}&quot;
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  setMensajeToDelete(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all border border-slate-200 shadow-2xs cursor-pointer outline-none"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  handleConfirmDelete();
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer outline-none"
              >
                <Trash2 className="w-4 h-4" />
                <span>Sí, eliminar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}