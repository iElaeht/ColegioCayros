// frontend/app/syspanel/matriculas/components/MatriculaPreviewCard.tsx
import React from 'react';

interface MatriculaPreviewProps {
  year: string;
  badgeText: string;
  title: string;
  description: string;
  buttonText: string;
  isActive: boolean;
}

export default function MatriculaPreviewCard({
  year,
  badgeText,
  title,
  description,
  buttonText,
  isActive,
}: MatriculaPreviewProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div className="w-full flex items-center justify-between mb-5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Vista Previa en Vivo
        </span>
        <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
          {isActive ? 'Cartel Visible (Activo)' : 'Cartel Oculto (Inactivo)'}
        </span>
      </div>

      {/* Contenedor simulando el diseño exacto del cartel con un marco limpio */}
      <div className="relative w-full max-w-[380px] bg-slate-50 text-[#16275D] border border-slate-200 p-7 rounded-2xl shadow-md flex flex-col justify-between">
        <div>
          {/* Parte superior */}
          <div className="flex items-center justify-between mb-5 border-b border-slate-200 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              {badgeText || "MATRÍCULAS"}
            </span>
            <span className="bg-[#16275D] text-[#F8DE32] text-sm font-black px-3 py-1 rounded-lg shadow-sm">
              {year || "2026"}
            </span>
          </div>

          {/* Título */}
          <h3 className="text-2xl font-black tracking-tight text-[#16275D] mb-3 leading-tight">
            {title || "Escribe un título..."}
          </h3>
          
          {/* Descripción */}
          <p className="text-xs text-slate-600 font-medium leading-relaxed mb-6">
            {description || "Escribe una descripción corta para los padres de familia..."}
          </p>
        </div>

        {/* Parte inferior (Enlace) */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <span className="text-xs font-bold text-[#16275D]">
            {buttonText || "Ver pasos y requisitos"}
          </span>
          <div className="w-8 h-8 rounded-full bg-[#16275D] text-white flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}