// frontend/app/galeria/page.tsx
"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import GalleryFilters, { FilterOption } from "./components/GalleryFilters";
import GalleryGrid, { GalleryItem } from "./components/GalleryGrid";
import { Camera, ChevronDown, Loader2 } from "lucide-react";

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterOption>("recientes");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Galería Institucional | Colegio Cayros";

    const fetchGallery = async () => {
      try {
        setLoading(true);
        // Consumimos directamente tu ruta de backend trayendo solo las activas
        const response = await fetch("http://localhost:4000/api/galeria?soloActivas=true");
        
        if (!response.ok) {
          throw new Error("Error al conectar con el servidor.");
        }
        
        const data = await response.json();
        setItems(data);
      } catch (err: any) {
        console.error("Error al obtener galería:", err);
        setError("No se pudieron cargar las imágenes del servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const handleScrollDown = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Lógica de ordenamiento dinámica basada en tu base de datos
  const sortedItems = useMemo(() => {
    const list = [...items];
    if (filter === "recientes") {
      return list.sort((a, b) => b.id - a.id); // IDs más altos primero (más recientes)
    }
    if (filter === "antiguas") {
      return list.sort((a, b) => a.id - b.id); // IDs más bajos primero
    }
    if (filter === "az") {
      return list.sort((a, b) => a.alt.localeCompare(b.alt)); // Orden alfabético por descripción/título (alt)
    }
    return list;
  }, [items, filter]);

  const handleResetFilter = () => {
    setFilter("recientes");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 select-none">
      <Navbar />

      <main className="flex-grow py-12 sm:py-20 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-12">
          
          {/* Encabezado Estilo Sedes / Identidad */}
          <div className="text-center max-w-3xl mx-auto space-y-4 flex flex-col items-center">
            
            <div className="inline-flex items-center gap-2.5 text-[#16275d] text-sm sm:text-base font-extrabold uppercase tracking-[0.25em]">
              <Camera className="w-5 h-5 text-amber-500" />
              Colegio Cayros
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111c38] font-['Poppins',sans-serif]">
              Galería Institucional
            </h1>
            
            <p className="text-gray-600 text-sm sm:text-base font-['Open_Sans',sans-serif] leading-relaxed max-w-2xl mx-auto">
              Explora los momentos más memorables, eventos académicos, deportivos y culturales que forman parte de nuestra vida estudiantil.
            </p>

            <button
              onClick={handleScrollDown}
              aria-label="Desplazarse hacia abajo"
              className="mt-6 text-[#16275d] hover:text-amber-500 transition-colors duration-300 cursor-pointer animate-bounce outline-none p-2"
            >
              <ChevronDown className="w-12 h-12 stroke-[2.5]" />
            </button>
          </div>

          <div ref={contentRef} className="scroll-mt-28">
            <GalleryFilters
              currentFilter={filter}
              onFilterChange={setFilter}
              onReset={handleResetFilter}
              totalResults={sortedItems.length}
            />
          </div>

          {/* Estado de carga o error desde el backend */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-3">
              <Loader2 className="w-8 h-8 text-[#16275d] animate-spin" />
              <p className="text-xs sm:text-sm text-gray-500 font-['Open_Sans',sans-serif]">Cargando imágenes institucionales...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-red-200 p-6">
              <p className="text-red-500 text-sm font-['Open_Sans',sans-serif]">{error}</p>
            </div>
          ) : (
            <GalleryGrid items={sortedItems} />
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}