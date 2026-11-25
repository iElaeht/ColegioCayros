"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import GalleryHomeCard, { GalleryHomeItem } from "./GalleryHomeCard";
import GalleryFilterHome from "./GalleryFilterHome";
import { Save, X } from "lucide-react";

interface GalleryModalHomeProps {
  isOpen: boolean;
  onClose: () => void;
  allImages?: GalleryHomeItem[];
  selectedIds?: number[];
  onSaveSelections: (newSelectedIds: number[]) => void;
  homeLimit: number;
  onLimitReached?: () => void;
}

const ITEMS_PER_PAGE = 16;

export default function GalleryModalHome({
  isOpen,
  onClose,
  allImages = [],
  selectedIds = [],
  onSaveSelections,
  homeLimit,
  onLimitReached,
}: GalleryModalHomeProps) {
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
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
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
      document.body.style.position = "static";
      document.body.style.width = "auto";
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
      const altText = (img?.alt || "").toLowerCase();
      const matchesSearch = altText.includes(query);
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
    <div className="fixed inset-0 w-screen h-screen z-[99999] flex items-center justify-center bg-slate-950/60 backdrop-blur-[2px] p-3 sm:p-4 animate-in fade-in duration-200 select-none transform-gpu">
      <div className="bg-white w-full max-w-4xl h-[92vh] sm:h-[85vh] max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transform-gpu">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col gap-4 bg-slate-50 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-extrabold text-[#16275d] tracking-tight">
                Seleccionar Imágenes Destacadas
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Seleccionadas:{" "}
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
            <GalleryFilterHome
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
          className={`p-4 sm:p-6 flex-1 flex flex-col bg-white transform-gpu ${
            hasScroll ? "overflow-y-auto custom-scrollbar" : "overflow-y-hidden"
          }`}
        >
          {paginatedImages.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 transform-gpu">
                {paginatedImages.map((img) => {
                  const isSelected = activeSelectedIds.includes(img.id);
                  const selectionIndex = tempSlots.indexOf(img.id);
                  const selectionNumber = selectionIndex !== -1 ? selectionIndex + 1 : null;

                  return (
                    <div key={img.id} className="w-full transform-gpu">
                      <GalleryHomeCard
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
                    onClick={() => setVisibleLimit((prev) => prev + ITEMS_PER_PAGE)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#16275d] text-xs sm:text-sm font-bold rounded-2xl transition-all cursor-pointer shadow-xs border border-slate-200 truncate"
                  >
                    Cargar más imágenes ({filteredImages.length - visibleLimit} restantes)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 my-auto space-y-2">
              <p className="text-sm sm:text-base font-bold text-[#16275d]">
                No se encontraron imágenes en esta vista.
              </p>
              {searchTerm && (
                <p className="text-xs sm:text-sm text-slate-500">
                  Intenta buscando con otro término o limpia el buscador.
                </p>
              )}
            </div>
          )}
        </div>

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
            disabled={!hasChanges}
            className={`flex items-center gap-2 text-xs sm:text-sm font-bold px-6 py-3 rounded-2xl transition-all truncate ${
              hasChanges
                ? "bg-[#16275d] hover:bg-[#111c38] text-amber-400 shadow-md cursor-pointer border border-[#16275d]"
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border border-slate-200"
            }`}
          >
            <Save className="w-4 h-4 shrink-0 text-amber-400" />
            <span className="truncate">Guardar Selección</span>
          </button>
        </div>
      </div>
    </div>
  );
}