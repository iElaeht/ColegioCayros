"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  KeyRound,
  Lock,
  CreditCard,
  ArrowRight,
  UserPlus,
} from "lucide-react";

interface CredencialesConsultadas {
  codigoPago: string;
  passwordPago: string;
  estado?: string;
}

interface ConsultarCredencialesFormProps {
  onIrAMatricula?: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function ConsultarCredencialesForm({
  onIrAMatricula,
}: ConsultarCredencialesFormProps) {
  const router = useRouter();

  const [nombresEstudiante, setNombresEstudiante] = useState("");
  const [apellidosEstudiante, setApellidosEstudiante] = useState("");
  const [dniEstudiante, setDniEstudiante] = useState("");

  const [credenciales, setCredenciales] = useState<CredencialesConsultadas | null>(null);
  const [noMatriculado, setNoMatriculado] = useState(false);
  const [copiadoCampo, setCopiadoCampo] = useState<"codigo" | "password" | null>(null);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [toastProgress, setToastProgress] = useState(100);
  const toastDuration = 7000;

  useEffect(() => {
    if (!toast) return;

    const intervalTime = 100;
    const decrement = (intervalTime / toastDuration) * 100;
    setToastProgress(100);

    const timer = setInterval(() => {
      setToastProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          setToast(null);
          return 100;
        }
        return prev - decrement;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [toast]);

  const handleDniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, "").slice(0, 8);
    setDniEstudiante(numericValue);
    setNoMatriculado(false);
  };

  const handleConsultar = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);
    setNoMatriculado(false);
    setCredenciales(null);

