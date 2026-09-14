// frontend/app/syspanel/(protected)/videos/components/home-config/VideoModalHome.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import VideoCard from "./VideoCard";
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
}

export default function VideoModalHome({
  isOpen,
  onClose,
  allVideos = [],
  selectedIds = [],
  onSaveSelections,
  homeLimit,
}: VideoModalHomeProps) {
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

  const filteredVideos = useMemo(() => {
    const safeVideos = Array.isArray(allVideos) ? allVideos : [];
    const activeSelectedIds = tempSlots.filter(
      (id): id is number => id !== null,
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

  const handleLoadMore = () => {
    setVisibleLimit((prev) => prev + ITEMS_PER_PAGE);
  };

  if (!isOpen) return null;

  const activeSelectedIds = tempSlots.filter((id): id is number => id !== null);
  const safeSelectedCount = activeSelectedIds.length;
  const safeTotalCount = Array.isArray(allVideos) ? allVideos.length : 0;

  return (
    <div className="fixed inset-0 w-screen h-screen z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl h-[92vh] sm:h-[85vh] max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col gap-3 bg-slate-50 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="space-y-0.5">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Seleccionar Videos Destacados
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Seleccionados:{" "}
                <span className="font-bold text-indigo-600">
                  {safeSelectedCount} / {homeLimit}
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="Cerrar y descartar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="pt-2 border-t border-slate-200/60 w-full overflow-hidden">
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

        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 flex flex-col bg-white">
          {paginatedVideos.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {paginatedVideos.map((vid) => {
                  const currentSelectedIds = tempSlots.filter(
                    (id): id is number => id !== null,
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

        <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer truncate"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirmSave}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer truncate"
          >
            <Save className="w-4 h-4 shrink-0" />
            <span className="truncate">Guardar</span>
          </button>
        </div>
      </div>
    </div>
  );
}