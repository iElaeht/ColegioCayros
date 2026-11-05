// frontend/components/MisionVisionObjetivosSection.tsx
"use client";

import { useState, useCallback } from "react";

type Accent = "red" | "blue" | "yellow";
type TabType = "mision" | "vision" | "objetivos";

interface Objetivo {
  id: string;
  accent: Accent;
  texto: string;
}

const ACCENT_CLASSES: Record<Accent, string> = {
  red: "bg-red-500",
  blue: "bg-sky-400",
  yellow: "bg-amber-400",
};

const OBJETIVOS: Objetivo[] = [
  {
    id: "sostenibilidad",
    accent: "red",
    texto:
      "Lograr permanencia y sostenibilidad de la institución en el corto, mediano y largo plazo con una oferta de valor que dé respuesta a las necesidades y expectativas de los clientes actuales y potenciales a través de la implementación del PEI y el plan estratégico apuntando a la misión Cayrina.",
  },
  {
    id: "cultura-ambiental",
    accent: "blue",
    texto:
      "Forjar una cultura ambiental Cayrina, para la comprensión de las problemáticas ambientales del entorno, a través de la construcción de proyectos que redunden en beneficio de las actitudes y de los valores de cada uno de los miembros de la comunidad educativa, en el marco de una formación ética y responsable frente al manejo adecuado del entorno.",
  },
  {
    id: "talento-humano",
    accent: "yellow",
    texto:
      "Desarrollar el talento humano de los empleados, desde la vinculación hasta el retiro, con la implementación de prácticas laborales, capacitación y de bienestar que den respuesta a las necesidades y expectativas de las partes interesadas, apuntando a la mejora en la prestación del servicio ofrecido por la institución.",
  },
  {
    id: "recursos-institucionales",
    accent: "red",
    texto:
      "Gestionar los recursos institucionales garantizando el desarrollo de la propuesta educativa favoreciendo la sostenibilidad y el desarrollo de la estrategia, atendiendo a los cambios y necesidades internos y externos.",
  },
  {
    id: "competencias-estudiantes",
    accent: "blue",
    texto:
      "Desarrollar en los estudiantes las competencias propuestas por el Ministerio de Educación con un plan de estudios actualizado que posibilite la formación de personas íntegras y que aporten a la sociedad.",
  },
  {
    id: "liderazgo-convivencia",
    accent: "yellow",
    texto:
      "Promover el liderazgo, la sana convivencia, el acompañamiento integral y la formación en valores cristianos, con todos los agentes de la educación.",
  },
];

function ObjetivoCard({
  objetivo,
  isActive,
  onFocus,
  onBlur,
}: {
  objetivo: Objetivo;
  isActive: boolean;
  onFocus: () => void;
  onBlur: () => void;
}) {
  return (
    <div
      tabIndex={0}
      onMouseEnter={onFocus}
      onMouseLeave={onBlur}
      onFocus={onFocus}
      onBlur={onBlur}
      className={`group flex items-start gap-3.5 rounded-2xl p-4 sm:p-5 outline-none transition-all duration-300 border ${
        isActive 
          ? "bg-white border-slate-200 shadow-md -translate-y-0.5" 
          : "bg-white/60 border-slate-100 hover:border-slate-200 hover:bg-white shadow-sm"
      }`}
    >
      <span
        aria-hidden="true"
        className={`mt-2 h-2.5 w-2.5 flex-shrink-0 rounded-full transition-transform duration-300 ${
          ACCENT_CLASSES[objetivo.accent]
        } ${isActive ? "scale-125 ring-4 ring-slate-100" : "scale-100"}`}
      />
      <p className="text-xs sm:text-sm leading-relaxed text-slate-700 font-medium">
        {objetivo.texto}
      </p>
    </div>
  );
}

