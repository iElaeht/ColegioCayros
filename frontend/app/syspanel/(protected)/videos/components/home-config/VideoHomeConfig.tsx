// frontend/app/syspanel/(protected)/videos/components/home-config/VideoHomeConfig.tsx
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

export default function VideoHomeConfig({
  allVideos,
  showToast,
}: VideoHomeConfigProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [initialSelectedIds, setInitialSelectedIds] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const HOME_LIMIT = 8;

  useEffect(() => {
    const slots = Array(HOME_LIMIT).fill(null);
    allVideos.forEach((vid) => {
      if (vid.isFeatured && vid.order && vid.order >= 1 && vid.order <= HOME_LIMIT) {
        slots[vid.order - 1] = vid.id;
      }
    });

    let computedFeatured: number[] = [];
    slots.forEach((id) => {
      if (id !== null) computedFeatured.push(id);
    });

    if (computedFeatured.length === 0) {
      computedFeatured = allVideos
        .filter((vid) => vid.isFeatured)
        .map((vid) => vid.id);
    } else {
      computedFeatured = slots.filter((id): id is number => id !== null);
    }

    setSelectedIds(computedFeatured);
    setInitialSelectedIds(computedFeatured);
  }, [allVideos]);

  // Comparamos si hay cambios en los IDs seleccionados u orden
  const hasChanges =
    selectedIds.length !== initialSelectedIds.length ||
    selectedIds.some((id, index) => id !== initialSelectedIds[index]);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("http://localhost:4000/api/videos/featured", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ featuredIds: selectedIds }),
      });

      if (res.ok) {
        showToast(
          "success",
          "¡Videos destacados actualizados correctamente!"
        );
        // Actualizamos el estado inicial para reflejar que ya están sincronizados los cambios
        setInitialSelectedIds([...selectedIds]);
      } else {
        showToast("error", "Error al guardar los cambios en el servidor.");
      }
    } catch (error) {
      console.error("Error de red al guardar videos destacados:", error);
      showToast("error", "No se pudo conectar con el servidor.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Configuración de Videos Destacados
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Selecciona hasta {HOME_LIMIT} videos para mostrar en la sección
              principal del sitio web.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Botón Editar con select-none y outline limpio */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-xs truncate select-none outline-none focus:ring-2 focus:ring-slate-300"
            >
              <Pencil className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Editar ({selectedIds.length}/{HOME_LIMIT})</span>
            </button>

            {/* Botón Guardar con etiqueta de cierre corregida y select-none */}
            <button
              type="button"
              onClick={handleSaveChanges}
              disabled={isSaving || !hasChanges}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-xs truncate select-none outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <Save className="w-3.5 h-3.5 shrink-0" />
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
              `Límite de ${HOME_LIMIT} videos alcanzado. Desmarca uno para seleccionar otro.`
            );
          }}
        />
      </div>
    </>
  );
}