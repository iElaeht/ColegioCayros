// frontend/app/academico/components/AcademicLevelsNav.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, BookOpen, GraduationCap, ArrowRight } from "lucide-react";

interface AcademicLevelsNavProps {
  currentLevel: "Inicial" | "Primaria" | "Secundaria";
}

export default function AcademicLevelsNav({ currentLevel }: AcademicLevelsNavProps) {
  const levels = [
    {
      title: "Inicial",
      badge: "3 a 5 Añitos",
      description: "Estimulación temprana y desarrollo socioemocional",
      href: "/academico/inicial",
      icon: Sparkles,
    },
    {
      title: "Primaria",
      badge: "1ro a 6to Grado",
      description: "Lectoescritura y razonamiento lógico",
      href: "/academico/primaria",
      icon: BookOpen,
    },
    {
      title: "Secundaria",
      badge: "1ro a 5to Año",
      description: "Preparación preuniversitaria y liderazgo",
      href: "/academico/secundaria",
      icon: GraduationCap,
    },
  ];

  return (
    <section className="pt-12 mt-12 border-t border-slate-200/80 space-y-6">
      <div className="text-center space-y-2 flex flex-col items-center">
        <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-slate-400">
          También puedes explorar
        </span>
        {/* Subraya decorativa centrada */}
        <div className="w-12 h-1 bg-amber-400 rounded-full mt-1" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
        {levels.map((lvl) => {
          const isSelected = currentLevel === lvl.title;
          const IconComponent = lvl.icon;

          if (isSelected) {
            // Card seleccionada (Estilo oscuro institucional fijo)
            return (
              <div
                key={lvl.title}
                className="bg-[#111c38] text-white rounded-3xl p-6 shadow-xl border border-[#111c38] flex flex-col justify-between relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-white/10 text-amber-400 flex items-center justify-center">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-extrabold bg-amber-400 text-[#111c38] px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {lvl.badge}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold font-['Poppins',sans-serif]">
                      Nivel {lvl.title}
                    </h4>
                    <p className="text-xs text-slate-300 font-['Open_Sans',sans-serif] mt-1">
                      {lvl.description}
                    </p>
                  </div>
                </div>
                <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-amber-400">
                  <span>Estás viendo esta sección</span>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                </div>
              </div>
            );
          }

          // Cards no seleccionadas (Borde ámbar/naranja al hacer hover)
          return (
            <Link
              key={lvl.title}
              href={lvl.href}
              className="bg-white hover:bg-amber-50/20 text-slate-800 rounded-3xl p-6 shadow-xs border border-slate-200/60 hover:border-amber-400 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 text-[#111c38] flex items-center justify-center group-hover:bg-amber-400 group-hover:text-[#111c38] transition-colors">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-extrabold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full uppercase tracking-wider group-hover:bg-amber-100 group-hover:text-amber-800 transition-colors">
                    {lvl.badge}
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-bold font-['Poppins',sans-serif] text-[#111c38]">
                    Nivel {lvl.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-['Open_Sans',sans-serif] mt-1">
                    {lvl.description}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-amber-600">
                <span>Explorar nivel</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}