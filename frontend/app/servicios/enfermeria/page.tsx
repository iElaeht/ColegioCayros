// frontend/app/servicios/enfermeria/page.tsx
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import { HeartPulse, ShieldCheck, Stethoscope, Users, AlertTriangle, ArrowLeft, ArrowRight, Brain } from "lucide-react";

export default function EnfermeriaPage() {
  useEffect(() => {
    document.title = "Tópico y Enfermería | Colegio Cayros";
  }, []);

  const tabServicios = [
    { title: "Enfermería", href: "/servicios/enfermeria", icon: HeartPulse, activo: true, desc: "Salud, prevención y bienestar escolar" },
    { title: "Psicología", href: "/servicios/psicologia", icon: Brain, activo: false, desc: "Acompañamiento socioemocional integral" },
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

          {/* Encabezado Principal */}
          <div className="text-center max-w-3xl mx-auto space-y-4 flex flex-col items-center">
            <div className="inline-flex items-center gap-2.5 text-[#16275d] text-sm sm:text-base font-extrabold uppercase tracking-[0.25em]">
              <HeartPulse className="w-5 h-5 text-rose-500" />
              Salud y Bienestar Escolar
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111c38] font-['Poppins',sans-serif]">
              Tópico y Enfermería
            </h1>
            
            <p className="text-gray-600 text-sm sm:text-base font-['Open_Sans',sans-serif] leading-relaxed max-w-2xl mx-auto">
              Brindamos atención de primeros auxilios, soporte permanente y programas de prevención en salud para garantizar un entorno escolar seguro y protegido.
            </p>
          </div>

          {/* Tarjeta 1: Lo que ofrecemos y Apoyo diario */}
          <div className="bg-white border border-gray-200/85 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-400/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#111c38] text-rose-400 flex items-center justify-center shadow-md shrink-0">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md mb-1 inline-block">
                  Atención Permanente
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#111c38]">
                  Servicio de Primeros Auxilios y Soporte
                </h2>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 space-y-4 text-gray-700 font-['Open_Sans',sans-serif] text-sm sm:text-base leading-relaxed">
              <p>
                Nuestro tópico escolar cuenta con profesionales de la salud capacitados para atender incidencias menores, malestares repentinos o emergencias durante la jornada escolar, asegurando una respuesta rápida y coordinada con los padres de familia.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#111c38] block text-xs font-bold uppercase">Atención Inmediata</strong>
                    <span className="text-xs text-gray-500">Evaluación y soporte ante accidentes leves o indisposiciones.</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-start gap-3">
                  <Users className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#111c38] block text-xs font-bold uppercase">Control y Seguimiento</strong>
                    <span className="text-xs text-gray-500">Registro de atenciones, administración de medicamentos recetados y triaje.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta 2: Actividades y Charlas hacia los estudiantes */}
          <div className="bg-white border border-gray-200/85 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#111c38] text-amber-400 flex items-center justify-center shadow-md shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md mb-1 inline-block">
                  Educación Preventiva
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#111c38]">
                  Charlas y Talleres para Estudiantes
                </h2>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 space-y-4 text-gray-700 font-['Open_Sans',sans-serif] text-sm sm:text-base leading-relaxed">
              <p>
                Fomentamos una cultura de autocuidado mediante campañas informativas y talleres dinámicos dirigidos a todos los niveles (inicial, primaria y secundaria), promoviendo hábitos saludables desde la infancia.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Talleres de higiene personal, lavado de manos correcto y salud bucodental.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Charlas sobre nutrición saludable y loncheras nutritivas.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Educación postural y prevención de fatiga visual por uso de pantallas.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Tarjeta 3: Prevención de Accidentes (Puntos globales escolares) */}
          <div className="bg-[#111c38] text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-amber-400 flex items-center justify-center shadow-md shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md mb-1 inline-block">
                  Seguridad Escolar
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Prevención de Accidentes: Guía Global Escolar
                </h2>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 space-y-4 text-gray-300 font-['Open_Sans',sans-serif] text-xs sm:text-sm leading-relaxed">
              <p>
                La seguridad es una tarea conjunta. Promovemos pautas claras dentro de las instalaciones para minimizar riesgos y salvaguardar la integridad física de toda la comunidad estudiantil:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1">
                  <strong className="text-white block text-xs font-bold uppercase tracking-wider text-amber-400">1. Normas en Zonas de Recreo</strong>
                  <p className="text-gray-300 text-xs">Evitar juegos bruscos, correr por pasillos o escaleras, y respetar los espacios señalizados durante el recreo.</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1">
                  <strong className="text-white block text-xs font-bold uppercase tracking-wider text-amber-400">2. Orden en las Aulas</strong>
                  <p className="text-gray-300 text-xs">Mantener mochilas y objetos personales ordenados en los pasadizos para prevenir tropiezos o caídas.</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1">
                  <strong className="text-white block text-xs font-bold uppercase tracking-wider text-amber-400">3. Uso Adecuado de Mobiliario</strong>
                  <p className="text-gray-300 text-xs">Emplear mesas y sillas correctamente, reportando de inmediato cualquier desperfecto al docente.</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1">
                  <strong className="text-white block text-xs font-bold uppercase tracking-wider text-amber-400">4. Respuesta ante Emergencias</strong>
                  <p className="text-gray-300 text-xs">Participación activa en simulacros de sismo y reconocimiento de rutas de evacuación seguras.</p>
                </div>
              </div>
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
              {tabServicios.map((tab) => {
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