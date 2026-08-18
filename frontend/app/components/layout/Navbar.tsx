import React from 'react';

export default function Navbar() {
  return (
    <header className="bg-[#111c38] text-white shadow-md sticky top-0 z-50 flex items-center justify-between border-b border-blue-950/40">
      
      {/* Lado Izquierdo: Logotipo y Nombre con padding vertical ampliado */}
      <div className="flex items-center space-x-3 px-6 py-6">
        <div className="w-8 h-8 bg-yellow-400 rounded-sm flex items-center justify-center shadow-sm">
          <svg className="w-5 h-5 text-[#111c38]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4zm0 19.93c-4.14-1.12-7-5.18-7-9.93V7.3l7-3.11 7 3.11V12c0 4.75-2.86 8.81-7 9.93z"/>
          </svg>
        </div>
        <span className="font-bold tracking-wider text-base sm:text-lg text-white">
          COLEGIO CAYROS
        </span>
      </div>

      {/* Lado Derecho: Accesos (Correo y Bloque Amarillo de Aula Virtual) */}
      <div className="flex items-center h-full">
        {/* Enlace de Correo */}
        <a 
          href="#correo" 
          className="hidden sm:flex items-center space-x-2 px-6 py-6 text-sm font-medium text-gray-200 hover:text-white hover:bg-white/5 transition-colors"
        >
          <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          <span>Correo</span>
        </a>

        {/* Aula Virtual (Bloque amarillo ajustado al nuevo alto) */}
        <a 
          href="#aula-virtual" 
          className="bg-yellow-400 hover:bg-yellow-300 text-[#111c38] font-bold px-6 py-6 flex items-center space-x-2 text-sm sm:text-base transition-colors h-full"
        >
          <svg className="w-5 h-5 text-[#111c38]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z"/>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
          </svg>
          <span>Aula Virtual</span>
        </a>
      </div>

    </header>
  );
}