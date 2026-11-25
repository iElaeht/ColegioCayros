"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Clock, LogOut, CheckCircle2 } from "lucide-react";
import Sidebar from "./components/Sidebard";

const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000;
const COUNTDOWN_SECONDS = 40;

export default function SysPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const showWarningRef = useRef(false);

  useEffect(() => {
    showWarningRef.current = showWarningModal;
  }, [showWarningModal]);

  const handleTimeoutLogout = useCallback(() => {
    try {
      sessionStorage.clear();
      document.cookie = "sys_token=; path=/; max-age=0; SameSite=Lax";
    } catch {
      // Ignorar errores de almacenamiento en contextos restringidos
    }
    window.location.href = "/";
  }, []);

  useEffect(() => {
    let authTimer: ReturnType<typeof setTimeout> | undefined;

    try {
      const token = sessionStorage.getItem("sys_token");
      if (!token) {
        router.replace("/syspanel");
      } else {
        authTimer = setTimeout(() => {
          setIsAuthorized(true);
        }, 0);
      }
    } catch {
      router.replace("/syspanel");
    }

    return () => {
      if (authTimer) clearTimeout(authTimer);
    };
  }, [router]);

  useEffect(() => {
    if (!isAuthorized) return;

    let inactivityTimer: ReturnType<typeof setTimeout> | undefined;
    let warningTimer: ReturnType<typeof setTimeout> | undefined;

    const resetInactivityTimers = () => {
      if (showWarningRef.current) return;
      if (inactivityTimer) clearTimeout(inactivityTimer);

      inactivityTimer = setTimeout(() => {
        warningTimer = setTimeout(() => {
          setShowWarningModal(true);
          setCountdown(COUNTDOWN_SECONDS);
        }, 0);
      }, INACTIVITY_TIMEOUT_MS);
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => {
      window.addEventListener(event, resetInactivityTimers);
    });

    resetInactivityTimers();

    return () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      if (warningTimer) clearTimeout(warningTimer);
      events.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimers);
      });
    };
  }, [isAuthorized]);

  useEffect(() => {
    if (!showWarningModal) return;

    if (countdown <= 0) {
      const logoutTimer = setTimeout(() => {
        handleTimeoutLogout();
      }, 0);
      return () => clearTimeout(logoutTimer);
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

  const progressPercentage = (countdown / COUNTDOWN_SECONDS) * 100;

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

      {showWarningModal && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 relative overflow-hidden space-y-5">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-800">
              <div
                className="h-full bg-amber-400 transition-all duration-1000 ease-linear"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

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

            <div className="text-center py-2 bg-slate-950/50 rounded-xl border border-slate-800/60">
              <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider block">
                Cierre de sesión en
              </span>
              <span className="text-2xl font-mono font-black text-amber-400 tracking-wider">
                00:{countdown < 10 ? `0${countdown}` : countdown}
              </span>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowWarningModal(false);
                  setCountdown(COUNTDOWN_SECONDS);
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
                  } catch {
                    // Ignorar errores de almacenamiento
                  }
                  window.location.href = "/syspanel";
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