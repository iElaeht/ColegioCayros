// frontend/app/syspanel/(protected)/galeria/components/home-config/ToastAlertGallery.tsx
"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, X } from "lucide-react";

interface ToastAlertGalleryProps {
  show?: boolean;
  message: string;
  type?: "success" | "warning" | "error";
  onClose: () => void;
}

export default function ToastAlertGallery({
  show = true,
  message,
  type = "success",
  onClose,
}: ToastAlertGalleryProps) {
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

  // Auto-cierre a los 4 segundos
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
      className={`fixed top-6 right-6 z-[99999] pointer-events-none flex justify-end w-full max-w-sm px-4 sm:px-0 transition-all duration-300 transform-gpu select-none ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      <div className="pointer-events-auto flex items-center gap-3.5 bg-white border border-slate-200 shadow-2xl px-5 py-4 rounded-3xl backdrop-blur-xl w-full transform-gpu">
        
        {/* Icono dinámico en contenedor circular */}
        <div
          className={`w-9 h-9 shrink-0 rounded-2xl flex items-center justify-center font-bold shadow-xs transform-gpu ${config.bgIcon}`}
        >
          {config.icon}
        </div>

        {/* Texto del mensaje con jerarquía */}
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            {config.label}
          </span>
          <p className="text-xs sm:text-sm font-bold text-[#16275d] truncate sm:whitespace-normal">
            {message}
          </p>
        </div>

        {/* Botón de cierre manual */}
        <button
          type="button"
          onClick={onClose}
          className="ml-2 shrink-0 text-slate-400 hover:text-[#16275d] transition-colors duration-200 cursor-pointer p-1.5 rounded-xl hover:bg-slate-100"
          aria-label="Cerrar alerta"
        >
          <X className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}