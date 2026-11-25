"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, CheckCircle2, AlertTriangle, Save, Loader2, ExternalLink, Lock } from "lucide-react";
import type { RegistroPagoAdmin } from "./PagosTabla";

interface PagoRevisionModalProps {
  apiUrl: string;
  pago: RegistroPagoAdmin | null;
  onClose: () => void;
  onGuardado: (pagoActualizado: RegistroPagoAdmin) => void;
}

const MENSAJE_BASE_CONFIRMADO =
  "Tu pago ha sido validado correctamente. Tu matrícula continúa en proceso de confirmación por Coordinación. Gracias por tu confianza.";

const MENSAJE_BASE_OBSERVADO =
  "El comprobante presenta observaciones. Por favor verifica los datos o adjunta una captura clara dentro de las próximas 48 horas.";

const MENSAJE_BASE_COMPLETADO =
  "Pago y matrícula confirmados. ¡Bienvenido a la Familia Cayrina! Muchas gracias por confiar en nosotros. Este trámite queda cerrado: el registro se conserva en el sistema y su ID no se elimina, pero para un próximo año o nuevo proceso deberá habilitarse o generarse nuevamente.";

function getMensajePorEstado(estado: RegistroPagoAdmin["estado"]): string {
  if (estado === "CONFIRMADO") return MENSAJE_BASE_CONFIRMADO;
  if (estado === "OBSERVADO_RECHAZADO") return MENSAJE_BASE_OBSERVADO;
  if (estado === "COMPLETADO") return MENSAJE_BASE_COMPLETADO;
  return "";
}

