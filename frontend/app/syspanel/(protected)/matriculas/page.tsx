// frontend/app/syspanel/matriculas/page.tsx
"use client";

import React, { useState } from 'react';
import MatriculaConfigForm from './components/MatriculaConfigForm';

export default function MatriculasPage() {
  const [activeTab, setActiveTab] = useState<'config' | 'solicitudes'>('config');

  return (
    <div className="p-4 sm:p-8 lg:p-10 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Cabecera Limpia, Responsiva y Visible */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#16275D] tracking-tight">
            Gestión de Matrículas
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Configura el cartel informativo del home y revisa las solicitudes de los padres.
          </p>
        </div>

        {/* Pestañas con Animación de Desplazamiento Fluido */}
        <div className="relative flex items-center bg-slate-100 border border-slate-200 p-1.5 rounded-xl w-full lg:w-auto shadow-sm">
          
          {/* Fondo deslizante animado */}
          <div 
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] lg:w-[160px] bg-[#16275D] rounded-lg shadow-sm transition-all duration-300 ease-in-out ${
              activeTab === 'config' ? 'left-1.5' : 'left-[calc(50%+2px)] lg:left-[calc(160px+8px)]'
            }`}
          />

          <button
            onClick={() => setActiveTab('config')}
            className={`relative z-10 flex-1 lg:w-[160px] px-3 sm:px-4 py-2 text-xs font-bold rounded-lg transition-colors duration-300 cursor-pointer text-center ${
              activeTab === 'config'
                ? 'text-white'
                : 'text-slate-600 hover:text-[#16275D]'
            }`}
          >
            Configuración del Cartel
          </button>
          
          <button
            onClick={() => setActiveTab('solicitudes')}
            className={`relative z-10 flex-1 lg:w-[160px] px-3 sm:px-4 py-2 text-xs font-bold rounded-lg transition-colors duration-300 cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'solicitudes'
                ? 'text-white'
                : 'text-slate-600 hover:text-[#16275D]'
            }`}
          >
            Solicitudes
            <span className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors duration-300 ${
              activeTab === 'solicitudes' 
                ? 'bg-white/20 text-white border-white/30' 
                : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}>
              0
            </span>
          </button>
        </div>
      </div>

      {/* Contenido Dinámico */}
      {activeTab === 'config' ? (
        <div className="animate-fadeIn">
          <MatriculaConfigForm />
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center space-y-3 shadow-sm animate-fadeIn">
          <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center mx-auto mb-2 border border-slate-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-[#16275D]">Bandeja de Solicitudes</h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            Próximamente disponible para gestionar los mensajes y preinscripciones en tiempo real.
          </p>
        </div>
      )}
    </div>
  );
}