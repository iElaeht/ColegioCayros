"use client";

import React from "react";
import {
  CheckCircle2,
  Clock,
  Lock,
  AlertCircle,
  UserCheck,
  Receipt,
} from "lucide-react";
import type { DatosMatriculaPago, EstadoPagoData } from "../page";

interface PagoEstadoVistaProps {
  pago: EstadoPagoData;
  matricula: DatosMatriculaPago;
  onCerrarSesion?: () => void;
}

export default function PagoEstadoVista({
  pago,
  matricula,
}: PagoEstadoVistaProps) {
  const fechaSubidaFormateada = pago.fechaSubidaVoucher
    ? new Date(pago.fechaSubidaVoucher).toLocaleString("es-PE", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  const fechaRevisionFormateada = pago.fechaRevision
    ? new Date(pago.fechaRevision).toLocaleString("es-PE", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

if (pago.estado === "CONFIRMADO") {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-slate-100 pb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <span className="inline-block text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Pago Confirmado · ID {pago.codigoPago}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Poppins',sans-serif] text-[#111c38]">
              ¡Bienvenido a la Familia Cayrina!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Estudiante:{" "}
              <strong className="text-slate-800">
                {matricula.nombresEstudiante} {matricula.apellidosEstudiante}
              </strong>{" "}
              · DNI <strong className="text-slate-800">{matricula.dniEstudiante}</strong>
            </p>
          </div>
        </div>

        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 sm:p-6 space-y-2">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
            <UserCheck className="w-4 h-4 text-emerald-700" />
            <span>Confirmación de Administración</span>
          </div>
          <p className="text-sm sm:text-base text-emerald-950 leading-relaxed font-medium">
            {pago.mensajeAdmin ||
              "¡Muchas gracias por confiar en nosotros! Tu pago ha sido confirmado y damos una cordial bienvenida a la Familia Cayrina."}
          </p>
          {fechaRevisionFormateada && (
            <p className="text-[11px] text-emerald-800/80 pt-1">
              Confirmado el {fechaRevisionFormateada}
            </p>
          )}
        </div>

        <p className="text-xs text-slate-500 pt-2">
          Gracias por acompañarnos en este proceso. Si necesitas consultar otro estudiante, puedes
          hacerlo desde el botón superior.
        </p>
      </div>
    );
  }

  if (pago.estado === "OBSERVADO_RECHAZADO" && pago.plazoVencido) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-red-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-slate-100 pb-6">
          <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <span className="inline-block text-[10px] font-extrabold uppercase tracking-[0.2em] text-red-700 bg-red-50 px-3 py-1 rounded-full">
              Plazo de 48 Horas Vencido
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-['Poppins',sans-serif] text-[#111c38]">
              Reenvío de Comprobante Cerrado
            </h2>
            <p className="text-xs text-slate-500">
              {pago.motivoBloqueo ||
                "El plazo de 48 horas habilitado para corregir el comprobante ha finalizado."}
            </p>
          </div>
        </div>

        {pago.mensajeAdmin && (
          <div className="bg-red-50/70 border border-red-200 rounded-2xl p-4 space-y-1 text-xs sm:text-sm text-red-950">
            <span className="font-bold block text-xs uppercase tracking-wider text-red-800">
              Última observación registrada:
            </span>
            <p>{pago.mensajeAdmin}</p>
          </div>
        )}

        <p className="text-xs text-slate-500">
          Comunícate con administración del Colegio Cayros indicando tu código{" "}
          <strong className="font-mono text-slate-700">{pago.codigoPago}</strong> para recibir asistencia.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-slate-100 pb-6">
        <div className="w-14 h-14 rounded-2xl bg-[#111c38] text-amber-400 flex items-center justify-center shrink-0">
          {pago.estado === "EN_REVISION" ? (
            <Clock className="w-7 h-7" />
          ) : (
            <Lock className="w-7 h-7" />
          )}
        </div>
        <div className="space-y-1">
          <span className="inline-block text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
            ID Cerrado Temporalmente · {pago.codigoPago}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-['Poppins',sans-serif] text-[#111c38]">
            {pago.estado === "EN_REVISION"
              ? "Comprobante en Revisión por Administración"
              : "Trámite en Seguimiento"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {pago.motivoBloqueo ||
              "Tu comprobante ya fue registrado y este ID permanece cerrado mientras se realiza la verificación."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50/80 border border-slate-200/70 rounded-2xl p-4 text-xs">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Receipt className="w-3.5 h-3.5" /> N° de Operación
          </span>
          <p className="font-mono font-bold text-[#111c38] text-sm">
            {pago.numeroOperacion || "No especificado"}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
            Banco / Canal
          </span>
          <p className="font-semibold text-slate-800 text-sm">
            {pago.bancoOrigen || "No especificado"}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
            Fecha de Envío
          </span>
          <p className="font-semibold text-slate-800 text-sm">
            {fechaSubidaFormateada || "Registrado"}
          </p>
        </div>
      </div>

      {pago.mensajeAdmin && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs sm:text-sm text-slate-700">
          <strong className="text-[#111c38]">Nota de administración:</strong> {pago.mensajeAdmin}
        </div>
      )}

      <p className="text-xs text-slate-500 pt-2">
        Si el pago requiere alguna corrección, administración habilitará tu ID por 48 horas con el motivo detallado.
      </p>
    </div>
  );
}