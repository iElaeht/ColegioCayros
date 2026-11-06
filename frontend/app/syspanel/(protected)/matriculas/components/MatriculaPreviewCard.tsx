// frontend/app/syspanel/matriculas/components/MatriculaPreviewCard.tsx
"use client";

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

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
    <div className="bg-white border border-slate-200/85 p-6 sm:p-7 rounded-3xl shadow-sm space-y-5 select-none">
      {/* Cabecera de la Vista Previa */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#16275d]/10 text-[#16275d] flex items-center justify-center">
            <Sparkles className="w-4 h-4"/>
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Vista Previa en Vivo
          </h3>
        </div>

        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-2xs ${
          isActive ? "bg-emerald-500 text-white" : "bg-slate-400 text-white"
        }`}>
          {isActive ? "Visible al público" : "Oculto en la web"}
        </span>
      </div>

      {/* Contenedor que emula el diseño exacto del cartel corporativo */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#16275d] via-[#1a2f6c] to-[#0d1633] p-7 text-white shadow-xl transition-all duration-300 ${
        !isActive ? "opacity-60 grayscale-[25%]" : ""
      }`}>
        {/* Elemento decorativo de fondo */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          {/* Parte superior: Badge y Año */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-300">
              {badgeText || "MATRÍCULAS"}
            </span>
            <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-xl shadow-md">
              {year || "2026"}
            </span>
          </div>

          {/* Título Principal */}
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-snug">
            {title || "Escribe un título..."}
          </h3>
          
          {/* Descripción Corta */}
          <p className="text-xs text-slate-200/90 font-medium leading-relaxed">
            {description || "Escribe una descripción corta para los padres de familia..."}
          </p>

          {/* Parte inferior (Botón Simulado) */}
          <div className="pt-2 flex items-center justify-between border-t border-white/10 pt-4">
            <span className="text-xs font-bold text-amber-400 tracking-wide">
              {buttonText || "Ver pasos y requisitos"}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
        </div>
      </div>

      <div className="text-[11px] text-slate-400 text-center font-medium">
        El cartel se actualizará instantáneamente en la sección principal del sitio web.
      </div>
    </div>
  );
}