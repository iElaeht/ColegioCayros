"use client";

import { useState, useCallback } from "react";

/**
 * ObjetivosSection
 * Sección institucional de objetivos, con marcador de color por tarjeta
 * y una micro-interacción de foco/hover para reforzar jerarquía visual.
 *
 * Colores de marcador tomados de la identidad institucional:
 * - accent-red:    #C0392B
 * - accent-blue:   #6FA8DC
 * - accent-yellow: #F1C40F
 * - ink (título):  #1B2A4A
 */

type Accent = "red" | "blue" | "yellow";

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

export default function ObjetivosSection() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleFocus = useCallback((id: string) => setActiveId(id), []);
  const handleBlur = useCallback(() => setActiveId(null), []);

  return (
    <section className="w-full bg-white px-6 py-40 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 flex items-center gap-3">
          <span
            aria-hidden="true"
            className="h-3.5 w-3.5 flex-shrink-0 rounded-[2px] bg-yellow-400"
          />
          <h2 className="text-2xl font-bold tracking-tight text-[#1B2A4A] sm:text-3xl">
            Objetivos
          </h2>
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
    </section>
  );
}