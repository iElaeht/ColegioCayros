// frontend/app/nosotros/objetivos/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { Flag } from "lucide-react";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import ObjetivoCard from "./components/ObjetivoCard";

interface Objetivo {
  id: string;
  accent: "red" | "blue" | "yellow";
  texto: string;
}

const OBJETIVOS: Objetivo[] = [
  {
    id: "sostenibilidad",
    accent: "red",
    texto: "Lograr permanencia y sostenibilidad de la institución en el corto, mediano y largo plazo con una oferta de valor que dé respuesta a las necesidades y expectativas de los clientes actuales y potenciales a través de la implementación del PEI y el plan estratégico apuntando a la misión Cayrina.",
  },
  {
    id: "cultura-ambiental",
    accent: "blue",
    texto: "Forjar una cultura ambiental Cayrina, para la comprensión de las problemáticas ambientales del entorno, a través de la construcción de proyectos que redunden en beneficio de las actitudes y de los valores de cada uno de los miembros de la comunidad educativa, en el marco de una formación ética y responsable frente al manejo adecuado del entorno.",
  },
  {
    id: "talento-humano",
    accent: "yellow",
    texto: "Desarrollar el talento humano de los empleados, desde la vinculación hasta el retiro, con la implementación de prácticas laborales, capacitación y de bienestar que den respuesta a las necesidades y expectativas de las partes interesadas, apuntando a la mejora en la prestación del servicio ofrecido por la institución.",
  },
  {
    id: "recursos-institucionales",
    accent: "red",
    texto: "Gestionar los recursos institucionales garantizando el desarrollo de la propuesta educativa favoreciendo la sostenibilidad y el desarrollo de la estrategia, atendiendo a los cambios y necesidades internos y externos.",
  },
  {
    id: "competencias-estudiantes",
    accent: "blue",
    texto: "Desarrollar en los estudiantes las competencias propuestas por el Ministerio de Educación con un plan de estudios actualizado que posibilite la formación de personas íntegras y que aporten a la sociedad.",
  },
  {
    id: "liderazgo-convivencia",
    accent: "yellow",
    texto: "Promover el liderazgo, la sana convivencia, el acompañamiento integral y la formación en valores cristianos, con todos los agentes de la educación.",
  },
];

export default function ObjetivosPage() {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Objetivos Institucionales | Colegio Cayros";
  }, []);

  const handleFocus = useCallback((id: string) => setActiveId(id), []);
  const handleBlur = useCallback(() => setActiveId(null), []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 select-none">
      <Navbar />

      <main className="flex-grow py-12 sm:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-12">
          
          {/* Encabezado Principal Minimalista (Estilo Sedes, Misión y Visión) */}
          <div className="text-center max-w-3xl mx-auto space-y-4 flex flex-col items-center">
            
            {/* Insignia minimalista sin fondo con icono */}
            <div className="inline-flex items-center gap-2.5 text-[#16275d] text-sm sm:text-base font-extrabold uppercase tracking-[0.25em]">
              <Flag className="w-5 h-5 text-amber-500" />
              Estrategia y Compromiso
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111c38] font-['Poppins',sans-serif]">
              Objetivos Institucionales
            </h1>
            
            <p className="text-gray-600 text-sm sm:text-base font-['Open_Sans',sans-serif] leading-relaxed max-w-2xl mx-auto">
              Directrices fundamentales que guían nuestra excelencia educativa y propuesta de valor en beneficio de toda la comunidad estudiantil.
            </p>
          </div>

          {/* Parrilla de Objetivos con las mismas tarjetas funcionales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
      </main>

      <Footer />
    </div>
  );
}