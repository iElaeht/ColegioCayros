// frontend/app/components/Ubicanos.tsx
"use client";

import React from 'react';

export default function Ubicanos() {
  return (
    <section id="ubicanos" className="w-full py-16 sm:py-24 lg:py-32 bg-gray-50 select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 flex flex-col items-center">
        
        {/* Encabezado de la sección */}
        <div className="text-center space-y-3 mb-10 sm:mb-14 max-w-xl">
          <span className="text-xs font-bold tracking-[0.2em] text-[#16275d] uppercase bg-amber-100/60 px-3 py-1 rounded-full">
            Nuestra Sede
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-[#111c38] sm:text-3xl lg:text-4xl font-['Poppins',sans-serif]">
            ¿Dónde Encontrarnos?
          </h2>
          <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base font-['Open_Sans',sans-serif]">
            Visítanos en nuestras instalaciones principales ubicadas en Grocio Prado, Chincha.
          </p>
        </div>

        {/* Contenedor del Mapa en Tiempo Real e Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-6 sm:gap-8 items-stretch">
          
          {/* Tarjeta de Información rápida */}
          <div className="bg-[#111c38] text-white p-6 sm:p-8 rounded-3xl flex flex-col justify-between shadow-xl relative overflow-hidden">
            {/* Esquinas amarillas decorativas */}
            <div className="absolute top-0 left-0 w-4 h-4 bg-amber-400" />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-amber-400" />

            <div className="space-y-6 z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-400 shadow-inner">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">I.E.P. Colegio Cayros</h3>
                <p className="text-gray-300 text-xs sm:text-sm font-['Open_Sans',sans-serif] leading-relaxed">
                  Av. José Carlos Mariátegui Lt 01<br />
                  Grocio Prado, Chincha - Ica, Perú
                </p>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-gray-300 font-['Open_Sans',sans-serif]">
                <p><strong className="text-white">Teléfono:</strong> (+51) 956 411 538</p>
                <p><strong className="text-white">Correo:</strong> promotoria@colegiocayros.edu.pe</p>
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

          {/* Visor de Google Maps oficial */}
          <div className="lg:col-span-2 w-full h-[350px] sm:h-[400px] lg:h-auto rounded-3xl overflow-hidden shadow-xl border border-gray-200 bg-white">
            <iframe
              title="Ubicación Colegio Cayros"
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

      </div>
    </section>
  );
}