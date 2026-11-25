"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import HeroHomeCard, { HeroSlideItem } from "./HeroHomeCard";
import HeroFilterHome from "./HeroFilterHome";
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

const ITEMS_PER_PAGE = 16;

export default function HeroModalHome({
  isOpen,
  onClose,
  allImages = [],
  selectedIds = [],
  onSaveSelections,
  homeLimit,
  onLimitReached,
}: HeroModalHomeProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "selected">("all");
  const [visibleLimit, setVisibleLimit] = useState(ITEMS_PER_PAGE);
  const [tempSlots, setTempSlots] = useState<(number | null)[]>([]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hasScroll, setHasScroll] = useState(false);

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
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    setSearchTerm("");
    setActiveTab("all");
    setVisibleLimit(ITEMS_PER_PAGE);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

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
        const next = [...prev];
        next[existingIndex] = null;
        return next;
      }

      const firstEmptyIndex = prev.indexOf(null);
      if (firstEmptyIndex === -1) {
        onLimitReached?.();
        return prev;
      }

      const next = [...prev];
      next[firstEmptyIndex] = id;
      return next;
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

  const activeSelectedIds = useMemo(
    () => tempSlots.filter((id): id is number => id !== null),
    [tempSlots],
  );

  const filteredImages = useMemo(() => {
    const safeImages = Array.isArray(allImages) ? allImages : [];
    const query = (searchTerm || "").toLowerCase();

    return safeImages.filter((img) => {
      const titleText = (img?.title || "").toLowerCase();
      const matchesSearch = titleText.includes(query);
      const matchesTab = activeTab === "all" ? true : activeSelectedIds.includes(img.id);
      return matchesSearch && matchesTab;
    });
  }, [allImages, searchTerm, activeTab, activeSelectedIds]);

  const paginatedImages = useMemo(
    () => filteredImages.slice(0, visibleLimit),
    [filteredImages, visibleLimit],
  );

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

  if (!isOpen) return null;

  const safeSelectedCount = activeSelectedIds.length;
  const safeTotalCount = Array.isArray(allImages) ? allImages.length : 0;

  return (
    <div className="fixed inset-0 z-[99999] overflow-y-auto bg-slate-950/65 backdrop-blur-md flex min-h-full items-center justify-center p-3 sm:p-6 select-none animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[85vh] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col gap-3.5 bg-slate-50/80 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="space-y-0.5">
              <h3 className="text-base sm:text-lg font-extrabold text-[#16275d] tracking-tight">
                Seleccionar Banners Destacados
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
              onClick={(e) => {
                e.currentTarget.blur();
                onClose();
              }}
              className="p-2 text-slate-400 hover:text-[#16275d] bg-slate-100/80 hover:bg-slate-200 rounded-xl transition-all cursor-pointer shrink-0 outline-none"
              title="Cerrar y descartar"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          <div className="pt-2 border-t border-slate-200/70 w-full overflow-hidden">
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

        <div
          ref={scrollContainerRef}
          className={`p-4 sm:p-6 flex-1 flex flex-col bg-white ${
            hasScroll ? "overflow-y-auto custom-scrollbar" : "overflow-y-hidden"
          }`}
        >
          {paginatedImages.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {paginatedImages.map((img) => {
                  const isSelected = activeSelectedIds.includes(img.id);
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
                    onClick={(e) => {
                      e.currentTarget.blur();
                      setVisibleLimit((prev) => prev + ITEMS_PER_PAGE);
                    }}
                    className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#16275d] text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs truncate outline-none"
                  >
                    Cargar más banners ({filteredImages.length - visibleLimit} restantes)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 my-auto space-y-2">
              <p className="text-sm font-bold text-[#16275d]">
                No se encontraron banners en esta vista.
              </p>
              {searchTerm && (
                <p className="text-xs text-slate-500 font-medium">
                  Intenta buscando con otro término o limpia el buscador.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              onClose();
            }}
            className="px-4.5 py-2.5 bg-slate-200/80 hover:bg-slate-300 text-slate-700 text-xs sm:text-sm font-bold rounded-2xl transition-all cursor-pointer truncate outline-none"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              handleConfirmSave();
            }}
            disabled={!hasChanges}
            className={`flex items-center gap-2 text-xs sm:text-sm font-bold px-6 py-2.5 rounded-2xl transition-all truncate shadow-md outline-none ${
              hasChanges
                ? "bg-[#16275d] hover:bg-[#111c38] text-amber-400 cursor-pointer border border-[#16275d]"
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border border-transparent"
            }`}
          >
            <Save
              className={`w-4 h-4 shrink-0 ${
                hasChanges ? "text-amber-400" : "text-slate-400"
              }`}
            />
            <span className="truncate">Guardar</span>
          </button>
        </div>
      </div>
    </div>
  );
}