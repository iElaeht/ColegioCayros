"use client";

import { useState, useEffect } from "react";
import VideoHomeGrid from "./VideoHomeGrid";
import VideoModalHome from "./VideoModalHome";
import { Pencil, Save } from "lucide-react";

interface VideoItem {
  id: number;
  src: string;
  alt: string;
  isActive: boolean;
  isFeatured?: boolean;
  order?: number;
  createdAt?: string;
}

interface VideoHomeConfigProps {
  allVideos: VideoItem[];
  showToast: (type: "success" | "error" | "warning", message: string) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const HOME_LIMIT = 8;

export default function VideoHomeConfig({ allVideos, showToast }: VideoHomeConfigProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [initialSelectedIds, setInitialSelectedIds] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const slots: (number | null)[] = Array(HOME_LIMIT).fill(null);
    allVideos.forEach((vid) => {
      if (vid.isFeatured && vid.order && vid.order >= 1 && vid.order <= HOME_LIMIT) {
        slots[vid.order - 1] = vid.id;
      }
    });

    let computedFeatured = slots.filter((id): id is number => id !== null);
    if (computedFeatured.length === 0) {
      computedFeatured = allVideos.filter((vid) => vid.isFeatured).map((vid) => vid.id);
    }

    const syncTimer = setTimeout(() => {
      setSelectedIds(computedFeatured);
      setInitialSelectedIds(computedFeatured);
    }, 0);

    return () => clearTimeout(syncTimer);
  }, [allVideos]);

  const hasChanges =
    selectedIds.length !== initialSelectedIds.length ||
    selectedIds.some((id, index) => id !== initialSelectedIds[index]);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/videos/featured`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ featuredIds: selectedIds }),
      });

      if (res.ok) {
        showToast("success", "¡Videos destacados actualizados correctamente!");
        setInitialSelectedIds([...selectedIds]);
      } else {
        showToast("error", "Error al guardar los cambios en el servidor.");
      }
    } catch {
      showToast("error", "No se pudo conectar con el servidor.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-xs space-y-4 w-full select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-bold text-[#16275d] tracking-tight">
            Configuración de Videos Destacados
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Selecciona hasta {HOME_LIMIT} videos para mostrar en la sección principal del sitio web.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-xs truncate select-none outline-none focus-visible:ring-2 focus-visible:ring-[#16275d]/20"
          >
            <Pencil className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              Editar ({selectedIds.length}/{HOME_LIMIT})
            </span>
          </button>

          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={isSaving || !hasChanges}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm truncate select-none outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 ${
              hasChanges && !isSaving
                ? "bg-[#16275d] hover:bg-[#111c38] text-amber-400 border border-[#16275d]"
                : "bg-slate-100 text-slate-400 cursor-not-allowed border border-transparent shadow-none"
            }`}
          >
            <Save
              className={`w-3.5 h-3.5 shrink-0 ${
                hasChanges && !isSaving ? "text-amber-400" : "text-slate-400"
              }`}
            />
            <span className="truncate">{isSaving ? "Guardando..." : "Guardar"}</span>
          </button>
        </div>
      </div>

      <VideoHomeGrid
        allVideos={allVideos}
        selectedIds={selectedIds}
        onOpenModal={() => setIsModalOpen(true)}
      />

      <VideoModalHome
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        allVideos={allVideos}
        selectedIds={selectedIds}
        onSaveSelections={(newIds) => setSelectedIds(newIds)}
        homeLimit={HOME_LIMIT}
        onLimitReached={() => {
          showToast(
            "warning",
            `Límite de ${HOME_LIMIT} videos alcanzado. Desmarca uno para seleccionar otro.`,
          );
        }}
      />
    </div>
  );
}