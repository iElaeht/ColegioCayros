// frontend/app/syspanel/(protected)/eventos/components/home-config/EventModalHome.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import EventCard from "./EventCard";
import EventFilterHome from "./EventFilterHome";
import { Save, X } from "lucide-react";

interface EventItem {
  id: number;
  src: string;
  alt: string;
  isActive: boolean;
  isFeatured?: boolean;
  createdAt?: string;
}

interface EventModalHomeProps {
  isOpen: boolean;
  onClose: () => void;
  allImages?: EventItem[];
  selectedIds?: number[];
  onSaveSelections: (newSelectedIds: number[]) => void;
  homeLimit: number;
}

export default function EventModalHome({
  isOpen,
  onClose,
  allImages = [],
  selectedIds = [],
  onSaveSelections,
  homeLimit,
}: EventModalHomeProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"all" | "selected">("all");

  const ITEMS_PER_PAGE = 16;
  const [visibleLimit, setVisibleLimit] = useState<number>(ITEMS_PER_PAGE);

  const [tempSlots, setTempSlots] = useState<(number | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      const initialSlots: (number | null)[] = Array(homeLimit).fill(null);
      if (Array.isArray(selectedIds)) {
        selectedIds.forEach((id, index) => {
          if (index < homeLimit) {
            initialSlots[index] = id;
          }
        });
      }
      setTempSlots(initialSlots);

      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      setSearchTerm("");
      setActiveTab("all");
      setVisibleLimit(ITEMS_PER_PAGE);
    } else {
      document.body.style.overflow = "unset";
      document.body.style.position = "static";
      document.body.style.width = "auto";
      document.body.style.paddingRight = "0px";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.position = "static";
      document.body.style.width = "auto";
      document.body.style.paddingRight = "0px";
    };
  }, [isOpen, selectedIds, homeLimit]);

  const handleToggleTempSelect = (id: number) => {
    setTempSlots((prev) => {
      const existingIndex = prev.indexOf(id);

      if (existingIndex !== -1) {
        const newSlots = [...prev];
        newSlots[existingIndex] = null;
        return newSlots;
      } else {
        const firstEmptyIndex = prev.indexOf(null);
        if (firstEmptyIndex === -1) return prev;

        const newSlots = [...prev];
        newSlots[firstEmptyIndex] = id;
        return newSlots;
      }
    });
  };

  const handleConfirmSave = () => {
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
    const activeSelectedIds = tempSlots.filter(
      (id): id is number => id !== null,
    );

    return safeImages.filter((img) => {
      const altText = img?.alt || "";
      const matchesSearch = altText
        .toLowerCase()
        .includes((searchTerm || "").toLowerCase());
      const isSelected = activeSelectedIds.includes(img.id);
      const matchesTab = activeTab === "all" ? true : isSelected;
      return matchesSearch && matchesTab;
    });
  }, [allImages, searchTerm, activeTab, tempSlots]);

  const paginatedImages = useMemo(() => {
    return filteredImages.slice(0, visibleLimit);
  }, [filteredImages, visibleLimit]);

  const handleLoadMore = () => {
    setVisibleLimit((prev) => prev + ITEMS_PER_PAGE);
  };

  if (!isOpen) return null;

  const activeSelectedIds = tempSlots.filter((id): id is number => id !== null);
  const safeSelectedCount = activeSelectedIds.length;
  const safeTotalCount = Array.isArray(allImages) ? allImages.length : 0;

  return (
    <div className="fixed inset-0 w-screen h-screen z-[99999] flex items-center justify-center bg-slate-950/60 backdrop-blur-[2px] p-3 sm:p-4 animate-in fade-in duration-200 select-none">
      <div className="bg-white w-full max-w-4xl h-[92vh] sm:h-[85vh] max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Cabecera del Modal */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col gap-4 bg-slate-50 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-extrabold text-[#16275d] tracking-tight">
                Seleccionar Eventos Destacados
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Seleccionados:{" "}
                <span className="font-bold text-[#16275d]">
                  {safeSelectedCount} / {homeLimit}
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-2xl text-slate-400 hover:text-[#16275d] hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer shrink-0 border border-slate-200/60"
              title="Cerrar y descartar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="pt-2 border-t border-slate-200/60 w-full overflow-hidden">
            <EventFilterHome
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              totalImagesCount={safeTotalCount}
              selectedCount={safeSelectedCount}
            />
          </div>
        </div>

        {/* Contenido de Grilla */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 flex flex-col bg-white">
          {paginatedImages.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {paginatedImages.map((img) => {
                  const currentSelectedIds = tempSlots.filter(
                    (id): id is number => id !== null,
                  );
                  const isSelected = currentSelectedIds.includes(img.id);
                  const selectionIndex = tempSlots.indexOf(img.id);
                  const selectionNumber =
                    selectionIndex !== -1 ? selectionIndex + 1 : null;

                  return (
                    <div key={img.id} className="w-full">
                      <EventCard
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
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#16275d] text-xs sm:text-sm font-bold rounded-2xl transition-all cursor-pointer shadow-xs border border-slate-200 truncate"
                  >
                    Cargar más eventos ({filteredImages.length - visibleLimit}{" "}
                    restantes)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 my-auto space-y-2">
              <p className="text-sm sm:text-base font-bold text-[#16275d]">
                No se encontraron eventos en esta vista.
              </p>
              {searchTerm && (
                <p className="text-xs sm:text-sm text-slate-500">
                  Intenta buscando con otro término o limpia el buscador.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Pie de Página del Modal */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs sm:text-sm font-bold rounded-2xl transition-all cursor-pointer truncate shadow-xs"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirmSave}
            className="flex items-center gap-2 bg-[#16275d] hover:bg-[#111c38] text-amber-400 text-xs sm:text-sm font-bold px-6 py-3 rounded-2xl transition-all shadow-md cursor-pointer border border-[#16275d] truncate"
          >
            <Save className="w-4 h-4 shrink-0 text-amber-400" />
            <span className="truncate">Guardar Selección</span>
          </button>
        </div>

      </div>
    </div>
  );
}