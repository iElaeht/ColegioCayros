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
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-[2px] animate-in fade-in duration-200 select-none">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-7 flex flex-col items-center text-center space-y-4 animate-in zoom-in-95 duration-150">
        <div className="w-14 h-14 rounded-2xl bg-amber-100/60 text-amber-600 border border-amber-200 flex items-center justify-center shadow-xs shrink-0">
          <AlertTriangle className="w-7 h-7 stroke-[2.5]" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base sm:text-lg font-bold text-[#16275d] tracking-tight">
            Límite de {limit} eventos alcanzado
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
            Desmarca un evento existente si deseas seleccionar uno nuevo para la página principal.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-[#16275d] hover:bg-[#111c38] text-amber-400 text-xs sm:text-sm font-bold rounded-2xl transition-all shadow-md cursor-pointer border border-[#16275d]"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}