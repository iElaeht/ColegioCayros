"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  Info,
  LogOut,
  Users,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import PagoLoginForm from "./components/PagoLoginForm";
import PagoGuiaYSubida from "./components/PagoGuiaYSubida";
import PagoEstadoVista from "./components/PagoEstadoVista";

export interface DatosMatriculaPago {
  id: number;
  sede: string;
  nombresEstudiante: string;
  apellidosEstudiante: string;
  dniEstudiante: string;
  nivel: string;
  grado: string;
  nombresApoderado: string;
}

export interface EstadoPagoData {
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
  puedeSubir: boolean;
  plazoVencido: boolean;
  motivoBloqueo: string | null;
  mensajeAdmin: string | null;
  numeroOperacion: string | null;
  bancoOrigen: string | null;
  montoPagado: string | number | null;
  voucherUrl: string | null;
  fechaSubidaVoucher: string | null;
  fechaRevision: string | null;
}

export interface SesionPagoActiva {
  codigoPago: string;
  passwordPago: string;
  pago: EstadoPagoData;
  matricula: DatosMatriculaPago;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function PagosInstitucionalPage() {
  const [sesion, setSesion] = useState<SesionPagoActiva | null>(null);

  useEffect(() => {
    document.title = "Pagos Institucionales | Colegio Cayros";
  }, []);

  const handleCerrarSesion = () => {
    setSesion(null);
  };

  const refrescarEstadoSesion = async () => {
    if (!sesion) return;

    try {
      const response = await fetch(`${API_URL}/api/pagos-matricula/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigoPago: sesion.codigoPago,
          passwordPago: sesion.passwordPago,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSesion({
          codigoPago: sesion.codigoPago,
          passwordPago: sesion.passwordPago,
          pago: data.pago,
          matricula: data.matricula,
        });
      }
    } catch (error) {
      console.error("Error al actualizar estado de pago:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Navbar />

      <main className="flex-grow py-10 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#16275d] hover:text-amber-600 px-2 py-1.5 transition-all duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Volver al Inicio</span>
            </Link>

            {sesion && (
              <button
                type="button"
                onClick={handleCerrarSesion}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#111c38] text-white hover:bg-amber-400 hover:text-[#111c38] transition-all duration-200 cursor-pointer shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar sesión / Consultar otro</span>
              </button>
            )}
          </div>

          {!sesion ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 flex justify-center">
                <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/70 space-y-6">
                  <div className="space-y-2 text-center sm:text-left">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                      <KeyRound className="w-3.5 h-3.5" />
                      Portal de Pagos Institucionales
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-bold font-['Poppins',sans-serif] text-[#111c38]">
                      Acceso al Trámite de Pago
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 font-['Open_Sans',sans-serif]">
                      Ingresa el ID único y la contraseña generados al completar la ficha de matrícula.
                    </p>
                  </div>

                  <PagoLoginForm
                    apiUrl={API_URL}
                    onLoginSuccess={(datosSesion) => setSesion(datosSesion)}
                  />
                </div>
              </div>

              <aside className="lg:col-span-5 bg-[#111c38] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-amber-400 text-[#111c38] flex items-center justify-center shrink-0">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-400 block">
                      Guía Rápida
                    </span>
                    <h2 className="text-lg font-bold font-['Poppins',sans-serif]">
                      ¿Qué debes colocar?
                    </h2>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm font-['Open_Sans',sans-serif] text-slate-200">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-1.5">
                    <p className="font-bold text-amber-400 text-xs uppercase tracking-wider">
                      1. ID Único de Pago
                    </p>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      Es el código exclusivo asignado al completar la matrícula (por ejemplo:{" "}
                      <span className="font-mono font-semibold text-white bg-white/10 px-1.5 py-0.5 rounded">
                        PAG-XXXXXXX-XXXXX
                      </span>
                      ).
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-1.5">
                    <p className="font-bold text-amber-400 text-xs uppercase tracking-wider">
                      2. Contraseña del Trámite
                    </p>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      Es la clave única vinculada a tu trámite de pago, entregada al finalizar el registro de matrícula.
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>
                        Si cierras la página o aún no tienes el voucher, puedes volver aquí en cualquier momento.
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-slate-300">
                      <Users className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>
                        ¿Matriculaste a más de un hijo? Usa{" "}
                        <strong className="text-white">Cerrar sesión</strong> para consultar cada ID por separado.
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-slate-300">
                      <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>
                        Cada comprobante queda vinculado directamente a la matrícula del estudiante.
                      </span>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/70 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
                    Matrícula Vinculada · {sesion.pago.codigoPago}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-bold font-['Poppins',sans-serif] text-[#111c38]">
                    {sesion.matricula.nombresEstudiante} {sesion.matricula.apellidosEstudiante}
                  </h1>
                  <p className="text-xs text-slate-500">
                    DNI: <strong className="text-slate-700">{sesion.matricula.dniEstudiante}</strong> ·{" "}
                    {sesion.matricula.nivel} ({sesion.matricula.grado}) · Sede:{" "}
                    <strong className="text-slate-700">{sesion.matricula.sede}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3 self-start md:self-center">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900">
                    {sesion.pago.estado.replace("_", " ")}
                  </span>
                </div>
              </div>

              {sesion.pago.puedeSubir ? (
                <PagoGuiaYSubida
                  apiUrl={API_URL}
                  codigoPago={sesion.codigoPago}
                  passwordPago={sesion.passwordPago}
                  pago={sesion.pago}
                  matricula={sesion.matricula}
                  onVoucherEnviado={refrescarEstadoSesion}
                />
              ) : (
                <PagoEstadoVista
                  pago={sesion.pago}
                  matricula={sesion.matricula}
                  onCerrarSesion={handleCerrarSesion}
                />
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}