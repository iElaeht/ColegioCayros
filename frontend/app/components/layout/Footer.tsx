// frontend/app/components/layout/Footer.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, ShieldCheck, FileText, ChevronRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#111c38] text-slate-300 font-['Poppins',sans-serif] pt-16 pb-8 border-t border-slate-800 select-none relative overflow-hidden">
      
      {/* Resplandor decorativo de fondo */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Contenido Principal en Grid Responsiva */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Columna 1: Identidad y Sede (4 Columnas) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                <Image 
                  src="/images/ui/Cayros-logo.png" 
                  alt="Colegio Cayros Logo" 
                  fill 
                  className="object-contain drop-shadow-sm"
                />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white tracking-tight">I.E.P. Colegio Cayros</h3>
                <p className="text-xs text-amber-400 font-semibold">Formando líderes con valores</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Institución educativa comprometida con la excelencia académica, el desarrollo integral y la innovación pedagógica.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Chincha Alta, Ica - Perú</span>
            </div>
          </div>

          {/* Columna 2: Enlaces Institucionales (4 Columnas - Sin "Inicio") */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white border-b border-slate-800 pb-2">
              Enlaces Institucionales
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/nosotros" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                  <span>Nuestra Propuesta Educativa</span>
                </Link>
              </li>
              <li>
                <Link href="/matricula" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                  <span>Proceso de Matrícula</span>
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                  <span>Contáctanos</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contacto y Legal (4 Columnas) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white border-b border-slate-800 pb-2">
              Contacto y Legal
            </h4>
            
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Central Telefónica Institucional</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>informes@colegiocayros.edu.pe</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col space-y-2 text-xs">
              <Link href="/terminos" className="hover:text-white transition-colors flex items-center gap-2 text-slate-400">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Términos y Condiciones</span>
              </Link>
              <Link href="/privacidad" className="hover:text-white transition-colors flex items-center gap-2 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>Política de Privacidad</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Barra Inferior (Copyright y Derechos) */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} I.E.P. Colegio Cayros. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <span>Chincha Alta - Perú</span>
            <span>•</span>
            <span>Excelencia Educativa</span>
          </div>
        </div>

      </div>
    </footer>
  );
}