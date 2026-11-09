// frontend/app/nosotros/vision/page.tsx
"use client";

import { useEffect } from "react";
import { Compass, Sparkles, Award } from "lucide-react";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";

export default function VisionPage() {
  useEffect(() => {
    document.title = "Nuestra Visión | Colegio Cayros";
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
              <Compass className="w-5 h-5 text-sky-500" />
              Proyección al Futuro
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111c38] font-['Poppins',sans-serif]">
              Nuestra Visión
            </h1>
            
            <p className="text-gray-600 text-sm sm:text-base font-['Open_Sans',sans-serif] leading-relaxed max-w-2xl mx-auto">
              Descubre nuestra proyección hacia el liderazgo educativo, la innovación pedagógica y el compromiso sostenible en la región.
            </p>
          </div>

          {/* Tarjeta de Contenido Principal Estilizada */}
          <div className="bg-white border border-gray-200/80 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-400/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#111c38] text-amber-400 flex items-center justify-center shadow-md shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md mb-1 inline-block">
                  Horizonte Institucional
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#111c38]">
                  Liderazgo e Innovación Educativa
                </h2>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <p className="text-base sm:text-lg lg:text-xl font-['Open_Sans',sans-serif] leading-relaxed text-gray-700 font-medium">
                Ser una institución educativa líder en la región Ica, reconocida por su excelencia académica, innovación pedagógica y su firme compromiso con la sostenibilidad ambiental y la formación en valores de nuestra comunidad estudiantil.
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex items-center gap-3.5 text-xs sm:text-sm text-gray-600 font-['Open_Sans',sans-serif] font-medium">
              <Award className="w-5 h-5 text-sky-500 shrink-0" />
              <span>Innovación constante y liderazgo educativo orientados a los retos del mañana.</span>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}