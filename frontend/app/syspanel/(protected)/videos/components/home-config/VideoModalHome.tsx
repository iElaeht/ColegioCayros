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
  onLimitReached?: () => void;
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

  // Efecto limpio para el bloqueo de scroll y la escucha de la tecla ESC
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

    // Bloqueo de scroll seguro sin alterar la posición fija del body
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
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
      document.body.style.overflow = "unset";
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
  }, [paginatedVideos, visibleLimit]);

  const handleLoadMore = () => {
    setVisibleLimit((prev) => prev + ITEMS_PER_PAGE);
  };

  if (!isOpen) return null;

  const activeSelectedIds = tempSlots.filter((id): id is number => id !== null);
  const safeSelectedCount = activeSelectedIds.length;
  const safeTotalCount = Array.isArray(allVideos) ? allVideos.length : 0;

  return (
    <div className="fixed inset-0 z-[99999] overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex min-h-full items-center justify-center p-3 sm:p-6 select-none animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[85vh] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto">
        
        {/* Cabecera del Modal */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col gap-3.5 bg-slate-50/80 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="space-y-0.5">
              <h3 className="text-base sm:text-lg font-extrabold text-[#16275d] tracking-tight">
                Seleccionar Videos Destacados
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Seleccionados:{" "}
                <span className="font-bold text-[#16275d]">
                  {safeSelectedCount} / {homeLimit}
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-[#16275d] hover:bg-slate-200/60 rounded-xl transition-all cursor-pointer shrink-0 outline-none"
              title="Cerrar"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          <div className="pt-2 border-t border-slate-200/70 w-full overflow-hidden">
            <VideoFilterHome
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              totalVideosCount={safeTotalCount}
              selectedCount={safeSelectedCount}
            />
          </div>
        </div>

        {/* Contenido con scroll condicional */}
        <div 
          ref={scrollContainerRef}
          className={`p-4 sm:p-6 overflow-x-hidden flex-1 flex flex-col bg-white ${
            hasScroll ? "overflow-y-auto custom-scrollbar" : "overflow-y-hidden"
          }`}
        >
          {paginatedVideos.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#16275d] text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs truncate"
                  >
                    Cargar más videos ({filteredVideos.length - visibleLimit}{" "}
                    restantes)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 my-auto space-y-2">
              <p className="text-sm font-bold text-[#16275d]">
                No se encontraron videos en esta vista.
              </p>
              {searchTerm && (
                <p className="text-xs text-slate-500 font-medium">
                  Intenta buscando con otro término o limpia el buscador.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer del Modal */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4.5 py-2.5 bg-slate-200/80 hover:bg-slate-300 text-slate-700 text-xs sm:text-sm font-bold rounded-2xl transition-all cursor-pointer truncate outline-none"
          >
            Cancelar
          </button>
          
          <button
            type="button"
            onClick={handleConfirmSave}
            disabled={!hasChanges}
            className={`flex items-center gap-2 text-xs sm:text-sm font-bold px-6 py-2.5 rounded-2xl transition-all truncate shadow-md ${
              hasChanges
                ? "bg-[#16275d] hover:bg-[#111c38] text-amber-400 cursor-pointer border border-[#16275d]"
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border border-transparent"
            }`}
          >
            <Save className="w-4 h-4 shrink-0 text-amber-400" />
            <span className="truncate">Guardar</span>
          </button>
        </div>
      </div>
    </div>
  );
}