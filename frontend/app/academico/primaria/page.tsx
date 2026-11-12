// frontend/app/academico/primaria/page.tsx
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import PrimariaHeader from "./components/PrimariaHeader";
import PrimariaDetails from "./components/PrimariaDetails";
import PrimariaPilares from "./components/PrimariaPilares";

export default function PrimariaPage() {
  useEffect(() => {
    document.title = "Nivel Primaria | Colegio Cayros";
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50 select-none">
      <Navbar />

      <main className="flex-grow py-12 sm:py-20 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-10">
          
          {/* Botón Volver */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#16275d] hover:text-amber-600 px-2 py-1.5 transition-all duration-300 group outline-none"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Volver al Inicio</span>
            </Link>
          </div>

          {/* 1. Header (Título e información básica) */}
          <PrimariaHeader />

          {/* 2. Details (Texto izquierda, carrusel inteligente derecha) */}
          <PrimariaDetails />

          {/* 3. Pilares (Más información de valor y botón de matrícula) */}
          <PrimariaPilares />

        </div>
      </main>

      <Footer />
    </div>
  );
}