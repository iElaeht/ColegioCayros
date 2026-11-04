// frontend/app/syspanel/(protected)/hero/components/HeroHomeConfig.tsx
"use client";

import { useState, useEffect } from "react";
import HeroHomeGrid from "./HeroHomeGrid";
import HeroModalHome from "./HeroModalHome";
import { Pencil, Save } from "lucide-react";

export interface HeroSlideItem {
  id: number;
  title?: string | null;
  imageUrl: string;
  isActive: boolean;
  isFeatured?: boolean;
  order?: number;
  createdAt?: string;
}

interface HeroHomeConfigProps {
  allImages: HeroSlideItem[];
  showToast: (type: "success" | "error" | "warning", message: string) => void;
}

export default function HeroHomeConfig({
  allImages,
  showToast,
}: HeroHomeConfigProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [initialSelectedIds, setInitialSelectedIds] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const HOME_LIMIT = 8;

  useEffect(() => {
    const slots = Array(HOME_LIMIT).fill(null);
    allImages.forEach((img) => {
      if (img.isFeatured && img.order && img.order >= 1 && img.order <= HOME_LIMIT) {
        slots[img.order - 1] = img.id;
      }
    });

    let computedFeatured: number[] = [];
    slots.forEach((id) => {
      if (id !== null) computedFeatured.push(id);
    });

    if (computedFeatured.length === 0) {
      computedFeatured = allImages
        .filter((img) => img.isFeatured)
        .map((img) => img.id);
    } else {
      computedFeatured = slots.filter((id): id is number => id !== null);
    }

    setSelectedIds(computedFeatured);
    setInitialSelectedIds(computedFeatured);
  }, [allImages]);

  // Comparamos si hay cambios (orden de los elementos o IDs seleccionados)
  const hasChanges =
    selectedIds.length !== initialSelectedIds.length ||
    selectedIds.some((id, index) => id !== initialSelectedIds[index]);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("http://localhost:4000/api/hero/featured", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ featuredIds: selectedIds }),
      });

      if (res.ok) {
        showToast(
          "success",
          "¡Banners destacados actualizados correctamente!"
        );
        // Actualizamos el estado inicial para reflejar que ya están guardados los cambios actuales
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
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-xs space-y-4 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Configuración de Banners del Hero
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Selecciona hasta {HOME_LIMIT} banners para mostrar en la sección
            principal del sitio web.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Botón Editar optimizado */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-xs truncate focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/50 active:scale-[0.98]"
          >
            <Pencil className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Editar ({selectedIds.length}/{HOME_LIMIT})</span>
          </button>

          {/* Botón Guardar optimizado */}
          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={isSaving || !hasChanges}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#16275D] hover:bg-[#101d44] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-xs truncate focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16275D]/40 active:scale-[0.98]"
          >
            <Save className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              {isSaving ? "Guardando..." : "Guardar"}
            </span>
          </button>
        </div>
      </div>

      <HeroHomeGrid
        allImages={allImages}
        selectedIds={selectedIds}
        onOpenModal={() => setIsModalOpen(true)}
      />

      <HeroModalHome
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        allImages={allImages}
        selectedIds={selectedIds}
        onSaveSelections={(newIds) => setSelectedIds(newIds)}
        homeLimit={HOME_LIMIT}
        onLimitReached={() => {
          showToast(
            "warning",
            `Límite de ${HOME_LIMIT} banners alcanzado. Desmarca uno para seleccionar otro.`
          );
        }}
      />
    </div>
  );
}