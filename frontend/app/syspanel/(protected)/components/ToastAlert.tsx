"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, X } from "lucide-react";

export type ToastType = "success" | "warning" | "error";

interface ToastAlertProps {
  show?: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export default function ToastAlert({
  show = true,
  message,
  type = "success",
  duration = 4000,
  onClose,
}: ToastAlertProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    let showTimer: ReturnType<typeof setTimeout> | undefined;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    if (show) {
      showTimer = setTimeout(() => {
        setIsRendered(true);
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      }, 0);
    } else {
      showTimer = setTimeout(() => {
        setIsVisible(false);
      }, 0);
      hideTimer = setTimeout(() => {
        setIsRendered(false);
      }, 300);
    }

    return () => {
      if (showTimer) clearTimeout(showTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [show]);

  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!isRendered) return null;

  const badgeConfig =
    type === "success"
      ? {
          bgIcon: "bg-emerald-500 text-white",
          label: "Éxito",
          icon: <CheckCircle2 className="w-4 h-4 stroke-[3]" />,
        }
      : type === "warning"
      ? {
          bgIcon: "bg-amber-500 text-white",
          label: "Atención",
          icon: <AlertTriangle className="w-4 h-4 stroke-[3]" />,
        }
      : {
          bgIcon: "bg-rose-500 text-white",
          label: "Error",
          icon: <XCircle className="w-4 h-4 stroke-[3]" />,
        };

  return (
    <div
      className={`fixed top-5 right-5 z-[99999] pointer-events-none flex justify-end w-full max-w-sm px-4 sm:px-0 transition-all duration-300 transform-gpu ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      <div className="pointer-events-auto flex items-center gap-3 bg-white/95 border border-slate-200/80 shadow-2xl px-5 py-4 rounded-2xl backdrop-blur-xl w-full transform-gpu">
        <div
          className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-bold transform-gpu ${badgeConfig.bgIcon}`}
        >
          {badgeConfig.icon}
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {badgeConfig.label}
          </span>
          <p className="text-xs sm:text-sm font-semibold text-[#16275d] truncate sm:whitespace-normal">
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="ml-2 shrink-0 text-slate-400 hover:text-slate-600 transition-colors duration-200 cursor-pointer p-1 select-none outline-none"
          aria-label="Cerrar alerta"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}