// frontend/app/syspanel/(protected)/eventos/components/home-config/EventHomeAlert.tsx
"use client";

import { AlertTriangle } from "lucide-react";

interface EventHomeAlertProps {
  isOpen: boolean;
  onClose: () => void;
  limit: number;
}

export default function EventHomeAlert({
  isOpen,
  onClose,
  limit,
}: EventHomeAlertProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-100 p-6 flex flex-col items-center text-center space-y-4">
        
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 border border-amber-200 flex items-center justify-center shadow-xs shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Límite de {limit} eventos alcanzado
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Desmarca un evento existente si deseas seleccionar uno nuevo.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
        >
          Entendido
        </button>

      </div>
    </div>
  );
}