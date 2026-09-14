// frontend/app/syspanel/(protected)/galeria/components/GalleryHomeConfig.tsx
"use client";

import { useState, useEffect } from "react";
import GalleryHomeGrid from "./GalleryHomeGrid";
import GalleryModalHome from "./GalleryModalHome";
import GalleryHomeAlert from "./GalleryHomeAlert";
import { Pencil, Save } from "lucide-react";

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  isActive: boolean;
  isFeatured?: boolean;
  order?: number;
  createdAt?: string;
}

interface GalleryHomeConfigProps {
  allImages: GalleryItem[];
  showToast: (type: "success" | "error", message: string) => void;
}

export default function GalleryHomeConfig({
  allImages,
  showToast,
}: GalleryHomeConfigProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const HOME_LIMIT = 8;

  useEffect(() => {
    const slots = Array(HOME_LIMIT).fill(null);
    allImages.forEach((img) => {
      if (img.isFeatured && img.order && img.order >= 1 && img.order <= HOME_LIMIT) {
        slots[img.order - 1] = img.id;
      }
    });

    const initialFeatured: number[] = [];
    slots.forEach((id) => {
      if (id !== null) initialFeatured.push(id);
    });

    if (initialFeatured.length === 0) {
      const fallbackFeatured = allImages
        .filter((img) => img.isFeatured)
        .map((img) => img.id);
      setSelectedIds(fallbackFeatured);
    } else {
      setSelectedIds(slots.filter((id): id is number => id !== null));
    }
  }, [allImages]);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("http://localhost:4000/api/galeria/featured", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ featuredIds: selectedIds }),
      });

      if (res.ok) {
        showToast(
          "success",
          "¡Imágenes destacadas actualizadas correctamente!",
        );
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
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Configuración de Imágenes
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Selecciona hasta {HOME_LIMIT} imágenes para mostrar en la sección
              principal del sitio web.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-xs truncate"
            >
              <Pencil className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Editar ({selectedIds.length}/{HOME_LIMIT})</span>
            </button>

            <button
              type="button"
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-xs truncate"
            >
              <Save className="w-3.5 h-3.5 shrink-0" />
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
          onSaveSelections={(newIds) => setSelectedIds(newIds)}
          homeLimit={HOME_LIMIT}
        />
      </div>

      <GalleryHomeAlert
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        limit={HOME_LIMIT}
      />
    </>
  );
}