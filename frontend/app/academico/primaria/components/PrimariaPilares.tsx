// frontend/app/academico/primaria/components/PrimariaPilares.tsx
"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

const PILARES_PRIMARIA = [
  {
    titulo: "Razonamiento y Pensamiento Crítico",
    desc: "Metodologías activas para estimular la resolución de problemas lógicos, análisis matemático y comprensión lectora avanzada."
  },
  {
    titulo: "Competencias Tecnológicas y Digitales",
    desc: "Uso guiado de herramientas digitales y plataformas virtuales como soporte transversal para la investigación escolar."
  },
  {
    titulo: "Bilingüismo y Comunicación Oral",
    desc: "Fortalecimiento de la fluidez verbal, habilidades de oratoria, redacción creativa y el aprendizaje del idioma inglés."
  },
  {
    titulo: "Liderazgo, Ciencia y Valores",
    desc: "Proyectos de ciencias, laboratorios vivenciales y una sólida formación axiológica basada en el respeto, la disciplina y la empatía."
  }
];

export default function PrimariaPilares() {
  return (
    <div className="bg-white border border-gray-200/80 p-8 sm:p-12 rounded-3xl shadow-sm space-y-8">
      
      {/* Cabecera de los Pilares */}
      <div className="max-w-2xl space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md inline-block">
          Pilares Académicos
        </span>
        <h3 className="text-2xl font-bold text-[#111c38] font-['Poppins',sans-serif]">
          ¿Cómo potenciamos el talento en Primaria?
        </h3>
        <p className="text-gray-600 text-sm font-['Open_Sans',sans-serif] leading-relaxed">
          Diseñamos experiencias de aprendizaje significativas para preparar a los estudiantes ante los retos del mundo moderno.
        </p>
      </div>

      {/* Grid de Pilares */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {PILARES_PRIMARIA.map((pilar, idx) => (
          <div key={idx} className="bg-gray-50/70 p-6 rounded-2xl border border-gray-100 space-y-2">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <h4 className="text-sm font-bold text-[#111c38] font-['Poppins',sans-serif]">
                {pilar.titulo}
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 font-['Open_Sans',sans-serif] leading-relaxed pl-7">
              {pilar.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Bloque Final de Cierre con el Botón Minimalista de Matrícula */}
      <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <strong className="text-sm text-[#111c38] block font-semibold font-['Poppins',sans-serif]">
              Vacantes Limitadas por Grado
            </strong>
            <span className="text-xs text-gray-500 font-['Open_Sans',sans-serif]">
              Asegura una educación competitiva y con acompañamiento personalizado.
            </span>
          </div>
        </div>

        <Link
          href="/matricula"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#111c38] font-extrabold text-xs sm:text-sm px-8 py-3.5 rounded-2xl shadow-sm transition-all duration-300 hover:scale-[1.02] cursor-pointer"
        >
          <span>¡Proceso de Matrícula!</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </Link>
      </div>

    </div>
  );
}