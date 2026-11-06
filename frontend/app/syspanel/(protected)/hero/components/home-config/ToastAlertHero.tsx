// frontend/app/syspanel/(protected)/hero/components/home-config/ToastAlertHero.tsx
"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, X } from "lucide-react";

interface ToastAlertHeroProps {
  show?: boolean;
  message: string;
  type?: "success" | "warning" | "error";
  onClose: () => void;
}

export default function ToastAlertHero({
  show = true,
  message,
  type = "success",
  onClose,
}: ToastAlertHeroProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  // Manejo de montaje/desmontaje para animaciones fluidas sin afectar el layout
  useEffect(() => {
    if (show) {
      setIsRendered(true);
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [show]);

  // Auto-cierre opcional a los 4 segundos
  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!isRendered) return null;

  const isSuccess = type === "success";
  const isWarning = type === "warning";

  // Configuración dinámica de estilos según el tipo de alerta
  const getBadgeConfig = () => {
    if (isSuccess) {
      return {
        bgIcon: "bg-emerald-500 text-white",
        label: "Éxito",
        icon: <CheckCircle2 className="w-4 h-4 stroke-[3]" />,
      };
    }
    if (isWarning) {
      return {
        bgIcon: "bg-amber-500 text-white",
        label: "Atención",
        icon: <AlertTriangle className="w-4 h-4 stroke-[3]" />,
      };
    }
    return {
      bgIcon: "bg-rose-500 text-white",
      label: "Error",
      icon: <X className="w-4 h-4 stroke-[3]" />,
    };
  };

  const config = getBadgeConfig();

  return (
    <div
      className={`fixed top-5 right-5 z-[99999] pointer-events-none flex justify-end w-full max-w-sm px-4 sm:px-0 transition-all duration-300 select-none ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      <div className="pointer-events-auto flex items-center gap-3 bg-white/95 border border-slate-200/80 shadow-2xl px-5 py-4 rounded-2xl backdrop-blur-xl w-full">
        {/* Icono dinámico en contenedor circular */}
        <div
          className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-bold ${config.bgIcon}`}
        >
          {config.icon}
        </div>

        {/* Texto del mensaje con jerarquía */}
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {config.label}
          </span>
          <p className="text-xs sm:text-sm font-semibold text-[#16275d] truncate sm:whitespace-normal">
            {message}
          </p>
        </div>

        {/* Botón de cierre manual */}
        <button
          type="button"
          onClick={(e) => {
            e.currentTarget.blur();
            onClose();
          }}
          className="ml-2 shrink-0 text-slate-400 hover:text-slate-700 transition-colors duration-200 cursor-pointer p-1 outline-none"
          aria-label="Cerrar alerta"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}