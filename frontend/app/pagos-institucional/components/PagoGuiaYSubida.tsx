"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Copy,
  Check,
  UploadCloud,
  AlertTriangle,
  Clock,
  FileImage,
  Loader2,
  CheckCircle2,
  X,
} from "lucide-react";
import type { DatosMatriculaPago, EstadoPagoData } from "../page";

interface PagoGuiaYSubidaProps {
  apiUrl: string;
  codigoPago: string;
  passwordPago: string;
  pago: EstadoPagoData;
  matricula: DatosMatriculaPago;
  onVoucherEnviado: () => Promise<void>;
}

type MedioPago = "BCP" | "Caja Huancayo" | "Yape";

const DURACION_ALERTA_MS = 5000;

const CANALES_INSTITUCIONALES = [
  {
    entidad: "BCP - Cuenta Corriente Soles",
    titular: "I.E.P. Colegio Cayros",
    numero: "194-2849102-0-45",
    cci: "00219400284910204591",
  },
  {
    entidad: "Caja Huancayo - Cuenta Institucional",
    titular: "I.E.P. Colegio Cayros",
    numero: "107-202-0019482710",
    cci: "80810720200194827104",
  },
  {
    entidad: "Yape - Pago Directo",
    titular: "I.E.P. Colegio Cayros",
    numero: "976 553 434",
    cci: null,
  },
];