export default function PagoRevisionModal({
  apiUrl,
  pago,
  onClose,
  onGuardado,
}: PagoRevisionModalProps) {
  const [estado, setEstado] = useState<RegistroPagoAdmin["estado"]>("CONFIRMADO");
  const [mensajeAdmin, setMensajeAdmin] = useState("");
  const [revisadoPor, setRevisadoPor] = useState("Coordinación / Administración");
  const [guardando, setGuardando] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const esCargaInicialRef = useRef(true);

  useEffect(() => {
    if (!pago) return;
    const estadoInicial: RegistroPagoAdmin["estado"] =
      pago.estado === "EN_REVISION" ? "CONFIRMADO" : pago.estado;

    esCargaInicialRef.current = true;
    setEstado(estadoInicial);
    setMensajeAdmin(pago.mensajeAdmin || getMensajePorEstado(estadoInicial));
    setRevisadoPor(pago.revisadoPor || "Coordinación / Administración");
    setErrorMsg(null);
  }, [pago]);

  useEffect(() => {
    if (!pago) return;
    if (esCargaInicialRef.current) {
      esCargaInicialRef.current = false;
      return;
    }
    setMensajeAdmin(getMensajePorEstado(estado));
  }, [estado, pago]);

  useEffect(() => {
    if (!pago) return;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !guardando) {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow || "unset";
      document.body.style.paddingRight = prevPaddingRight || "0px";
    };
  }, [pago, guardando, onClose]);

  if (!pago) return null;

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (estado === "OBSERVADO_RECHAZADO" && !mensajeAdmin.trim()) {
      setErrorMsg("Indica el motivo de observación/rechazo para que el apoderado sepa qué corregir.");
      return;
    }

    setGuardando(true);
    try {
      const res = await fetch(`${apiUrl}/api/pagos-matricula/${pago.id}/estado`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estado,
          mensajeAdmin: mensajeAdmin.trim(),
          revisadoPor: revisadoPor.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "No se pudo actualizar el estado del pago.");
        return;
      }

      onGuardado(data.data);
      onClose();
    } catch {
      setErrorMsg("Error de red al guardar la revisión.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[99999] overflow-y-auto bg-slate-950/65 backdrop-blur-md flex min-h-full items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !guardando) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto">
        <div className="px-6 py-4 bg-[#111c38] text-white flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-400 block">
              Revisión de Comprobante · {pago.codigoPago}
            </span>
            <h2 className="text-lg font-bold font-['Poppins',sans-serif]">
              {pago.matricula.nombresEstudiante} {pago.matricula.apellidosEstudiante}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={guardando}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[82vh] overflow-y-auto">
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
              <p className="font-bold text-[#111c38] uppercase tracking-wider text-[11px]">
                Datos del Trámite
              </p>
              <p>
                <strong>DNI Estudiante:</strong> {pago.matricula.dniEstudiante}
              </p>
              <p>
                <strong>Nivel / Grado:</strong> {pago.matricula.nivel} · {pago.matricula.grado} (
                {pago.matricula.sede})
              </p>
              <p>
                <strong>Apoderado:</strong> {pago.matricula.nombresApoderado} · Tel:{" "}
                {pago.matricula.telefono}
              </p>
              <p>
                <strong>Banco / N° Operación:</strong> {pago.bancoOrigen || "—"} ·{" "}
                <span className="font-mono">{pago.numeroOperacion || "—"}</span>
              </p>
              <p>
                <strong>Monto declarado:</strong>{" "}
                {pago.montoPagado ? `S/ ${Number(pago.montoPagado).toFixed(2)}` : "No especificado"}
              </p>
            </div>

            <div className="border border-slate-200 rounded-2xl p-3 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Captura del Voucher</span>
                {pago.voucherUrl && (
                  <a
                    href={pago.voucherUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[#16275d] hover:underline"
                  >
                    <span>Abrir</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {pago.voucherUrl ? (
                <div className="rounded-xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center min-h-[220px] max-h-[340px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pago.voucherUrl}
                    alt={`Voucher ${pago.codigoPago}`}
                    className="max-h-[330px] object-contain"
                  />
                </div>
              ) : (
                <div className="min-h-[200px] flex items-center justify-center text-xs text-slate-400 italic bg-white rounded-xl border border-slate-200">
                  El apoderado aún no ha subido ningún comprobante.
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleGuardar} className="lg:col-span-6 space-y-4">
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#111c38] uppercase tracking-wider">
                Resolución del Pago
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value as RegistroPagoAdmin["estado"])}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-[#111c38] focus:outline-none focus:bg-white focus:border-[#16275d]"
              >
                <option value="CONFIRMADO">
                  CONFIRMADO (Aprobado — muestra mensaje de confirmación)
                </option>
                <option value="OBSERVADO_RECHAZADO">
                  OBSERVADO / RECHAZADO (Habilita 48h para reenviar)
                </option>
                <option value="EN_REVISION">EN REVISIÓN (Mantiene ID abierto)</option>
                <option value="PENDIENTE_SUBIDA">
                  PENDIENTE SUBIDA (Habilita subida sin límite de 48h)
                </option>
                <option value="COMPLETADO">COMPLETADO (Trámite cerrado)</option>
              </select>
            </div>

            {estado === "OBSERVADO_RECHAZADO" && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Al marcar como <strong>OBSERVADO / RECHAZADO</strong>, se abrirá automáticamente
                  una ventana de <strong>48 horas</strong> para que el apoderado suba un nuevo
                  comprobante y verá el mensaje del cuadro inferior.
                </span>
              </div>
            )}

            {estado === "CONFIRMADO" && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Al marcar como <strong>CONFIRMADO</strong>, el portal del padre mostrará
                  directamente el mensaje de aprobación sin pasos de pago.
                </span>
              </div>
            )}

            {estado === "COMPLETADO" && (
              <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-300 text-slate-900 text-xs flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                <span>
                  Al marcar como <strong>COMPLETADO</strong>, el trámite queda cerrado: el registro
                  se conserva en el sistema y su ID no se elimina, pero para un próximo año o
                  nuevo proceso deberá habilitarse o generarse nuevamente.
                </span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#111c38] uppercase tracking-wider">
                Mensaje para el Apoderado (Editable){" "}
                {estado === "OBSERVADO_RECHAZADO" && <span className="text-rose-600">*</span>}
              </label>
              <textarea
                rows={5}
                value={mensajeAdmin}
                onChange={(e) => setMensajeAdmin(e.target.value)}
                placeholder="Escribe o ajusta aquí el mensaje que verá el apoderado..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-[#111c38] focus:outline-none focus:bg-white focus:border-[#16275d] resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#111c38] uppercase tracking-wider">
                Revisado por
              </label>
              <input
                type="text"
                value={revisadoPor}
                onChange={(e) => setRevisadoPor(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-[#111c38] focus:outline-none focus:bg-white focus:border-[#16275d]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                disabled={guardando}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={guardando}
                className="px-5 py-2.5 rounded-xl bg-[#111c38] hover:bg-[#16275d] disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                {guardando ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-amber-400" />
                    <span>Guardar Resolución</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}