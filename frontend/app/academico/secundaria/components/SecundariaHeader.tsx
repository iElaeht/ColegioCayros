// frontend/app/academico/secundaria/components/SecundariaHeader.tsx
"use client";

import React from "react";
import { Compass, Sparkles } from "lucide-react";

export default function SecundariaHeader() {
  return (
    <div className="bg-white border border-gray-200/80 rounded-3xl p-8 sm:p-12 shadow-sm relative overflow-hidden">
      {/* Detalle decorativo sutil de fondo */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-100/40 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-5">
        
        {/* Badge Institucional */}
        <div className="inline-flex items-center gap-2 bg-amber-100/60 text-[#16275d] text-xs font-extrabold uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-xl">
          <Compass className="w-4 h-4 text-amber-600" />
          <span>Nivel Secundaria • Preuniversitario y Formativo</span>
        </div>

        {/* Título Institucional y Descripción Básica */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111c38] font-['Poppins',sans-serif] tracking-tight">
            Nivel Secundaria
          </h1>
          <p className="text-gray-600 text-sm sm:text-base font-['Open_Sans',sans-serif] leading-relaxed max-w-2xl">
            Preparamos a nuestros jóvenes para la educación superior y los retos del mundo globalizado. Fomentamos el pensamiento analítico, la investigación científica, el liderazgo y la excelencia académica con un exigente nivel preuniversitario.
          </p>
        </div>

      </div>
    </div>
  );
}