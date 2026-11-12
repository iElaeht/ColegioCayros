// frontend/app/nosotros/vision/page.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Compass, Sparkles, Award, Target, Flag, ArrowRight, ArrowLeft } from "lucide-react";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";

export default function VisionPage() {
  useEffect(() => {
    document.title = "Nuestra Visión | Colegio Cayros";
  }, []);

  const tabNavegacion = [
    { title: "Misión", href: "/nosotros/mision", icon: Target, activo: false, desc: "Nuestro propósito institucional" },
    { title: "Visión", href: "/nosotros/vision", icon: Compass, activo: true, desc: "Proyección hacia el futuro" },
    { title: "Objetivos", href: "/nosotros/objetivos", icon: Flag, activo: false, desc: "Directrices y estrategia" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 select-none">
      <Navbar />

      <main className="flex-grow py-12 sm:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-12">
          
          {/* Botón Volver al inicio y Encabezado */}
          <div className="flex flex-col items-start max-w-3xl mx-auto w-full space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#16275d] hover:text-amber-600 px-2 py-1.5 transition-all duration-300 group outline-none"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Volver al inicio</span>
            </Link>

            <div className="w-full text-center space-y-4 flex flex-col items-center">
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
          </div>

          {/* Tarjeta de Contenido Principal Estilizada */}
          <div className="bg-white border border-gray-200/85 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8 relative overflow-hidden">
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

          {/* Navegador Inferior: También puedes explorar */}
          <div className="pt-8 space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-[0.25em] text-gray-400">
                También puedes explorar
              </h3>
              <div className="w-12 h-0.5 bg-amber-400 mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {tabNavegacion.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <Link
                    key={tab.title}
                    href={tab.href}
                    className={`group relative border rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 outline-none shadow-xs hover:shadow-md ${
                      tab.activo
                        ? "border-[#111c38] bg-[#111c38] text-white shadow-lg"
                        : "bg-white border-gray-200/80 hover:border-amber-400 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                        tab.activo ? "bg-white/10 text-amber-400" : "bg-gray-50 text-amber-500 group-hover:bg-amber-50"
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      {!tab.activo && (
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-amber-500 transition-transform duration-300 group-hover:translate-x-1" />
                      )}
                    </div>

                    <div>
                      <h4 className={`font-bold text-base font-['Poppins',sans-serif] ${tab.activo ? "text-white" : "text-[#111c38]"}`}>
                        {tab.title}
                      </h4>
                      <p className={`text-xs mt-1 font-['Open_Sans',sans-serif] ${tab.activo ? "text-gray-300" : "text-gray-500"}`}>
                        {tab.desc}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}