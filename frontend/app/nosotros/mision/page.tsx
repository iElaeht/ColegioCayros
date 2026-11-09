// frontend/app/nosotros/mision/page.tsx
"use client";

import { useEffect } from "react";
import { Target, Award, Sparkles } from "lucide-react";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";

export default function MisionPage() {
  useEffect(() => {
    document.title = "Nuestra Misión | Colegio Cayros";
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 select-none">
      <Navbar />

      <main className="flex-grow py-12 sm:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-12">
          
          {/* Encabezado Principal Minimalista (Estilo Sedes) */}
          <div className="text-center max-w-3xl mx-auto space-y-4 flex flex-col items-center">
            
            {/* Insignia minimalista sin fondo con icono */}
            <div className="inline-flex items-center gap-2.5 text-[#16275d] text-sm sm:text-base font-extrabold uppercase tracking-[0.25em]">
              <Target className="w-5 h-5 text-amber-500" />
              Propósito Institucional
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111c38] font-['Poppins',sans-serif]">
              Nuestra Misión
            </h1>
            
            <p className="text-gray-600 text-sm sm:text-base font-['Open_Sans',sans-serif] leading-relaxed max-w-2xl mx-auto">
              Conoce el compromiso pedagógico y humano que guía nuestro día a día en la formación de las futuras generaciones de Chincha Alta.
            </p>
          </div>

          {/* Tarjeta de Contenido Principal Estilizada */}
          <div className="bg-white border border-gray-200/80 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#111c38] text-amber-400 flex items-center justify-center shadow-md shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md mb-1 inline-block">
                  Declaración de Principios
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#111c38]">
                  Educación con Propósito y Valores
                </h2>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <p className="text-base sm:text-lg lg:text-xl font-['Open_Sans',sans-serif] leading-relaxed text-gray-700 font-medium">
                Brindar una educación integral de alta calidad, promoviendo valores éticos, cristianos y ambientales, formando personas íntegras, críticas y competitivas capaces de aportar positivamente a la sociedad con liderazgo y vocación de servicio.
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex items-center gap-3.5 text-xs sm:text-sm text-gray-600 font-['Open_Sans',sans-serif] font-medium">
              <Award className="w-5 h-5 text-amber-500 shrink-0" />
              <span>Comprometidos con el desarrollo académico y humano de cada estudiante en Chincha Alta.</span>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}