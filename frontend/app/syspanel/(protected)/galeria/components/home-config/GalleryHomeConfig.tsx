"use client";

import { useState, useEffect } from "react";
import GalleryHomeGrid from "./GalleryHomeGrid";
import GalleryModalHome from "./GalleryModalHome";
import { GalleryHomeItem } from "./GalleryHomeCard";
import { Pencil, Save, Loader2 } from "lucide-react";

interface GalleryHomeConfigProps {
  allImages: GalleryHomeItem[];
  showToast: (type: "success" | "error" | "warning", message: string) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const HOME_LIMIT = 8;

export default function GalleryHomeConfig({
  allImages,
  showToast,
}: GalleryHomeConfigProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [initialSelectedIds, setInitialSelectedIds] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const slots: (number | null)[] = Array(HOME_LIMIT).fill(null);
    allImages.forEach((img) => {
      if (img.isFeatured && img.order && img.order >= 1 && img.order <= HOME_LIMIT) {
        slots[img.order - 1] = img.id;
      }
    });

    const orderedFeatured = slots.filter((id): id is number => id !== null);
    const computedFeatured =
      orderedFeatured.length > 0
        ? orderedFeatured
        : allImages.filter((img) => img.isFeatured).map((img) => img.id);

    setSelectedIds(computedFeatured);
    setInitialSelectedIds(computedFeatured);
  }, [allImages]);

  const hasChanges =
    selectedIds.length !== initialSelectedIds.length ||
    selectedIds.some((id, index) => id !== initialSelectedIds[index]);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/galeria/featured`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featuredIds: selectedIds }),
      });

      if (res.ok) {
        showToast("success", "¡Imágenes destacadas actualizadas correctamente!");
        setInitialSelectedIds([...selectedIds]);
      } else {
        showToast("error", "Error al guardar los cambios en el servidor.");
      }
    } catch (error) {
      console.error("Error de red al guardar destacados:", error);
      showToast("error", "No se pudo conectar con el servidor.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-sm space-y-6 w-full select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-extrabold text-[#16275d] tracking-tight">
            Configuración de Imágenes en Inicio
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
            Selecciona hasta {HOME_LIMIT} imágenes destacadas para mostrar en la landing page principal.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-[#16275d] text-xs sm:text-sm font-bold rounded-2xl transition-all cursor-pointer shadow-xs border border-slate-200/80 truncate"
          >
            <Pencil className="w-4 h-4 shrink-0" />
            <span className="truncate">
              Editar ({selectedIds.length}/{HOME_LIMIT})
            </span>
          </button>

          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={isSaving || !hasChanges}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-[#16275d] hover:bg-[#111c38] disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-amber-400 text-xs sm:text-sm font-bold rounded-2xl transition-all cursor-pointer shadow-md border border-[#16275d] truncate"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 shrink-0 animate-spin text-amber-400" />
            ) : (
              <Save className="w-4 h-4 shrink-0 text-amber-400" />
            )}
            <span className="truncate">{isSaving ? "Guardando..." : "Guardar"}</span>
          </button>
        </div>
      </div>

      <GalleryHomeGrid
        allImages={allImages}
        selectedIds={selectedIds}
        onOpenModal={() => setIsModalOpen(true)}
      />

      <GalleryModalHome
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        allImages={allImages}
        selectedIds={selectedIds}
        onSaveSelections={setSelectedIds}
        homeLimit={HOME_LIMIT}
        onLimitReached={() => {
          showToast(
            "warning",
            `Límite de ${HOME_LIMIT} imágenes alcanzado. Desmarca una para seleccionar otra.`,
          );
        }}
      />
    </div>
  );
}