export default function MisionVisionObjetivosSection() {
  const [activeTab, setActiveTab] = useState<TabType>("mision");
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleFocus = useCallback((id: string) => setActiveId(id), []);
  const handleBlur = useCallback(() => setActiveId(null), []);

  return (
    <section className="w-full bg-slate-50/50 px-4 sm:px-8 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        
        {/* Encabezado Principal */}
        <div className="mb-10 sm:mb-14 text-center max-w-xl mx-auto">
          <span className="text-xs font-bold tracking-[0.2em] text-[#16275d] uppercase bg-amber-100/60 px-3 py-1 rounded-full">
            Nuestra Identidad
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#16275d] sm:text-3xl lg:text-4xl">
            Misión, Visión y Objetivos
          </h2>
        </div>

        {/* Sistema de Pestañas (Tabs) Responsivo y Minimalista */}
        <div className="mb-10 sm:mb-12 flex justify-center px-2">
          <div className="inline-flex flex-wrap justify-center rounded-2xl bg-slate-200/70 p-1.5 shadow-inner gap-1">
            
            {(["mision", "vision", "objetivos"] as TabType[]).map((tab) => {
              const label = tab === "mision" ? "Misión" : tab === "vision" ? "Visión" : "Objetivos";
              const isActive = activeTab === tab;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-5 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 rounded-xl cursor-pointer ${
                    isActive
                      ? "text-[#16275d] bg-white shadow-md scale-[1.02]"
                      : "text-slate-600 hover:text-[#16275d] hover:bg-white/40"
                  }`}
                >
                  {label}
                  {isActive && (
                    <span className="absolute bottom-1 left-4 right-4 h-[2px] bg-[#16275d] rounded-full" />
                  )}
                </button>
              );
            })}

          </div>
        </div>

        {/* Contenedor de Contenido Dinámico */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 lg:p-14 shadow-xl transition-all duration-300">
          
          {/* 1. MISIÓN */}
          {activeTab === "mision" && (
            <div className="max-w-3xl mx-auto text-center space-y-4 animate-fadeIn py-6">
              <span
                aria-hidden="true"
                className="mx-auto block h-3 w-3 rounded-full bg-amber-400 shadow-sm"
              />
              <h3 className="text-xl font-extrabold text-[#16275d] sm:text-2xl">
                Nuestra Misión
              </h3>
              <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 font-normal">
                Brindar una educación integral de alta calidad, promoviendo valores éticos, cristianos y ambientales, formando personas íntegras, críticas y competitivas capaces de aportar positivamente a la sociedad con liderazgo y vocación de servicio.
              </p>
            </div>
          )}

          {/* 2. VISIÓN */}
          {activeTab === "vision" && (
            <div className="max-w-3xl mx-auto text-center space-y-4 animate-fadeIn py-6">
              <span
                aria-hidden="true"
                className="mx-auto block h-3 w-3 rounded-full bg-amber-400 shadow-sm"
              />
              <h3 className="text-xl font-extrabold text-[#16275d] sm:text-2xl">
                Nuestra Visión
              </h3>
              <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 font-normal">
                Ser una institución educativa líder en la región Ica, reconocida por su excelencia académica, innovación pedagógica y su firme compromiso con la sostenibilidad ambiental y la formación en valores de nuestra comunidad estudiantil.
              </p>
            </div>
          )}

          {/* 3. OBJETIVOS */}
          {activeTab === "objetivos" && (
            <div className="space-y-6 sm:space-y-8 animate-fadeIn">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <span
                  aria-hidden="true"
                  className="h-3 w-3 flex-shrink-0 rounded-full bg-amber-400 shadow-sm"
                />
                <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#16275d]">
                  Objetivos Institucionales
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                {OBJETIVOS.map((objetivo) => (
                  <ObjetivoCard
                    key={objetivo.id}
                    objetivo={objetivo}
                    isActive={activeId === objetivo.id}
                    onFocus={() => handleFocus(objetivo.id)}
                    onBlur={handleBlur}
                  />
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}