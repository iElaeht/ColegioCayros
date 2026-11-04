// frontend/app/syspanel/(protected)/videos/components/home-config/VideoModalHome.tsx
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import VideoCard from "./VideoHomeCard";
import VideoFilterHome from "./VideoFilterHome";
import { Save, X } from "lucide-react";

interface VideoItem {
  id: number;
  src: string;
  alt: string;
  isActive: boolean;
  isFeatured?: boolean;
  createdAt?: string;
}

interface VideoModalHomeProps {
  isOpen: boolean;
  onClose: () => void;
  allVideos?: VideoItem[];
  selectedIds?: number[];
  onSaveSelections: (newSelectedIds: number[]) => void;
  homeLimit: number;
  onLimitReached?: () => void; // Añadido para consistencia con Hero
}

export default function VideoModalHome({
  isOpen,
  onClose,
  allVideos = [],
  selectedIds = [],
  onSaveSelections,
  homeLimit,
  onLimitReached,
}: VideoModalHomeProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"all" | "selected">("all");

  const ITEMS_PER_PAGE = 16;
  const [visibleLimit, setVisibleLimit] = useState<number>(ITEMS_PER_PAGE);

  const [tempSlots, setTempSlots] = useState<(number | null)[]>([]);
  
  // Referencia para el contenedor de scroll inteligente
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hasScroll, setHasScroll] = useState<boolean>(false);

  // Efecto para el bloqueo de scroll y la escucha de la tecla ESC (Sincronizado con Hero)
  useEffect(() => {
    if (!isOpen) return;

    // Inicializar slots
    const initialSlots: (number | null)[] = Array(homeLimit).fill(null);
    if (Array.isArray(selectedIds)) {
      selectedIds.forEach((id, index) => {
        if (index < homeLimit) {
          initialSlots[index] = id;
        }
      });
    }
    setTempSlots(initialSlots);

    // Bloqueo de scroll inteligente (manejo de scrollbar width)
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    
    // Resetear estados internos al abrir
    setSearchTerm("");
    setActiveTab("all");
    setVisibleLimit(ITEMS_PER_PAGE);

    // Manejador para cerrar con la tecla ESC
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Limpieza del efecto
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      // Restaurar estilos del body
      document.body.style.overflow = "unset";
      document.body.style.position = "static";
      document.body.style.width = "auto";
      document.body.style.paddingRight = "0px";
    };
  }, [isOpen, selectedIds, homeLimit, onClose]);

  const handleToggleTempSelect = (id: number) => {
    setTempSlots((prev) => {
      const existingIndex = prev.indexOf(id);

      if (existingIndex !== -1) {
        const newSlots = [...prev];
        newSlots[existingIndex] = null;
        return newSlots;
      } else {
        const firstEmptyIndex = prev.indexOf(null);
        if (firstEmptyIndex === -1) {
            if (onLimitReached) onLimitReached(); // Notificar si se alcanzó el límite
            return prev;
        }

        const newSlots = [...prev];
        newSlots[firstEmptyIndex] = id;
        return newSlots;
      }
    });
  };

  // DETECCIÓN INTELIGENTE DE CAMBIOS (Heredado de Hero)
  const hasChanges = useMemo(() => {
    const cleanOriginal = (selectedIds || []).filter((id): id is number => id !== null);
    const cleanCurrent = tempSlots.filter((id): id is number => id !== null);

    if (cleanOriginal.length !== cleanCurrent.length) return true;

    // Comparar orden y IDs
    return cleanOriginal.some((id, index) => id !== cleanCurrent[index]);
  }, [selectedIds, tempSlots]);

  const handleConfirmSave = () => {
    if (!hasChanges) return; // No guardar si no hay cambios
    const finalCleanIds = tempSlots.filter((id): id is number => id !== null);
    onSaveSelections(finalCleanIds);
    onClose();
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setVisibleLimit(ITEMS_PER_PAGE); // Resetear paginación al buscar
  };

  const handleTabChange = (tab: "all" | "selected") => {
    setActiveTab(tab);
    setVisibleLimit(ITEMS_PER_PAGE); // Resetear paginación al cambiar de tab
  };

  const filteredVideos = useMemo(() => {
    const safeVideos = Array.isArray(allVideos) ? allVideos : [];
    const activeSelectedIds = tempSlots.filter(
      (id): id is number => id !== null
    );

    return safeVideos.filter((vid) => {
      const altText = vid?.alt || "";
      const matchesSearch = altText
        .toLowerCase()
        .includes((searchTerm || "").toLowerCase());
      const isSelected = activeSelectedIds.includes(vid.id);
      const matchesTab = activeTab === "all" ? true : isSelected;
      return matchesSearch && matchesTab;
    });
  }, [allVideos, searchTerm, activeTab, tempSlots]);

  const paginatedVideos = useMemo(() => {
    return filteredVideos.slice(0, visibleLimit);
  }, [filteredVideos, visibleLimit]);

   // Chequeo de scroll inteligente: verifica si el contenido excede la altura visible (Heredado de Hero)
   useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollHeight, clientHeight } = scrollContainerRef.current;
        setHasScroll(scrollHeight > clientHeight);
      }
    };

    checkScroll();
    // Pequeño delay para asegurar que el DOM se renderizó tras paginar
    const timer = setTimeout(checkScroll, 50);
    return () => clearTimeout(timer);
  }, [paginatedVideos, visibleLimit]);

  const handleLoadMore = () => {
    setVisibleLimit((prev) => prev + ITEMS_PER_PAGE);
  };

  if (!isOpen) return null;

  const activeSelectedIds = tempSlots.filter((id): id is number => id !== null);
  const safeSelectedCount = activeSelectedIds.length;
  const safeTotalCount = Array.isArray(allVideos) ? allVideos.length : 0;

  return (
    <div className="fixed inset-0 w-screen h-screen z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl h-[92vh] sm:h-[85vh] max-h-[92vh] rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Cabecera del Modal (Estilos Hero) */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col gap-3 bg-slate-50 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="space-y-0.5">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Seleccionar Videos Destacados
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Seleccionados:{" "}
                {/* Color azul del Hero */}
                <span className="font-bold text-[#16275D]">
                  {safeSelectedCount} / {homeLimit}
                </span>
              </p>
            </div>

            {/* Botón X (Estilo Hero: azul, sin fondo circular) */}
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-[#16275D] hover:text-[#101d44] bg-transparent rounded-lg transition-colors cursor-pointer shrink-0"
              title="Cerrar y descartar"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          <div className="pt-2 border-t border-slate-200/60 w-full overflow-hidden">
            <VideoFilterHome
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              // Propiedades renombradas en tu componente original para coincidir con la lógica,
              // asumo que FilterHome recibe estos nombres:
              totalVideosCount={safeTotalCount}
              selectedCount={safeSelectedCount}
            />
          </div>
        </div>

        {/* Contenedor con scroll inteligente condicional (Heredado de Hero) */}
        <div 
          ref={scrollContainerRef}
          className={`p-4 sm:p-6 overflow-x-hidden flex-1 flex flex-col bg-white ${
            hasScroll ? "overflow-y-auto custom-scrollbar" : "overflow-y-hidden"
          }`}
        >
          {paginatedVideos.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {paginatedVideos.map((vid) => {
                  const currentSelectedIds = tempSlots.filter(
                    (id): id is number => id !== null
                  );
                  const isSelected = currentSelectedIds.includes(vid.id);
                  const selectionIndex = tempSlots.indexOf(vid.id);
                  const selectionNumber =
                    selectionIndex !== -1 ? selectionIndex + 1 : null;

                  return (
                    <div key={vid.id} className="w-full">
                      <VideoCard
                        item={vid}
                        isSelected={isSelected}
                        isInteractive={true}
                        selectionNumber={selectionNumber}
                        onClick={() => handleToggleTempSelect(vid.id)}
                      />
                    </div>
                  );
                })}
              </div>

              {visibleLimit < filteredVideos.length && (
                <div className="flex justify-center mt-6 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-sm truncate"
                  >
                    Cargar más videos ({filteredVideos.length - visibleLimit}{" "}
                    restantes)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400 my-auto space-y-1">
              <p className="text-sm font-medium">
                No se encontraron videos en esta vista.
              </p>
              {searchTerm && (
                <p className="text-xs text-slate-400">
                  Intenta buscando con otro término o limpia el buscador.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer del Modal (Botones estilo Hero + Lógica Guardar Inteligente) */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer truncate"
          >
            Cancelar
          </button>
          
          {/* Botón Guardar Inteligente (Heredado de Hero) */}
          <button
            type="button"
            onClick={handleConfirmSave}
            disabled={!hasChanges}
            className={`flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-xl transition-all truncate ${
              hasChanges
                ? "bg-[#16275D] hover:bg-[#101d44] text-white shadow-sm cursor-pointer"
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            }`}
          >
            <Save className="w-4 h-4 shrink-0" />
            <span className="truncate">Guardar</span>
          </button>
        </div>
      </div>
    </div>
  );
}