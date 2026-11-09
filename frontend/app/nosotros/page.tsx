// frontend/app/nosotros/page.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Target, Compass, Flag, ChevronRight, ChevronDown, MapPin } from "lucide-react";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";

export default function NosotrosIndexPage() {
  useEffect(() => {
    document.title = "Nuestra Identidad | Colegio Cayros";
  }, []);

  // Función para hacer scroll dinámico hacia abajo
  const handleScrollDown = () => {
    window.scrollBy({
      top: 450,
      behavior: "smooth",
    });
  };

  const secciones = [
    {
      title: "Nuestra Misión",
      description: "Conoce nuestro propósito institucional, valores y el compromiso con la formación integral en Chincha Alta.",
      href: "/nosotros/mision",
      icon: Target,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      title: "Nuestra Visión",
      description: "Descubre nuestra proyección hacia el futuro, liderazgo educativo e innovación pedagógica en la región.",
      href: "/nosotros/vision",
      icon: Compass,
      color: "text-sky-500",
      bg: "bg-sky-50",
    },
    {
      title: "Objetivos Institucionales",
      description: "Explora las directrices estratégicas que guían la excelencia académica y sostenible de nuestra comunidad.",
      href: "/nosotros/objetivos",
      icon: Flag,
      color: "text-[#16275d]",
      bg: "bg-slate-100",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 select-none">
      <Navbar />

      <main className="flex-grow py-12 sm:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-12">
          
          {/* Botón Volver al Inicio Minimalista */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#16275d] hover:text-amber-600 px-2 py-1.5 transition-all duration-300 group outline-none"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Volver al Inicio</span>
            </Link>
          </div>

          {/* Encabezado Principal (Estilo idéntico a Sedes) */}
          <div className="text-center max-w-3xl mx-auto space-y-4 flex flex-col items-center">
            
            {/* Insignia minimalista sin fondo */}
            <div className="inline-flex items-center gap-2.5 text-[#16275d] text-sm sm:text-base font-extrabold uppercase tracking-[0.25em]">
              <MapPin className="w-5 h-5 text-amber-500" />
              Colegio Cayros
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111c38] font-['Poppins',sans-serif]">
              Nuestra Identidad
            </h1>
            
            <p className="text-gray-600 text-sm sm:text-base font-['Open_Sans',sans-serif] leading-relaxed max-w-2xl mx-auto">
              Selecciona una sección para conocer más sobre los pilares fundamentales, el propósito y los objetivos que guían nuestra institución educativa.
            </p>

            {/* Flecha grande y limpia sin fondo con animación de rebote */}
            <button
              onClick={handleScrollDown}
              aria-label="Desplazarse hacia abajo"
              className="mt-6 text-[#16275d] hover:text-amber-500 transition-colors duration-300 cursor-pointer animate-bounce outline-none p-2"
            >
              <ChevronDown className="w-12 h-12 stroke-[2.5]" />
            </button>
          </div>

          {/* Tarjetas de Navegación Estilizadas */}
          <div className="grid grid-cols-1 gap-5 pt-4">
            {secciones.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group bg-white border border-gray-200/80 hover:border-gray-300 p-6 sm:p-7 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between gap-4 outline-none"
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-[#111c38] group-hover:text-amber-600 transition-colors">
                        {item.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1 font-['Open_Sans',sans-serif] font-medium leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="w-9 h-9 rounded-xl bg-gray-50 group-hover:bg-[#16275d] text-gray-400 group-hover:text-amber-400 flex items-center justify-center shrink-0 transition-colors duration-300">
                    <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}