    if (!nombresEstudiante.trim()) {
      setToast({ type: "error", message: "Falta rellenar el campo 'Nombres del Estudiante'." });
      return;
    }
    if (!apellidosEstudiante.trim()) {
      setToast({ type: "error", message: "Falta rellenar el campo 'Apellidos del Estudiante'." });
      return;
    }
    if (!/^\d{8}$/.test(dniEstudiante)) {
      setToast({
        type: "error",
        message: "El campo 'DNI del Estudiante' debe contener exactamente 8 dígitos numéricos.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/matricula-inscripcion/consultar-credenciales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombresEstudiante: nombresEstudiante.trim().toUpperCase(),
          apellidosEstudiante: apellidosEstudiante.trim().toUpperCase(),
          dniEstudiante,
        }),
      });

      const data = await res.json();

      if (res.ok && data?.encontrado && data?.credencialesPago) {
        setCredenciales(data.credencialesPago);
      } else {
        setNoMatriculado(true);
        setToast({
          type: "error",
          message:
            data?.message ||
            "No estás Matriculado, Matricúlate para ser Parte de esta gran Familia Cayrina.",
        });
      }
    } catch {
      setToast({ type: "error", message: "Error de red al conectar con el servidor." });
    } finally {
      setLoading(false);
    }
  };

  const copiarAlPortapapeles = async (texto: string, tipo: "codigo" | "password") => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiadoCampo(tipo);
      setTimeout(() => {
        setCopiadoCampo((prev) => (prev === tipo ? null : prev));
      }, 2000);
    } catch {
      setToast({
        type: "error",
        message: "No se pudo copiar automáticamente. Cópialo de forma manual.",
      });
    }
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6 sm:p-8 relative overflow-hidden">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-1.5 h-6 rounded-full bg-[#16275D]" />
        <h2 className="text-xl font-bold text-slate-900">Consultar Credenciales de Pago</h2>
      </div>
      <p className="text-xs text-slate-500 mb-6 pl-4">
        Ingresa los nombres, apellidos y DNI del estudiante exactamente como fueron registrados.
      </p>

      <form onSubmit={handleConsultar} className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Nombres del Estudiante
          </label>
          <input
            type="text"
            value={nombresEstudiante}
            onChange={(e) => {
              setNombresEstudiante(e.target.value.toUpperCase());
              setNoMatriculado(false);
            }}
            required
            placeholder="JESUS SMITH"
            className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none font-medium uppercase"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Apellidos del Estudiante
          </label>
          <input
            type="text"
            value={apellidosEstudiante}
            onChange={(e) => {
              setApellidosEstudiante(e.target.value.toUpperCase());
              setNoMatriculado(false);
            }}
            required
            placeholder="PÉREZ GÓMEZ"
            className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none font-medium uppercase"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            DNI del Estudiante (8 dígitos)
          </label>
          <input
            type="text"
            maxLength={8}
            value={dniEstudiante}
            onChange={handleDniChange}
            required
            placeholder="XXXXXXXX"
            className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none font-medium"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="py-2.5 px-6 rounded-xl text-xs font-bold bg-[#16275D] hover:bg-blue-900 disabled:opacity-60 text-white transition-all shadow-md cursor-pointer flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Buscando...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4 text-amber-400" />
                <span>Consultar Credenciales</span>
              </>
            )}
          </button>
        </div>
      </form>

      {credenciales && (
        <div className="mt-6 space-y-4 animate-in fade-in duration-300">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-bold text-emerald-950">
                ¡Estudiante encontrado en el sistema!
              </p>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Aquí tienes tus credenciales de acceso vinculadas a tu matrícula.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3.5">
            <div className="flex items-center justify-between gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <KeyRound className="w-3 h-3 text-[#16275D]" /> ID Único para Pagos
                </span>
                <p className="font-mono font-bold text-xs sm:text-sm text-[#111c38] truncate">
                  {credenciales.codigoPago}
                </p>
              </div>
              <button
                type="button"
                onClick={() => copiarAlPortapapeles(credenciales.codigoPago, "codigo")}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#16275D] hover:text-white text-slate-700 text-[11px] font-bold transition-colors cursor-pointer shrink-0"
              >
                {copiadoCampo === "codigo" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
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

            <div className="flex items-center justify-between gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-[#16275D]" /> Contraseña del Trámite
                </span>
                <p className="font-mono font-bold text-xs sm:text-sm text-[#111c38] truncate">
                  {credenciales.passwordPago}
                </p>
              </div>
              <button
                type="button"
                onClick={() => copiarAlPortapapeles(credenciales.passwordPago, "password")}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#16275D] hover:text-white text-slate-700 text-[11px] font-bold transition-colors cursor-pointer shrink-0"
              >
                {copiadoCampo === "password" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
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
          </div>

          <div className="bg-amber-50 border border-amber-300/90 rounded-2xl p-4 space-y-1 text-xs text-amber-950">
            <p className="font-bold text-amber-900">Nota importante</p>
            <p className="leading-relaxed">
              Es necesario que recuerdes y guardes tus <strong>Datos para Pagos</strong> (ID Único y
              Contraseña) para ingresar a <strong>Pagos Institucional</strong> y gestionar tu
              comprobante.
            </p>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => router.push("/pagos-institucional")}
              className="py-2.5 px-5 rounded-xl text-xs font-bold bg-[#16275D] hover:bg-blue-900 text-white transition-all shadow-sm cursor-pointer flex items-center gap-2"
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              <span>Ir a Pagos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div
          className={`mt-4 rounded-xl overflow-hidden transition-all duration-300 border ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          <div className="p-4 flex items-start gap-3 text-xs font-semibold">
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            )}
            <div className="space-y-2">
              <span>{toast.message}</span>
              {noMatriculado && onIrAMatricula && (
                <div>
                  <button
                    type="button"
                    onClick={onIrAMatricula}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16275D] hover:bg-blue-900 text-white text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ir a Matricularme</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div
            className={`w-full h-1.5 ${
              toast.type === "success" ? "bg-emerald-200" : "bg-rose-200"
            }`}
          >
            <div
              className={`h-full transition-all duration-100 ease-linear ${
                toast.type === "success" ? "bg-emerald-600" : "bg-rose-600"
              }`}
              style={{ width: `${toastProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}