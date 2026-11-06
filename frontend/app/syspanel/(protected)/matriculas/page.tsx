// frontend/app/syspanel/matriculas/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import MatriculaConfigForm from "./components/MatriculaConfigForm";
import MatriculaSolicitudesTable from "./components/MatriculaSolicitudesTable";

export default function MatriculasPage() {
  const [activeTab, setActiveTab] = useState<"config" | "solicitudes">("config");
  const [count, setCount] = useState<number>(0);

  // Título dinámico para la pestaña del navegador
  useEffect(() => {
    document.title = "Gestión de Matrículas | Colegio Cayros";
  }, []);

  // Obtener el conteo total de solicitudes en tiempo real para el badge de la pestaña
  useEffect(() => {
    fetch("http://localhost:4000/api/matricula-inscripcion")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCount(data.length);
        }
      })
      .catch((err) => console.error("Error al obtener contador de solicitudes:", err));
  }, []);

  return (
    <div className="p-4 sm:p-8 lg:p-10 space-y-6 sm:space-y-8 max-w-7xl mx-auto select-none">
      {/* Cabecera Limpia, Responsiva y Visible */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#16275d] tracking-tight">
            Gestión de Matrículas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Configura las imágenes del carrusel y revisa las solicitudes de pre-inscripción en tiempo real.
          </p>
        </div>

        {/* Pestañas con Animación de Desplazamiento Fluido */}
        <div className="relative flex items-center bg-slate-100 border border-slate-200/80 p-1.5 rounded-2xl w-full lg:w-auto shadow-2xs">
          
          {/* Fondo deslizante animado */}
          <div 
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] lg:w-[160px] bg-[#16275d] rounded-xl shadow-xs transition-all duration-300 ease-in-out ${
              activeTab === "config" ? "left-1.5" : "left-[calc(50%+2px)] lg:left-[calc(160px+8px)]"
            }`}
          />

          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              setActiveTab("config");
            }}
            className={`relative z-10 flex-1 lg:w-[160px] px-3 sm:px-4 py-2.5 text-xs font-bold rounded-xl transition-colors duration-300 cursor-pointer text-center outline-none ${
              activeTab === "config"
                ? "text-amber-400"
                : "text-slate-600 hover:text-[#16275d]"
            }`}
          >
            Configuración del Cartel
          </button>
          
          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              setActiveTab("solicitudes");
            }}
            className={`relative z-10 flex-1 lg:w-[160px] px-3 sm:px-4 py-2.5 text-xs font-bold rounded-xl transition-colors duration-300 cursor-pointer flex items-center justify-center gap-2 outline-none ${
              activeTab === "solicitudes"
                ? "text-amber-400"
                : "text-slate-600 hover:text-[#16275d]"
            }`}
          >
            Solicitudes
            <span className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors duration-300 font-extrabold ${
              activeTab === "solicitudes" 
                ? "bg-amber-400/20 text-amber-400 border-amber-400/40" 
                : "bg-amber-100 text-amber-800 border-amber-300"
            }`}>
              {count}
            </span>
          </button>
        </div>
      </div>

      {/* Contenido Dinámico */}
      {activeTab === "config" ? (
        <div className="animate-in fade-in duration-200">
          <MatriculaConfigForm />
        </div>
      ) : (
        <div className="animate-in fade-in duration-200">
          <MatriculaSolicitudesTable onCountChange={(newCount) => setCount(newCount)} />
        </div>
      )}
    </div>
  );
}