"use client";

import { useState, useEffect } from "react";
import HeroHomeGrid from "./HeroHomeGrid";
import HeroModalHome from "./HeroModalHome";
import { HeroSlideItem } from "./HeroHomeCard";
import { Pencil, Save } from "lucide-react";

interface HeroHomeConfigProps {
  allImages: HeroSlideItem[];
  showToast: (type: "success" | "error" | "warning", message: string) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const HOME_LIMIT = 8;

export default function HeroHomeConfig({
  allImages,
  showToast,
}: HeroHomeConfigProps) {
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
      const res = await fetch(`${API_URL}/api/hero/featured`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featuredIds: selectedIds }),
      });

      if (res.ok) {
        showToast("success", "¡Banners destacados actualizados correctamente!");
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
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-xs space-y-4 w-full select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-bold text-[#16275d] tracking-tight">
            Configuración de Banners del Hero
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Selecciona hasta {HOME_LIMIT} banners para mostrar en la sección principal del sitio web.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-xs truncate focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16275d]/20 active:scale-[0.98]"
          >
            <Pencil className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              Editar ({selectedIds.length}/{HOME_LIMIT})
            </span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              handleSaveChanges();
            }}
            disabled={isSaving || !hasChanges}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm truncate focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 active:scale-[0.98] ${
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
        onSaveSelections={setSelectedIds}
        homeLimit={HOME_LIMIT}
        onLimitReached={() => {
          showToast(
            "warning",
            `Límite de ${HOME_LIMIT} banners alcanzado. Desmarca uno para seleccionar otro.`,
          );
        }}
      />
    </div>
  );
}