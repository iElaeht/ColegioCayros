// frontend/app/syspanel/(protected)/hero/components/home-config/HeroModalHome.tsx
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import HeroHomeCard from "./HeroHomeCard";
import HeroFilterHome from "./HeroFilterHome";
import { HeroSlideItem } from "./HeroHomeConfig";
import { Save, X } from "lucide-react";

interface HeroModalHomeProps {
  isOpen: boolean;
  onClose: () => void;
  allImages?: HeroSlideItem[];
  selectedIds?: number[];
  onSaveSelections: (newSelectedIds: number[]) => void;
  homeLimit: number;
  onLimitReached?: () => void;
}

export default function HeroModalHome({
  isOpen,
  onClose,
  allImages = [],
  selectedIds = [],
  onSaveSelections,
  homeLimit,
  onLimitReached,
}: HeroModalHomeProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"all" | "selected">("all");
  
  const ITEMS_PER_PAGE = 16;
  const [visibleLimit, setVisibleLimit] = useState<number>(ITEMS_PER_PAGE);

  const [tempSlots, setTempSlots] = useState<(number | null)[]>([]);
  
  // Referencia para el contenedor de scroll inteligente
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hasScroll, setHasScroll] = useState<boolean>(false);

  // Efecto para el bloqueo de scroll y la escucha de la tecla ESC
  useEffect(() => {
    if (!isOpen) return;

    const initialSlots: (number | null)[] = Array(homeLimit).fill(null);
    if (Array.isArray(selectedIds)) {
      selectedIds.forEach((id, index) => {
        if (index < homeLimit) {
          initialSlots[index] = id;
        }
      });
    }
    setTempSlots(initialSlots);

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
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

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
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
          if (onLimitReached) onLimitReached();
          return prev; 
        }

        const newSlots = [...prev];
        newSlots[firstEmptyIndex] = id;
        return newSlots;
      }
    });
  };

  // DETECCIÓN INTELIGENTE DE CAMBIOS
  const hasChanges = useMemo(() => {
    const cleanOriginal = (selectedIds || []).filter((id): id is number => id !== null);
    const cleanCurrent = tempSlots.filter((id): id is number => id !== null);

    if (cleanOriginal.length !== cleanCurrent.length) return true;

    return cleanOriginal.some((id, index) => id !== cleanCurrent[index]);
  }, [selectedIds, tempSlots]);

  const handleConfirmSave = () => {
    if (!hasChanges) return;
    const finalCleanIds = tempSlots.filter((id): id is number => id !== null);
    onSaveSelections(finalCleanIds);
    onClose();
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setVisibleLimit(ITEMS_PER_PAGE);
  };

  const handleTabChange = (tab: "all" | "selected") => {
    setActiveTab(tab);
    setVisibleLimit(ITEMS_PER_PAGE);
  };

  const filteredImages = useMemo(() => {
    const safeImages = Array.isArray(allImages) ? allImages : [];
    const activeSelectedIds = tempSlots.filter((id): id is number => id !== null);

    return safeImages.filter((img) => {
      const titleText = img?.title || "";
      const matchesSearch = titleText.toLowerCase().includes((searchTerm || "").toLowerCase());
      const isSelected = activeSelectedIds.includes(img.id);
      const matchesTab = activeTab === "all" ? true : isSelected;
      return matchesSearch && matchesTab;
    });
  }, [allImages, searchTerm, activeTab, tempSlots]);

  const paginatedImages = useMemo(() => {
    return filteredImages.slice(0, visibleLimit);
  }, [filteredImages, visibleLimit]);

  // Chequeo de scroll inteligente: verifica si el contenido excede la altura visible del contenedor
  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollHeight, clientHeight } = scrollContainerRef.current;
        setHasScroll(scrollHeight > clientHeight);
      }
    };

    checkScroll();
    const timer = setTimeout(checkScroll, 50);
    return () => clearTimeout(timer);
  }, [paginatedImages, visibleLimit]);

  const handleLoadMore = () => {
    setVisibleLimit((prev) => prev + ITEMS_PER_PAGE);
  };

  if (!isOpen) return null;

  const activeSelectedIds = tempSlots.filter((id): id is number => id !== null);
  const safeSelectedCount = activeSelectedIds.length;
  const safeTotalCount = Array.isArray(allImages) ? allImages.length : 0;

  return (
    <div className="fixed inset-0 w-screen h-screen z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl h-[92vh] sm:h-[85vh] max-h-[92vh] rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col gap-3 bg-slate-50 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="space-y-0.5">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Seleccionar Banners Destacados
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Seleccionados:{" "}
                <span className="font-bold text-[#16275D]">
                  {safeSelectedCount} / {homeLimit}
                </span>
              </p>
            </div>

            {/* Botón X transparente con color azul y sin fondo */}
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
            <HeroFilterHome
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              totalImagesCount={safeTotalCount}
              selectedCount={safeSelectedCount}
            />
          </div>
        </div>

        {/* Contenedor con scroll inteligente condicional */}
        <div 
          ref={scrollContainerRef}
          className={`p-4 sm:p-6 flex-1 flex flex-col bg-white ${
            hasScroll ? "overflow-y-auto custom-scrollbar" : "overflow-y-hidden"
          }`}
        >
          {paginatedImages.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {paginatedImages.map((img) => {
                  const currentSelectedIds = tempSlots.filter((id): id is number => id !== null);
                  const isSelected = currentSelectedIds.includes(img.id);
                  const selectionIndex = tempSlots.indexOf(img.id);
                  const selectionNumber = selectionIndex !== -1 ? selectionIndex + 1 : null;

                  return (
                    <div key={img.id} className="w-full">
                      <HeroHomeCard
                        item={img}
                        isSelected={isSelected}
                        isInteractive={true}
                        selectionNumber={selectionNumber}
                        onClick={() => handleToggleTempSelect(img.id)}
                      />
                    </div>
                  );
                })}
              </div>

              {visibleLimit < filteredImages.length && (
                <div className="flex justify-center mt-6 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-sm truncate"
                  >
                    Cargar más banners ({filteredImages.length - visibleLimit} restantes)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400 my-auto space-y-1">
              <p className="text-sm font-medium">No se encontraron banners en esta vista.</p>
              {searchTerm && (
                <p className="text-xs text-slate-400">
                  Intenta buscando con otro término o limpia el buscador.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer truncate"
          >
            Cancelar
          </button>
          
          {/* Botón Guardar Inteligente */}
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