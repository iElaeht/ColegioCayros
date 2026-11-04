"use client";

import React from "react";
import { Mensaje } from "./page";

interface ContactGridProps {
  mensajes: Mensaje[];
  loading: boolean;
  error: boolean;
  currentPage: number;
  itemsPerPage: number;
}

export default function ContactGrid({ 
  mensajes, 
  loading, 
  error, 
  currentPage, 
  itemsPerPage 
}: ContactGridProps) {

  // Función segura para formatear fechas a texto plano (DD/MM/YYYY) sin usar la zona horaria local
  const formatLocalDate = (fechaStr?: string) => {
    if (!fechaStr) return "N/A";
    const dateOnly = fechaStr.split("T")[0];
    const parts = dateOnly.split("-");
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
    return fechaStr;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-20 bg-slate-100 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-100">
        <p className="text-red-600 font-bold">No se pudieron cargar los mensajes.</p>
        <button onClick={() => window.location.reload()} className="mt-2 text-sm text-red-400 underline cursor-pointer">Intentar de nuevo</button>
      </div>
    );
  }

  if (mensajes.length === 0) {
    return (
      <div className="p-12 text-center border border-dashed border-slate-300 rounded-2xl">
        <p className="text-slate-400">No se encontraron mensajes con los filtros seleccionados.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-100">
            <tr>
              <th className="px-4 py-4 w-12 text-center">#</th>
              <th className="px-6 py-4">DNI</th>
              <th className="px-6 py-4">Nombres</th>
              <th className="px-6 py-4">Teléfono</th>
              <th className="px-6 py-4">Asunto</th>
              <th className="px-6 py-4">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mensajes.map((msg, index) => {
              const numeroSerie = (currentPage - 1) * itemsPerPage + index + 1;

              return (
                <tr key={msg.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 text-center font-semibold text-slate-400 text-xs">
                    {numeroSerie}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">{msg.dni}</td>
                  <td className="px-6 py-4 text-slate-700">{msg.nombre}</td>
                  <td className="px-6 py-4 text-slate-700">{msg.telefono}</td>
                  <td className="px-6 py-4 text-slate-500 truncate max-w-[200px]">{msg.asunto}</td>
                  <td className="px-6 py-4 text-slate-400 text-xs">
                    {formatLocalDate(msg.fecha)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}