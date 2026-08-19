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
  red: "bg-red-600",
  blue: "bg-sky-400",
  yellow: "bg-yellow-400",
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
      className={`group flex gap-3 rounded-lg p-3 -m-3 outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-400 ${
        isActive ? "bg-slate-50" : "bg-transparent"
      }`}
    >
      <span
        aria-hidden="true"
        className={`mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-[2px] transition-transform duration-200 ${
          ACCENT_CLASSES[objetivo.accent]
        } ${isActive ? "scale-125" : "scale-100"}`}
      />
      <p className="text-[15px] leading-relaxed text-slate-700">
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
    <section className="w-full bg-white px-6 py-28 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
        
        {/* Encabezado Principal */}
        <div className="mb-10 text-center">
          <span className="text-xs font-bold tracking-[0.2em] text-[#78b7e6] uppercase">
            Nuestra Identidad
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#1B2A4A] sm:text-3xl">
            Misión, Visión y Objetivos
          </h2>
        </div>

        {/* Sistema de Pestañas Minimalista con Línea Inferior (Opción 2) */}
        <div className="mb-12 flex justify-center">
          <div className="inline-flex rounded-2xl bg-slate-100 p-1.5 shadow-inner">
            
            <button
              onClick={() => setActiveTab("mision")}
              className={`relative px-8 py-3 text-sm font-bold uppercase tracking-wider transition-colors duration-200 rounded-xl ${
                activeTab === "mision"
                  ? "text-[#1B2A4A] bg-white shadow-sm"
                  : "text-slate-500 hover:text-[#1B2A4A]"
              }`}
            >
              Misión
              {activeTab === "mision" && (
                <span className="absolute bottom-0 left-3 right-3 h-[3px] bg-[#1B2A4A] rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("vision")}
              className={`relative px-8 py-3 text-sm font-bold uppercase tracking-wider transition-colors duration-200 rounded-xl ${
                activeTab === "vision"
                  ? "text-[#1B2A4A] bg-white shadow-sm"
                  : "text-slate-500 hover:text-[#1B2A4A]"
              }`}
            >
              Visión
              {activeTab === "vision" && (
                <span className="absolute bottom-0 left-3 right-3 h-[3px] bg-[#1B2A4A] rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("objetivos")}
              className={`relative px-8 py-3 text-sm font-bold uppercase tracking-wider transition-colors duration-200 rounded-xl ${
                activeTab === "objetivos"
                  ? "text-[#1B2A4A] bg-white shadow-sm"
                  : "text-slate-500 hover:text-[#1B2A4A]"
              }`}
            >
              Objetivos
              {activeTab === "objetivos" && (
                <span className="absolute bottom-0 left-3 right-3 h-[3px] bg-[#1B2A4A] rounded-full" />
              )}
            </button>

          </div>
        </div>

        {/* Contenido Dinámico según la pestaña seleccionada */}
        <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-8 sm:p-12 shadow-sm transition-all duration-300">
          
          {/* 1. MISIÓN */}
          {activeTab === "mision" && (
            <div className="max-w-3xl mx-auto text-center space-y-4 animate-fadeIn">
              <span
                aria-hidden="true"
                className="mx-auto block h-3.5 w-3.5 rounded-[2px] bg-yellow-400"
              />
              <h3 className="text-xl font-bold text-[#1B2A4A] sm:text-2xl">
                Nuestra Misión
              </h3>
              <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
                Brindar una educación integral de alta calidad, promoviendo valores éticos, cristianos y ambientales, formando personas íntegras, críticas y competitivas capaces de aportar positivamente a la sociedad con liderazgo y vocación de servicio.
              </p>
            </div>
          )}

          {/* 2. VISIÓN */}
          {activeTab === "vision" && (
            <div className="max-w-3xl mx-auto text-center space-y-4 animate-fadeIn">
              <span
                aria-hidden="true"
                className="mx-auto block h-3.5 w-3.5 rounded-[2px] bg-yellow-400"
              />
              <h3 className="text-xl font-bold text-[#1B2A4A] sm:text-2xl">
                Nuestra Visión
              </h3>
              <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
                Ser una institución educativa líder en la región Ica, reconocida por su excelencia académica, innovación pedagógica y su firme compromiso con la sostenibilidad ambiental y la formación en valores de nuestra comunidad estudiantil.
              </p>
            </div>
          )}

          {/* 3. OBJETIVOS */}
          {activeTab === "objetivos" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-3.5 w-3.5 flex-shrink-0 rounded-[2px] bg-yellow-400"
                />
                <h3 className="text-xl font-bold tracking-tight text-[#1B2A4A] sm:text-2xl">
                  Objetivos Institucionales
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-x-16 gap-y-12 md:grid-cols-2">
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