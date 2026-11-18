// frontend/app/contactanos/page.tsx
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import { MessageSquare, ArrowLeft } from "lucide-react";
import ContactInfo from "./components/ContactInfo";
import ContactFormSteps from "./components/ContactForm";

export default function ContactanosPage() {
  useEffect(() => {
    document.title = "Contáctanos | Colegio Cayros";
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 select-none">
      <Navbar />

      <main className="flex-grow py-12 sm:py-20 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-10">
          
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
              <MessageSquare className="w-5 h-5 text-amber-500" />
              Canal de Comunicación
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111c38] font-['Poppins',sans-serif]">
              Contáctanos
            </h1>
            
            <p className="text-gray-600 text-sm sm:text-base font-['Open_Sans',sans-serif] leading-relaxed max-w-2xl mx-auto">
              ¿Tienes alguna consulta o deseas más información sobre nuestra institución y procesos de admisión? Escríbenos y nos pondremos en contacto contigo a la brevedad.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
            
            {/* Columna de Información Institucional Modularizada */}
            <div className="lg:col-span-5">
              <ContactInfo />
            </div>

            {/* Columna del Formulario de Contacto por Pasos */}
            <div className="lg:col-span-7">
              <ContactFormSteps />
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}