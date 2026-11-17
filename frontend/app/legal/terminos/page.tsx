// frontend/app/legal/terminos/page.tsx
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import { FileText, ShieldCheck, ArrowLeft, ArrowRight } from "lucide-react";

export default function TerminosCondicionesPage() {
  useEffect(() => {
    document.title = "Términos y Condiciones | Colegio Cayros";
  }, []);

  const tabLegal = [
    { title: "Política de Privacidad", href: "/legal/politica", icon: ShieldCheck, activo: false, desc: "Protección y manejo de datos personales" },
    { title: "Términos y Condiciones", href: "/legal/terminos", icon: FileText, activo: true, desc: "Lineamientos de uso de la plataforma" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 select-none">
      <Navbar />

      <main className="flex-grow py-12 sm:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-12">
          
          {/* Botón Volver alineado al margen izquierdo */}
          <div className="w-full flex justify-start">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#16275d] hover:text-amber-600 py-1.5 transition-all duration-300 group outline-none"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Volver al inicio</span>
            </Link>
          </div>

          {/* Encabezado Principal Minimalista */}
          <div className="text-center max-w-3xl mx-auto space-y-4 flex flex-col items-center">
            <div className="inline-flex items-center gap-2.5 text-[#16275d] text-sm sm:text-base font-extrabold uppercase tracking-[0.25em]">
              <FileText className="w-5 h-5 text-amber-500" />
              Normativa y Uso
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111c38] font-['Poppins',sans-serif]">
              Términos y Condiciones
            </h1>
            
            <p className="text-gray-600 text-sm sm:text-base font-['Open_Sans',sans-serif] leading-relaxed max-w-2xl mx-auto">
              Revisa las pautas y condiciones que regulan el uso de nuestro sitio web institucional y los servicios de atención en línea.
            </p>
          </div>

          {/* Contenido en Formato de Documento de Texto Limpio */}
          <div className="bg-white border border-gray-200/85 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8 font-['Open_Sans',sans-serif] text-gray-700 text-sm sm:text-base leading-relaxed">
            
            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#111c38] font-['Poppins',sans-serif]">
                1. Disposiciones Generales
              </h2>
              <p>
                El acceso y navegación por el sitio web oficial del Colegio Cayros confiere la condición de usuario e implica la aceptación total y sin reservas de los presentes Términos y Condiciones. La institución se reserva el derecho de modificar en cualquier momento la presentación, configuración y contenidos del sitio web.
              </p>
            </div>

            <hr className="border-gray-100" />

            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#111c38] font-['Poppins',sans-serif]">
                2. Propiedad Intelectual
              </h2>
              <p>
                Todos los contenidos mostrados en esta plataforma digital (incluyendo logotipos, nombres comerciales, fotografías institucionales, diseño de interfaz, textos y recursos multimedia) son propiedad exclusiva de la I.E.P. Colegio Cayros o cuentan con las autorizaciones correspondientes de sus autores. Queda terminantemente prohibida su reproducción, distribución o modificación sin autorización expresa de la promotoria.
              </p>
            </div>

            <hr className="border-gray-100" />

            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#111c38] font-['Poppins',sans-serif]">
                3. Uso Responsable de Formularios
              </h2>
              <p>
                Los formularios habilitados en la web (tales como pre-inscripciones o contacto) tienen como único fin agilizar la comunicación entre las familias y la institución. El usuario se compromete a ingresar información verídica, exacta y actualizada, asumiendo la responsabilidad frente a datos incorrectos que dificulten la atención de su solicitud.
              </p>
            </div>

            <hr className="border-gray-100" />

            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#111c38] font-['Poppins',sans-serif]">
                4. Enlaces Externos
              </h2>
              <p>
                Nuestro sitio web puede contener enlaces hacia plataformas de terceros (como redes sociales oficiales o mapas de ubicación en Google Maps). El Colegio Cayros no se responsabiliza por las políticas de privacidad, contenidos o disponibilidad operativa de dichos sitios externos.
              </p>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {tabLegal.map((tab) => {
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