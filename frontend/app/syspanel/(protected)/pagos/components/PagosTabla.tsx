"use client";

import React from "react";
import {
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Lock,
} from "lucide-react";

export interface RegistroPagoAdmin {
  id: number;
  codigoPago: string;
  estado:
    | "PENDIENTE_SUBIDA"
    | "EN_REVISION"
    | "OBSERVADO_RECHAZADO"
    | "CONFIRMADO"
    | "COMPLETADO";
  accesoHabilitado: boolean;
  habilitadoHasta: string | null;
  voucherUrl: string | null;
  numeroOperacion: string | null;
  bancoOrigen: string | null;
  montoPagado: string | number | null;
  fechaSubidaVoucher: string | null;
  mensajeAdmin: string | null;
  revisadoPor: string | null;
  fechaRevision: string | null;
  updatedAt: string;
  matricula: {
    id: number;
    sede: string;
    nombresEstudiante: string;
    apellidosEstudiante: string;
    dniEstudiante: string;
    nivel: string;
    grado: string;
    nombresApoderado: string;
    telefono: string;
  };
}

interface PagosTablaProps {
  pagos: RegistroPagoAdmin[];
  paginaActual: number;
  totalPaginas: number;
  totalFiltrados: number;
  porPagina: number;
  onCambiarPagina: (pagina: number) => void;
  onRevisar: (pago: RegistroPagoAdmin) => void;
  onEliminarUno: (pago: RegistroPagoAdmin) => void;
  selectedIds: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectPage: (idsPagina: number[]) => void;
}

function renderBadgeEstado(estado: RegistroPagoAdmin["estado"]) {
  switch (estado) {
    case "CONFIRMADO":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 whitespace-nowrap">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Confirmado
        </span>
      );
    case "EN_REVISION":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 whitespace-nowrap">
          <Clock className="w-3.5 h-3.5 shrink-0" /> En revisión
        </span>
      );
    case "OBSERVADO_RECHAZADO":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 whitespace-nowrap">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Observado (48h)
        </span>
      );
    case "COMPLETADO":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-200 text-slate-800 whitespace-nowrap">
          <Lock className="w-3.5 h-3.5 shrink-0" /> Completado
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 whitespace-nowrap">
          <FileText className="w-3.5 h-3.5 shrink-0" /> Pendiente subida
        </span>
      );
  }
}

