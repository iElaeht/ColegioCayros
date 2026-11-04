// frontend/components/ToastAlertMatricula.tsx
"use client";

import React, { useEffect } from 'react';

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
    <div className="fixed inset-x-4 top-4 sm:inset-auto sm:top-6 sm:right-6 z-50 flex items-center gap-3 bg-white border border-slate-200 shadow-2xl px-5 py-4 rounded-xl backdrop-blur-xl animate-fade-in transition-all duration-300">
      {/* Icono dinámico según el tipo */}
      <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-white font-bold ${isSuccess ? 'bg-emerald-500' : 'bg-rose-500'}`}>
        {isSuccess ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </div>

      {/* Texto del mensaje */}
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {isSuccess ? 'Éxito' : 'Atención'}
        </span>
        <p className="text-sm font-semibold text-[#16275D] truncate sm:whitespace-normal">
          {message}
        </p>
      </div>

      {/* Botón de cierre manual */}
      <button 
        onClick={onClose}
        className="ml-2 shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
        aria-label="Cerrar alerta"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}