// frontend/app/eventos/page.tsx
"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import EventosFilters, { EventoFilterOption } from "./components/EventosFilters";
import EventosGrid, { EventoItem } from "./components/EventosGrid";
import { Calendar, ChevronDown, Loader2, ArrowLeft } from "lucide-react";

export default function EventosPage() {
  const [items, setItems] = useState<EventoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<EventoFilterOption>("recientes");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Eventos Institucionales | Colegio Cayros";

    const fetchEventos = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/eventos?soloActivos=true`
        );
        
        if (!response.ok) {
          throw new Error("Error al conectar con el servidor.");
        }
        
        const data: EventoItem[] = await response.json();
        setItems(data);
      } catch (err: unknown) {
        console.error("Error al obtener eventos:", err);
        setError("No se pudieron cargar los eventos del servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

  const handleScrollDown = (): void => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sortedItems = useMemo<EventoItem[]>(() => {
    const list = [...items];
    if (filter === "recientes") {
      return list.sort((a, b) => b.id - a.id);
    }
    if (filter === "antiguas") {
      return list.sort((a, b) => a.id - b.id);
    }
    if (filter === "az") {
      return list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [items, filter]);

  const handleResetFilter = (): void => {
    setFilter("recientes");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 select-none">
      <Navbar />

      <main className="flex-grow py-12 sm:py-20 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-10">
          
          {/* Botón Volver alineado perfectamente al margen interior */}
          <div className="w-full flex justify-start">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#16275d] hover:text-amber-600 py-1.5 transition-all duration-300 group outline-none"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Volver al inicio</span>
            </Link>
          </div>

          {/* Encabezado Principal Centrado */}
          <div className="w-full text-center space-y-4 flex flex-col items-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2.5 text-[#16275d] text-sm sm:text-base font-extrabold uppercase tracking-[0.25em]">
              <Calendar className="w-5 h-5 text-amber-500" />
              Colegio Cayros
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111c38] font-['Poppins',sans-serif]">
              Eventos y Actividades Institucionales
            </h1>
            
            <p className="text-gray-600 text-sm sm:text-base font-['Open_Sans',sans-serif] leading-relaxed max-w-2xl mx-auto">
              Conoce las vivencias, ceremonias y jornadas académicas, culturales y deportivas que forman parte de la trayectoria de nuestra comunidad escolar.
            </p>

            <button
              onClick={handleScrollDown}
              aria-label="Desplazarse hacia abajo"
              className="mt-4 text-[#16275d] hover:text-amber-500 transition-colors duration-300 cursor-pointer animate-bounce outline-none p-2"
            >
              <ChevronDown className="w-12 h-12 stroke-[2.5]" />
            </button>
          </div>

          <div ref={contentRef} className="scroll-mt-28">
            <EventosFilters
              currentFilter={filter}
              onFilterChange={setFilter}
              onReset={handleResetFilter}
              totalResults={sortedItems.length}
            />
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-3">
              <Loader2 className="w-8 h-8 text-[#16275d] animate-spin" />
              <p className="text-xs sm:text-sm text-gray-500 font-['Open_Sans',sans-serif]">Cargando eventos institucionales...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-red-200 p-6 shadow-sm">
              <p className="text-red-500 text-sm font-['Open_Sans',sans-serif]">{error}</p>
            </div>
          ) : (
            <EventosGrid items={sortedItems} />
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}