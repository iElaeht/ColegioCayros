// frontend/app/syspanel/(protected)/layout.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Clock, LogOut, CheckCircle2 } from "lucide-react";
import Sidebar from "./components/Sidebard";

export default function SysPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // Control de inactividad
  const [showWarningModal, setShowWarningModal] = useState(false);
  
  // ⏱️ 40 segundos de cuenta regresiva para confirmar presencia
  const [countdown, setCountdown] = useState(40); 
  const totalDuration = 40; 

  // Función de cierre de sesión por inactividad: expulsa directo al FRONTEND PÚBLICO (/)
  const handleTimeoutLogout = useCallback(() => {
    try {
      sessionStorage.clear();
      document.cookie = "sys_token=; path=/; max-age=0; SameSite=Lax";
    } catch (e) {}
    window.location.href = "/"; // Redirección estricta a la raíz pública por seguridad
  }, []);

  // Validación de autenticación estricta por pestaña
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = sessionStorage.getItem("sys_token");
        if (!token) {
          router.replace("/syspanel");
        } else {
          setIsAuthorized(true);
        }
      } catch (err) {
        router.replace("/syspanel");
      }
    };

    checkAuth();
  }, [router]);

  // Temporizador de inactividad: 5 minutos exactos
  useEffect(() => {
    if (!isAuthorized) return;

    let inactivityTimer: NodeJS.Timeout;

    const resetInactivityTimers = () => {
      if (showWarningModal) return; 
      clearTimeout(inactivityTimer);

      // ⏱️ 5 Minutos (5 * 60 * 1000 ms)
      inactivityTimer = setTimeout(() => {
        setShowWarningModal(true);
        setCountdown(40); 
      }, 5 * 60 * 1000); 
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => {
      window.addEventListener(event, resetInactivityTimers);
    });

    resetInactivityTimers();

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimers);
      });
    };
  }, [isAuthorized, showWarningModal]);

  // Cuenta regresiva dentro del modal de inactividad (40 segundos)
  useEffect(() => {
    if (!showWarningModal) return;

    if (countdown <= 0) {
      handleTimeoutLogout();
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [showWarningModal, countdown, handleTimeoutLogout]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xs font-medium font-['Poppins',sans-serif]">
        Validando acceso seguro al sistema...
      </div>
    );
  }

  // Cálculo del porcentaje para la barra de progreso
  const progressPercentage = (countdown / totalDuration) * 100;

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-['Poppins',sans-serif] relative">
      <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

      <main 
        className={`flex-1 transition-all duration-300 ease-in-out p-4 md:p-8 text-slate-900 min-h-screen bg-slate-50 pt-20 lg:pt-8 w-full overflow-x-hidden ${
          isExpanded ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        {children}
      </main>

      {/* MODAL DE ADVERTENCIA POR INACTIVIDAD - MINIMALISTA CON PROGRESSBAR */}
      {showWarningModal && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 relative overflow-hidden space-y-5">
            
            {/* Barra de Progreso Superior */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-800">
              <div 
                className="h-full bg-amber-400 transition-all duration-1000 ease-linear"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            {/* Cabecera Simple */}
            <div className="flex items-center gap-3.5 pt-1">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400 shrink-0">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  ¿Sigues trabajando?
                </h3>
                <p className="text-[11px] text-slate-400">
                  Inactividad detectada en el sistema.
                </p>
              </div>
            </div>

            {/* Contador Minimalista en Texto */}
            <div className="text-center py-2 bg-slate-950/50 rounded-xl border border-slate-800/60">
              <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider block">
                Cierre de sesión en
              </span>
              <span className="text-2xl font-mono font-black text-amber-400 tracking-wider">
                00:{countdown < 10 ? `0${countdown}` : countdown}
              </span>
            </div>

            {/* Opciones de Botones */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowWarningModal(false);
                  setCountdown(40); // Restablece al tiempo configurado
                }}
                className="w-full py-3 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-slate-950 text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer outline-none flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Sí, Continuar</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  try {
                    sessionStorage.clear();
                    document.cookie = "sys_token=; path=/; max-age=0; SameSite=Lax";
                  } catch (e) {}
                  window.location.href = "/syspanel"; // Si el usuario hace clic voluntariamente en cerrar sesión, sí va al login
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer outline-none border border-slate-700/60 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}