"use client";

import React, { useState } from "react";
import { KeyRound, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import type { SesionPagoActiva } from "../page";

interface PagoLoginFormProps {
  apiUrl: string;
  onLoginSuccess: (sesion: SesionPagoActiva) => void;
}

export default function PagoLoginForm({ apiUrl, onLoginSuccess }: PagoLoginFormProps) {
  const [codigoPago, setCodigoPago] = useState("");
  const [passwordPago, setPasswordPago] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const codigoLimpio = codigoPago.trim().toUpperCase();
    const passwordLimpia = passwordPago.trim().toUpperCase();

    if (!codigoLimpio || !passwordLimpia) {
      setErrorMsg("Por favor ingresa tanto tu ID único de pago como tu contraseña.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/pagos-matricula/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigoPago: codigoLimpio,
          passwordPago: passwordLimpia,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || "No se pudo validar el acceso. Revisa tus credenciales.");
        return;
      }

      onLoginSuccess({
        codigoPago: codigoLimpio,
        passwordPago: passwordLimpia,
        pago: data.pago,
        matricula: data.matricula,
      });
    } catch (error) {
      console.error("Error al iniciar sesión en pagos-institucional:", error);
      setErrorMsg("No se pudo conectar con el servidor. Inténtalo nuevamente en unos segundos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMsg && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <label
          htmlFor="codigoPago"
          className="block text-xs font-bold text-[#111c38] uppercase tracking-wider"
        >
          ID Único de Pago
        </label>
        <div className="relative">
          <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="codigoPago"
            type="text"
            value={codigoPago}
            onChange={(e) => {
              setCodigoPago(e.target.value.toUpperCase());
              if (errorMsg) setErrorMsg(null);
            }}
            placeholder="PAG-XXXXXXX-XXXXX"
            autoComplete="username"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/60 text-sm font-mono font-semibold text-[#111c38] placeholder:text-slate-400 placeholder:font-sans placeholder:font-normal focus:outline-none focus:bg-white focus:border-[#16275d] focus:ring-2 focus:ring-[#16275d]/10 transition-all"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="passwordPago"
          className="block text-xs font-bold text-[#111c38] uppercase tracking-wider"
        >
          Contraseña del Trámite
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="passwordPago"
            type={mostrarPassword ? "text" : "password"}
            value={passwordPago}
            onChange={(e) => {
              setPasswordPago(e.target.value.toUpperCase());
              if (errorMsg) setErrorMsg(null);
            }}
            placeholder="Ingresa tu contraseña de pago"
            autoComplete="current-password"
            className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 bg-slate-50/60 text-sm font-mono font-semibold text-[#111c38] placeholder:text-slate-400 placeholder:font-sans placeholder:font-normal focus:outline-none focus:bg-white focus:border-[#16275d] focus:ring-2 focus:ring-[#16275d]/10 transition-all"
          />
          <button
            type="button"
            onClick={() => setMostrarPassword((prev) => !prev)}
            aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#111c38] hover:bg-slate-100 absolute right-2 top-1/2 -translate-y-1/2 transition-colors cursor-pointer"
          >
            {mostrarPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 px-6 rounded-xl bg-[#111c38] hover:bg-[#16275d] disabled:opacity-60 text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 shadow-md cursor-pointer disabled:cursor-not-allowed group"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            <span>Validando acceso...</span>
          </>
        ) : (
          <>
            <span>Ingresar al Portal de Pago</span>
            <ArrowRight className="w-4 h-4 text-amber-400 transition-transform duration-200 group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  );
}