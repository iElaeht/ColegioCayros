"use client";

import { useState, useEffect } from "react";
import EventHomeGrid from "./EventHomeGrid";
import EventModalHome from "./EventModalHome";
import EventHomeAlert from "./EventHomeAlert";
import { Pencil, Save, Loader2 } from "lucide-react";

export interface EventHomeItem {
  id: number;
  src: string;
  alt: string;
  isActive: boolean;
  isFeatured?: boolean;
  order?: number;
  createdAt?: string;
}

interface EventHomeConfigProps {
  allImages: EventHomeItem[];
  showToast: (type: "success" | "error", message: string) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const HOME_LIMIT = 8;

export default function EventHomeConfig({
  allImages,
  showToast,
}: EventHomeConfigProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const slots: (number | null)[] = Array(HOME_LIMIT).fill(null);
    allImages.forEach((img) => {
      if (img.isFeatured && img.order && img.order >= 1 && img.order <= HOME_LIMIT) {
        slots[img.order - 1] = img.id;
      }
    });

    const orderedFeatured = slots.filter((id): id is number => id !== null);
    if (orderedFeatured.length > 0) {
      setSelectedIds(orderedFeatured);
    } else {
      setSelectedIds(allImages.filter((img) => img.isFeatured).map((img) => img.id));
    }
  }, [allImages]);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/eventos/featured`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featuredIds: selectedIds }),
      });

      if (res.ok) {
        showToast("success", "¡Eventos destacados actualizados correctamente!");
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
    <>
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-sm space-y-6 w-full select-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-extrabold text-[#16275d] tracking-tight">
              Configuración de Eventos en Inicio
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
              Selecciona hasta {HOME_LIMIT} eventos destacados para mostrar en la landing page principal.
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
              disabled={isSaving}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-[#16275d] hover:bg-[#111c38] disabled:bg-slate-400 text-amber-400 text-xs sm:text-sm font-bold rounded-2xl transition-all cursor-pointer shadow-md border border-[#16275d] truncate"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
              ) : (
                <Save className="w-4 h-4 shrink-0 text-amber-400" />
              )}
              <span className="truncate">{isSaving ? "Guardando..." : "Guardar"}</span>
            </button>
          </div>
        </div>

        <EventHomeGrid
          allImages={allImages}
          selectedIds={selectedIds}
          onOpenModal={() => setIsModalOpen(true)}
        />

        <EventModalHome
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          allImages={allImages}
          selectedIds={selectedIds}
          onSaveSelections={setSelectedIds}
          homeLimit={HOME_LIMIT}
        />
      </div>

      <EventHomeAlert
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        limit={HOME_LIMIT}
      />
    </>
  );
}