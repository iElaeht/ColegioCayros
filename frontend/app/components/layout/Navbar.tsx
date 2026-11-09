// frontend/components/layout/Navbar.tsx
"use client";

import React from "react";
import Link from "next/link";
import SubNavbar from "./SubNavbar";

export default function Navbar() {
  return (
    /* Añadimos sticky top-0 y z-50 para que se quede anclado al hacer scroll en cualquier página */
    <header className="sticky top-0 z-50 w-full select-none shadow-md bg-white">
      
      {/* 1. BARRA SUPERIOR INSTITUCIONAL (AZUL MARINO) */}
      <div className="w-full bg-[#16275D] text-white border-b border-blue-950/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
          
          <Link 
            href="/" 
            className="flex items-center space-x-3 py-3.5 sm:py-4 shrink-0 hover:opacity-95 transition-opacity cursor-pointer outline-none"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shrink-0">
              <svg className="w-full h-full drop-shadow-sm" viewBox="0 0 212 268" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M106 16C63.2253 39.4777 24.1772 27.4128 10 18.4456V173.741C10 189.638 28.7848 221.925 57.3924 231.213C86 240.5 94.6582 246.702 106 252C117.341 246.702 126 240.501 154.607 231.213C183.215 221.925 202 189.638 202 173.741V18.4456C187.822 27.4128 148.774 39.4777 106 16Z" 
                  fill="#F8DE32" 
                  stroke="#F8DE32" 
                  strokeWidth="20"
                />
              </svg>
            </div>
            <span className="font-bold tracking-wider text-sm sm:text-base text-white">
              COLEGIO CAYROS
            </span>
          </Link>

          <div className="flex items-center h-full shrink-0">
            <a 
              href="#correo" 
              className="hidden sm:flex items-center space-x-2 px-5 sm:px-6 py-4 text-xs sm:text-sm font-medium text-gray-200 hover:text-white hover:bg-white/5 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <span>Correo</span>
            </a>

            <a 
              href="#aula-virtual" 
              className="bg-[#F8DE32] hover:bg-[#eacb24] text-[#16275D] font-bold px-5 sm:px-7 py-4 sm:py-5 flex items-center space-x-2 text-xs sm:text-sm transition-colors cursor-pointer shadow-sm h-full"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#16275D] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
              </svg>
              <span>Aula Virtual</span>
            </a>
          </div>

        </div>
      </div>

      {/* 2. SUBNAVBAR */}
      <SubNavbar />
    </header>
  );
}