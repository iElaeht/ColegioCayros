// frontend/components/ToastAlertMatricula.tsx
"use client";

import React, { useEffect } from 'react';
import { Check, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export default function ToastAlertMatricula({ message, type = 'success', onClose }: ToastProps) {
  // Auto-cierre opcional a los 4 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';

  return (
    <div className="fixed inset-x-4 top-4 sm:inset-auto sm:top-6 sm:right-6 z-[99999] flex items-center gap-3 bg-white/95 border border-slate-200/90 shadow-2xl px-5 py-4 rounded-2xl backdrop-blur-xl animate-in fade-in duration-200 select-none max-w-sm w-full ml-auto">
      {/* Icono dinámico según el tipo */}
      <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-white font-bold shadow-xs ${isSuccess ? 'bg-emerald-500' : 'bg-rose-500'}`}>
        {isSuccess ? (
          <Check className="w-4 h-4 stroke-[3]" />
        ) : (
          <X className="w-4 h-4 stroke-[3]" />
        )}
      </div>

      {/* Texto del mensaje */}
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {isSuccess ? 'Éxito' : 'Atención'}
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
        className="ml-2 shrink-0 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer p-1 outline-none"
        aria-label="Cerrar alerta"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}