export default function PagoGuiaYSubida({
  apiUrl,
  codigoPago,
  passwordPago,
  pago,
  matricula,
  onVoucherEnviado,
}: PagoGuiaYSubidaProps) {
  const [cuentaCopiada, setCuentaCopiada] = useState<string | null>(null);
  const [medioPago, setMedioPago] = useState<MedioPago>("BCP");
  const [numeroOperacion, setNumeroOperacion] = useState("");
  const [montoPagado, setMontoPagado] = useState("");
  const [voucherBase64, setVoucherBase64] = useState<string | null>(null);
  const [nombreArchivo, setNombreArchivo] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [progresoError, setProgresoError] = useState(100);
  const [exitoMsg, setExitoMsg] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const mostrarErrorConBarra = (mensaje: string) => {
    setErrorMsg(mensaje);
    setProgresoError(100);
  };

  useEffect(() => {
    if (!errorMsg) return;

    const inicio = Date.now();
    const intervalo = setInterval(() => {
      const transcurrido = Date.now() - inicio;
      const restante = Math.max(0, 100 - (transcurrido / DURACION_ALERTA_MS) * 100);
      setProgresoError(restante);

      if (transcurrido >= DURACION_ALERTA_MS) {
        clearInterval(intervalo);
        setErrorMsg(null);
      }
    }, 50);

    return () => clearInterval(intervalo);
  }, [errorMsg]);

  const copiarTexto = async (texto: string, clave: string) => {
    try {
      await navigator.clipboard.writeText(texto);
      setCuentaCopiada(clave);
      setTimeout(() => setCuentaCopiada(null), 2000);
    } catch {
      mostrarErrorConBarra(
        "No se pudo copiar automáticamente. Selecciona y copia el número manualmente."
      );
    }
  };

  const handleArchivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const tiposPermitidos = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!tiposPermitidos.includes(file.type)) {
      mostrarErrorConBarra("Solo se permiten imágenes en formato JPG, PNG o WEBP.");
      return;
    }

    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      mostrarErrorConBarra("La captura del voucher no debe superar los 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setVoucherBase64(reader.result);
        setNombreArchivo(file.name);
      }
    };
    reader.onerror = () => {
      mostrarErrorConBarra("Error al leer la imagen seleccionada. Intenta con otra captura.");
    };
    reader.readAsDataURL(file);
  };

  const limpiarImagen = () => {
    setVoucherBase64(null);
    setNombreArchivo(null);
  };

  const handleSubmitVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setExitoMsg(null);

    if (!medioPago) {
      mostrarErrorConBarra("Selecciona el medio de pago utilizado.");
      return;
    }

    if (!numeroOperacion.trim()) {
      mostrarErrorConBarra("Ingresa el número de operación o referencia de tu comprobante.");
      return;
    }

    const montoNum = Number(montoPagado);
    if (!montoPagado.trim() || Number.isNaN(montoNum) || montoNum <= 0) {
      mostrarErrorConBarra("Ingresa el monto pagado (incluyendo comisión si aplica).");
      return;
    }

    if (!voucherBase64) {
      mostrarErrorConBarra("Debes adjuntar una captura legible del voucher o comprobante de pago.");
      return;
    }

    setEnviando(true);
    try {
      const response = await fetch(`${apiUrl}/api/pagos-matricula/subir-voucher`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigoPago,
          passwordPago,
          voucherUrl: voucherBase64,
          numeroOperacion: numeroOperacion.trim(),
          bancoOrigen: medioPago,
          montoPagado: montoNum,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        mostrarErrorConBarra(data.error || "No se pudo enviar el comprobante de pago.");
        return;
      }

      setExitoMsg(
        data.message ||
          "Comprobante enviado correctamente. Tu ID ha quedado cerrado temporalmente mientras administración valida el abono."
      );
      setVoucherBase64(null);
      setNombreArchivo(null);
      setNumeroOperacion("");
      setMontoPagado("");
      await onVoucherEnviado();
    } catch (error) {
      console.error("Error al enviar voucher:", error);
      mostrarErrorConBarra("Error de conexión al enviar tu comprobante. Inténtalo de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  const fechaLimiteFormateada = pago.habilitadoHasta
    ? new Date(pago.habilitadoHasta).toLocaleString("es-PE", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  return (
    <div className="space-y-6">
      {pago.estado === "OBSERVADO_RECHAZADO" && (
        <div className="bg-amber-50 border border-amber-300 rounded-3xl p-5 sm:p-6 space-y-3 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-base sm:text-lg font-bold font-['Poppins',sans-serif] text-amber-950">
                  Comprobante Observado — Reenvío Habilitado por 48 Horas
                </h2>
                {fechaLimiteFormateada && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-200/80 text-amber-950 px-3 py-1 rounded-full">
                    <Clock className="w-3.5 h-3.5" />
                    Vence: {fechaLimiteFormateada}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                <strong>Motivo indicado por administración:</strong>{" "}
                {pago.mensajeAdmin ||
                  "Se requiere una nueva captura legible o verificación de los datos del comprobante."}
              </p>
            </div>
          </div>
        </div>
      )}

      {exitoMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-3xl p-5 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm font-medium">{exitoMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 bg-[#111c38] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-[#111c38] flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-400 block">
                Paso 1 · Guía de Pago
              </span>
              <h2 className="text-lg sm:text-xl font-bold font-['Poppins',sans-serif]">
                BCP, Caja Huancayo y Yape
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            {CANALES_INSTITUCIONALES.map((canal, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-amber-400 text-sm">{canal.entidad}</span>
                  <span className="text-[11px] text-slate-300">{canal.titular}</span>
                </div>

                <div className="flex items-center justify-between gap-2 bg-black/20 px-3 py-2 rounded-xl">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                      {canal.cci ? "Número de cuenta" : "Número / Yape"}
                    </span>
                    <span className="font-mono font-semibold text-white text-xs sm:text-sm">
                      {canal.numero}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copiarTexto(canal.numero, `num-${idx}`)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-amber-400 hover:text-[#111c38] text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    {cuentaCopiada === `num-${idx}` ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>

                {canal.cci && (
                  <div className="flex items-center justify-between gap-2 bg-black/20 px-3 py-2 rounded-xl">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                        CCI Interbancario
                      </span>
                      <span className="font-mono font-semibold text-slate-200 text-xs">
                        {canal.cci}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copiarTexto(canal.cci!, `cci-${idx}`)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-amber-400 hover:text-[#111c38] text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      {cuentaCopiada === `cci-${idx}` ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-amber-400/10 border border-amber-400/30 rounded-2xl p-4 space-y-2 text-xs text-slate-200 leading-relaxed">
            <p className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
              Recomendaciones antes de subir tu voucher
            </p>
            <p>
              - En pagos por <strong>Yape</strong>, coloca en la descripción/mensaje el DNI del
              estudiante (ejemplo: <strong className="text-white font-mono">xxxxxxx</strong>) y
              registra el N° de operación / referencia (hasta 8 dígitos; si figura de 7 dígitos,
              igualmente es válido).
            </p>
            <p>
              - En pagos por <strong>BCP</strong> o <strong>Caja Huancayo</strong>, ingresa el{" "}
              <strong className="text-white">N° de operación</strong> (máx. 8 dígitos) y como
              referencia puedes usar el código{" "}
              <strong className="text-white font-mono">PAG-CAYXXXX-XXXXX</strong> o el DNI{" "}
              <strong className="text-white font-mono">xxxxxxx</strong>.
            </p>
            <p>
              - Recuerda que si el medio o banco cobra comisión, debes{" "}
              <strong className="text-white">sumarla al monto base</strong> (por ejemplo: si tu monto
              es <strong className="text-white font-mono">250.00</strong> + comisión, registra el
              total abonado).
            </p>
            <p>
              - Al enviar el comprobante, el ID pasará a{" "}
              <strong className="text-white">EN REVISIÓN</strong> y se cerrará temporalmente mientras
              administración valida el pago.
            </p>
          </div>
        </div>

        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/70 space-y-6">
          <div className="border-b border-slate-100 pb-4 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-600 block">
              Paso 2 · Registro de Comprobante
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-['Poppins',sans-serif] text-[#111c38]">
              Subir Captura del Voucher
            </h2>
            <p className="text-xs text-slate-500">
              Todos los campos son obligatorios para el alumno{" "}
              <strong className="text-slate-700">
                {matricula.nombresEstudiante} {matricula.apellidosEstudiante}
              </strong>
              .
            </p>
          </div>

          <form onSubmit={handleSubmitVoucher} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="medioPago"
                  className="block text-xs font-bold text-[#111c38] uppercase tracking-wider"
                >
                  Medio de Pago *
                </label>
                <select
                  id="medioPago"
                  required
                  value={medioPago}
                  onChange={(e) => {
                    const nuevoMedio = e.target.value as MedioPago;
                    setMedioPago(nuevoMedio);
                    setErrorMsg(null);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-sm font-medium text-[#111c38] focus:outline-none focus:bg-white focus:border-[#16275d]"
                >
                  <option value="BCP">BCP</option>
                  <option value="Caja Huancayo">Caja Huancayo</option>
                  <option value="Yape">Yape</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="numeroOperacion"
                  className="block text-xs font-bold text-[#111c38] uppercase tracking-wider"
                >
                  N° de Operación / Referencia *
                </label>
                <input
                  id="numeroOperacion"
                  type="text"
                  required
                  maxLength={8}
                  value={numeroOperacion}
                  onChange={(e) => setNumeroOperacion(e.target.value)}
                  placeholder="Hasta 8 dígitos (ej. 0482910)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-sm font-mono text-[#111c38] placeholder:font-sans placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#16275d]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="montoPagado"
                className="block text-xs font-bold text-[#111c38] uppercase tracking-wider"
              >
                Monto Pagado (S/) *{" "}
                <span className="text-amber-700 font-semibold normal-case">
                  (incluir comisión)
                </span>
              </label>
              <input
                id="montoPagado"
                type="number"
                required
                step="0.01"
                min="0.01"
                value={montoPagado}
                onChange={(e) => setMontoPagado(e.target.value)}
                placeholder="250.00"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-sm text-[#111c38] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#16275d]"
              />
              <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200/80 rounded-xl px-3 py-2 leading-snug">
                <strong>Importante:</strong> Debes incluir la comisión en el monto total (por
                ejemplo: monto base <strong className="font-mono">250.00</strong> + comisión
                aplicada).
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#111c38] uppercase tracking-wider">
                Captura del Voucher (JPG, PNG o WEBP) *
              </label>

              {!voucherBase64 ? (
                <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-slate-300 hover:border-[#16275d] rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer text-center">
                  <UploadCloud className="w-8 h-8 text-[#16275d]" />
                  <span className="text-xs font-bold text-[#111c38]">
                    Haz clic para seleccionar la captura del voucher
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Tamaño máximo 5 MB · Formatos JPG, PNG, WEBP
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={handleArchivoChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileImage className="w-4 h-4 text-[#16275d] shrink-0" />
                      <span className="text-xs font-semibold text-slate-700 truncate">
                        {nombreArchivo || "Voucher seleccionado"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={limpiarImagen}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      aria-label="Quitar imagen"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="max-h-64 overflow-hidden rounded-xl border border-slate-200 bg-white flex justify-center">
                    <img
                      src={voucherBase64}
                      alt="Vista previa del voucher"
                      className="max-h-64 object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="w-full py-3.5 px-6 rounded-xl bg-[#111c38] hover:bg-[#16275d] disabled:opacity-60 text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 shadow-md cursor-pointer disabled:cursor-not-allowed"
            >
              {enviando ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Enviando comprobante...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4 text-amber-400" />
                  <span>Enviar Voucher y Cerrar ID para Revisión</span>
                </>
              )}
            </button>

            {errorMsg && (
              <div
                role="alert"
                className="rounded-2xl bg-red-50 border border-red-200 text-red-700 overflow-hidden"
              >
                <div className="p-3.5 flex items-center justify-between gap-2 text-xs font-medium">
                  <span>{errorMsg}</span>
                  <button
                    type="button"
                    onClick={() => setErrorMsg(null)}
                    className="p-1 rounded-lg hover:bg-red-100 text-red-600 cursor-pointer shrink-0"
                    aria-label="Cerrar alerta"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div
                  role="progressbar"
                  aria-valuenow={Math.round(progresoError)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="h-1 w-full bg-red-100"
                >
                  <div
                    className="h-full bg-red-600 transition-none"
                    style={{ width: `${progresoError}%` }}
                  />
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}