export default function PagosTabla({
  pagos,
  paginaActual,
  totalPaginas,
  totalFiltrados,
  porPagina,
  onCambiarPagina,
  onRevisar,
  onEliminarUno,
  selectedIds,
  onToggleSelect,
  onToggleSelectPage,
}: PagosTablaProps) {
  const inicioIdx = totalFiltrados === 0 ? 0 : (paginaActual - 1) * porPagina + 1;
  const finIdx = Math.min(paginaActual * porPagina, totalFiltrados);

  const idsPagina = pagos.map((p) => p.id);
  const todosSeleccionadosEnPagina =
    idsPagina.length > 0 && idsPagina.every((id) => selectedIds.includes(id));

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 pl-4 pr-2 w-10">
                <input
                  type="checkbox"
                  checked={todosSeleccionadosEnPagina}
                  onChange={() => onToggleSelectPage(idsPagina)}
                  aria-label="Seleccionar todos en esta página"
                  className="w-4 h-4 rounded border-slate-300 text-[#111c38] focus:ring-[#16275d] cursor-pointer"
                />
              </th>
              <th className="py-3.5 px-3">Código / Estado</th>
              <th className="py-3.5 px-3">Estudiante</th>
              <th className="py-3.5 px-3">Comprobante</th>
              <th className="py-3.5 px-3 hidden sm:table-cell">Ventana / Acceso</th>
              <th className="py-3.5 pl-3 pr-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {pagos.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 px-4 text-center text-slate-400 font-medium">
                  No se encontraron trámites de pago que coincidan con los filtros actuales.
                </td>
              </tr>
            ) : (
              pagos.map((item) => {
                const estaSeleccionado = selectedIds.includes(item.id);
                const idEstaAbierto = item.estado !== "COMPLETADO" && item.accesoHabilitado;
                const estaCerradoDefinitivo = item.estado === "COMPLETADO";

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      estaSeleccionado ? "bg-amber-50/40" : "hover:bg-slate-50/80"
                    }`}
                  >
                    <td className="py-3.5 pl-4 pr-2 align-top">
                      <input
                        type="checkbox"
                        checked={estaSeleccionado}
                        onChange={() => onToggleSelect(item.id)}
                        aria-label={`Seleccionar ${item.codigoPago}`}
                        className="w-4 h-4 rounded border-slate-300 text-[#111c38] focus:ring-[#16275d] cursor-pointer mt-0.5"
                      />
                    </td>

                    <td className="py-3.5 px-3 space-y-1.5 align-top">
                      <div className="font-mono font-bold text-[#111c38] text-xs">
                        {item.codigoPago}
                      </div>
                      <div>{renderBadgeEstado(item.estado)}</div>
                    </td>

                    <td className="py-3.5 px-3 space-y-0.5 align-top">
                      <p className="font-bold text-[#111c38]">
                        {item.matricula.nombresEstudiante} {item.matricula.apellidosEstudiante}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        DNI:{" "}
                        <span className="font-mono text-slate-700">
                          {item.matricula.dniEstudiante}
                        </span>{" "}
                        · {item.matricula.nivel} ({item.matricula.grado})
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Apoderado: {item.matricula.nombresApoderado}
                      </p>
                    </td>

                    <td className="py-3.5 px-3 space-y-1 align-top">
                      {item.voucherUrl ? (
                        <>
                          <p className="font-semibold text-slate-700">
                            {item.bancoOrigen || "Banco"} · Op:{" "}
                            <span className="font-mono text-[#111c38]">
                              {item.numeroOperacion || "—"}
                            </span>
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {item.montoPagado
                              ? `S/ ${Number(item.montoPagado).toFixed(2)}`
                              : "Monto no indicado"}
                            {item.fechaSubidaVoucher
                              ? ` · ${new Date(item.fechaSubidaVoucher).toLocaleDateString("es-PE")}`
                              : ""}
                          </p>
                        </>
                      ) : (
                        <span className="text-slate-400 italic">Sin voucher subido</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 space-y-1 hidden sm:table-cell align-top">
                      <span
                        className={`inline-block text-[11px] font-bold ${
                          estaCerradoDefinitivo
                            ? "text-slate-500"
                            : idEstaAbierto || item.estado === "CONFIRMADO"
                            ? "text-emerald-700"
                            : "text-amber-700"
                        }`}
                      >
                        {estaCerradoDefinitivo
                          ? "ID Cerrado"
                          : item.estado === "CONFIRMADO" || idEstaAbierto
                          ? "ID Abierto"
                          : "En revisión"}
                      </span>
                      {item.estado === "OBSERVADO_RECHAZADO" && item.habilitadoHasta && (
                        <p className="text-[11px] text-rose-700">
                          Límite:{" "}
                          {new Date(item.habilitadoHasta).toLocaleString("es-PE", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 pl-3 pr-4 text-right align-top">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onRevisar(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#111c38] hover:bg-[#16275d] text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-400" />
                          <span>Revisar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onEliminarUno(item)}
                          className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Eliminar registro"
                          aria-label={`Eliminar ${item.codigoPago}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3.5 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <p className="text-slate-500">
          Mostrando <strong className="text-slate-700">{inicioIdx}</strong> a{" "}
          <strong className="text-slate-700">{finIdx}</strong> de{" "}
          <strong className="text-slate-700">{totalFiltrados}</strong> registros
        </p>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={paginaActual <= 1}
            onClick={() => onCambiarPagina(paginaActual - 1)}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition-colors cursor-pointer"
            aria-label="Página anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => onCambiarPagina(num)}
              className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                paginaActual === num
                  ? "bg-[#111c38] text-amber-400"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {num}
            </button>
          ))}

          <button
            type="button"
            disabled={paginaActual >= totalPaginas}
            onClick={() => onCambiarPagina(paginaActual + 1)}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition-colors cursor-pointer"
            aria-label="Página siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}