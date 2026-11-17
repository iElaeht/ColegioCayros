// frontend/app/legal/politica/page.tsx
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import { ShieldCheck, FileText, ArrowLeft, ArrowRight } from "lucide-react";

export default function PoliticaPrivacidadPage() {
  useEffect(() => {
    document.title = "Política de Privacidad | Colegio Cayros";
  }, []);

  const tabLegal = [
    { title: "Política de Privacidad", href: "/legal/politica", icon: ShieldCheck, activo: true, desc: "Protección y manejo de datos personales" },
    { title: "Términos y Condiciones", href: "/legal/terminos", icon: FileText, activo: false, desc: "Lineamientos de uso de la plataforma" },
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
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              Transparencia Institucional
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111c38] font-['Poppins',sans-serif]">
              Política de Privacidad
            </h1>
            
            <p className="text-gray-600 text-sm sm:text-base font-['Open_Sans',sans-serif] leading-relaxed max-w-2xl mx-auto">
              Última actualización: Enero 2026. Conoce cómo recopilamos, tratamos y protegemos la información de nuestra comunidad educativa.
            </p>
          </div>

          {/* Contenido en Formato de Documento de Texto Limpio */}
          <div className="bg-white border border-gray-200/85 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8 font-['Open_Sans',sans-serif] text-gray-700 text-sm sm:text-base leading-relaxed">
            
            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#111c38] font-['Poppins',sans-serif]">
                1. Introducción y Compromiso
              </h2>
              <p>
                En la I.E.P. Colegio Cayros, ubicada en Chincha, valoramos y respetamos la privacidad de nuestros estudiantes, padres de familia, colaboradores y visitantes de nuestra plataforma digital. La presente Política de Privacidad establece los lineamientos bajo los cuales recopilamos, utilizamos y resguardamos los datos personales proporcionados a través de nuestros canales oficiales.
              </p>
            </div>

            <hr className="border-gray-100" />

            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#111c38] font-['Poppins',sans-serif]">
                2. Información que Recopilamos
              </h2>
              <p>
                Recopilamos datos estrictamente necesarios para la gestión administrativa, académica y de admisiones, tales como:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
                <li>Nombres y apellidos completos del estudiante y del apoderado.</li>
                <li>Número de Documento Nacional de Identidad (DNI).</li>
                <li>Datos de contacto (número de teléfono celular y correo electrónico).</li>
                <li>Información relacionada con el nivel académico y grado de postulación.</li>
              </ul>
            </div>

            <hr className="border-gray-100" />

            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#111c38] font-['Poppins',sans-serif]">
                3. Finalidad del Tratamiento de Datos
              </h2>
              <p>
                La información proporcionada es utilizada exclusivamente para procesar solicitudes de pre-inscripción, coordinar comunicaciones directas sobre procesos de matrícula, atender consultas institucionales y brindar soporte administrativo oportuno. Sus datos nunca serán comercializados o cedidos a terceros con fines publicitarios o ajenos a la institución.
              </p>
            </div>

            <hr className="border-gray-100" />

            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#111c38] font-['Poppins',sans-serif]">
                4. Derechos de Acceso y Modificación (ARCO)
              </h2>
              <p>
                Los padres o tutores legales tienen pleno derecho de solicitar en cualquier momento la revisión, actualización, inclusión o supresión de los datos personales de sus menores hijos registrados en nuestra base de datos, escribiendo a través de nuestra sección de contactos.
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