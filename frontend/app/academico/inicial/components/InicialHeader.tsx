// frontend/app/academico/inicial/components/InicialHeader.tsx
"use client";

import React from "react";
import { Smile, Sparkles } from "lucide-react";

export default function InicialHeader() {
  return (
    <div className="bg-white border border-gray-200/80 rounded-3xl p-8 sm:p-12 shadow-sm relative overflow-hidden">
      {/* Detalle decorativo sutil de fondo */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-100/40 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-5">
        
        {/* Badge Institucional */}
        <div className="inline-flex items-center gap-2 bg-amber-100/60 text-[#16275d] text-xs font-extrabold uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-xl">
          <Smile className="w-4 h-4 text-amber-600" />
          <span>Educación Inicial • Niños de 3 a 5 años</span>
        </div>

        {/* Título Institucional y Descripción Básica */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111c38] font-['Poppins',sans-serif] tracking-tight">
            Nivel Inicial
          </h1>
          <p className="text-gray-600 text-sm sm:text-base font-['Open_Sans',sans-serif] leading-relaxed max-w-2xl">
            En el Colegio Cayros brindamos un espacio seguro, afectivo y estimulante diseñado especialmente para los primeros años de formación escolar. Guiamos a los niños de 3 a 5 años en su descubrimiento del mundo a través del juego, el afecto y los valores institucionales.
          </p>
        </div>

      </div>
    </div>
  );
}