// frontend/app/sedes/page.tsx
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import { Building2, ChevronDown, MapPin, ArrowLeft } from "lucide-react";

export default function SedesPage() {
  useEffect(() => {
    document.title = "Nuestras Sedes | Colegio Cayros";
  }, []);

  const handleScrollDown = (): void => {
    window.scrollBy({
      top: 450,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 select-none">
      <Navbar />

      <main className="flex-grow py-12 sm:py-20 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-10">
          
          {/* Botón Volver alineado perfectamente al margen izquierdo */}
          <div className="w-full flex justify-start">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#16275d] hover:text-amber-600 py-1.5 transition-all duration-300 group outline-none"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Volver al inicio</span>
            </Link>
          </div>

          <div className="text-center max-w-3xl mx-auto space-y-4 flex flex-col items-center">
            <div className="inline-flex items-center gap-2.5 text-[#16275d] text-sm sm:text-base font-extrabold uppercase tracking-[0.25em]">
              <MapPin className="w-5 h-5 text-amber-500" />
              Nuestras Sedes
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111c38] font-['Poppins',sans-serif]">
              Conoce Nuestras Ubicaciones
            </h1>
            
            <p className="text-gray-600 text-sm sm:text-base font-['Open_Sans',sans-serif] leading-relaxed max-w-2xl mx-auto">
              Conoce nuestras sedes y descubre espacios modernos, seguros y diseñados estratégicamente en Chincha para potenciar el aprendizaje y desarrollo integral de nuestros estudiantes.
            </p>

            <button
              onClick={handleScrollDown}
              aria-label="Desplazarse hacia abajo"
              className="mt-6 text-[#16275d] hover:text-amber-500 transition-colors duration-300 cursor-pointer animate-bounce outline-none p-2"
            >
              <ChevronDown className="w-12 h-12 stroke-[2.5]" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-6 sm:gap-8 items-stretch pt-6">
            
            <div className="bg-[#111c38] text-white p-6 sm:p-8 rounded-3xl flex flex-col justify-between shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-4 h-4 bg-amber-400" />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-amber-400" />

              <div className="space-y-6 z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-400 shadow-inner">
                  <Building2 className="w-6 h-6" />
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md mb-2 inline-block">
                    Sede Principal
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">I.E.P. Colegio Cayros</h3>
                  <p className="text-gray-300 text-xs sm:text-sm font-['Open_Sans',sans-serif] leading-relaxed">
                    Av. José Carlos Mariátegui Lt 01<br />
                    Grocio Prado, Chincha - Ica, Perú
                  </p>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-gray-300 font-['Open_Sans',sans-serif]">
                  <p className="flex items-center gap-2"><strong className="text-white">Teléfono:</strong> (+51) 956 411 538</p>
                  <p className="flex items-center gap-2"><strong className="text-white">Correo:</strong> promotoria@colegiocayros.edu.pe</p>
                </div>
              </div>

              <div className="pt-6 z-10">
                <a 
                  href="https://goo.gl/maps/ahsmdcemEqraWJQE6" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center w-full py-3 px-4 bg-amber-400 hover:bg-amber-500 text-[#111c38] font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-md cursor-pointer"
                >
                  Abrir en Google Maps
                </a>
              </div>
            </div>

            <div className="lg:col-span-2 w-full h-[350px] sm:h-[400px] lg:h-auto rounded-3xl overflow-hidden shadow-xl border border-gray-200 bg-white">
              <iframe
                title="Ubicación Colegio Cayros Principal"
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d838.4837825847549!2d-76.15175569424946!3d-13.392632685597551!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9110171782ee6541%3A0x8eb35ca09ad2dbac!2scolegio%20cayros!5e0!3m2!1ses-419!2spe!4v1787070388201!5m2!1ses-419!2spe"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="w-full h-full"
              />
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-6 sm:gap-8 items-stretch">
            
            <div className="bg-[#16275d] text-white p-6 sm:p-8 rounded-3xl flex flex-col justify-between shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-4 h-4 bg-amber-400" />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-amber-400" />

              <div className="space-y-6 z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-400 shadow-inner">
                  <Building2 className="w-6 h-6" />
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md mb-2 inline-block">
                    Sede Autorizada
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">Cayros School</h3>
                  <p className="text-gray-300 text-xs sm:text-sm font-['Open_Sans',sans-serif] leading-relaxed">
                    Fernando León de Vivero 11703<br />
                    Pueblo Nuevo, Chincha Alta - Ica, Perú
                  </p>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-gray-300 font-['Open_Sans',sans-serif]">
                  <p className="flex items-center gap-2"><strong className="text-white">Teléfono:</strong> (+51) 956 411 538</p>
                  <p className="flex items-center gap-2"><strong className="text-white">Correo:</strong> informes@colegiocayros.edu.pe</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 w-full h-[350px] sm:h-[400px] lg:h-auto rounded-3xl overflow-hidden shadow-xl border border-gray-200 bg-white">
              <iframe
                title="Ubicación Cayros School"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d970.3439946466809!2d-76.14604037147909!3d-13.389030199181882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9110171d61889591%3A0xc309918fd3e5a053!2sFernando%20Leon%20de%20Vivero%2C%2011703!5e0!3m2!1ses-419!2spe!4v1794186793819!5m2!1ses-419!2spe"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="w-full h-full"
              />
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}