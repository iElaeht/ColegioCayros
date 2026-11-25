"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Trash2, Eye, EyeOff, Edit2, X, Plus, Save } from "lucide-react";

export interface MatriculaGaleriaItem {
  id: number;
  imageUrl: string;
  title?: string | null;
  isActive: boolean;
  order: number;
}

interface MatriculaGalleryConfigProps {
  slides: MatriculaGaleriaItem[];
  loading: boolean;
  onSaveSlot: (payload: {
    order: number;
    title: string;
    file: File | null;
    existingId?: number;
  }) => Promise<boolean>;
  onToggleActive: (id: number, currentActive: boolean) => Promise<void>;
  onDeleteSlot: (id: number) => Promise<void>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function MatriculaGalleryConfig({
  slides,
  loading,
  onSaveSlot,
  onToggleActive,
  onDeleteSlot,
}: MatriculaGalleryConfigProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<number>(0);
  const [existingId, setExistingId] = useState<number | undefined>(undefined);
  const [slideTitle, setSlideTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isModalOpen) return;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [isModalOpen]);

  const handleOpenSlot = (e: React.MouseEvent | React.SyntheticEvent, orderIndex: number) => {
    e.currentTarget.blur();
    const existing = slides.find((s) => s.order === orderIndex);
    setCurrentOrder(orderIndex);
    if (existing) {
      setExistingId(existing.id);
      setSlideTitle(existing.title || "");
      setPreviewUrl(
        existing.imageUrl.startsWith("http")
          ? existing.imageUrl
          : `${API_URL}${existing.imageUrl}`
      );
    } else {
      setExistingId(undefined);
      setSlideTitle("");
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmitSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const ok = await onSaveSlot({
        order: currentOrder,
        title: slideTitle,
        file: selectedFile,
        existingId,
      });
      if (ok) {
        setIsModalOpen(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleClick = async (
    e: React.MouseEvent<HTMLButtonElement>,
    id: number,
    currentActive: boolean
  ) => {
    e.currentTarget.blur();
    await onToggleActive(id, currentActive);
  };

  const handleDeleteClick = async (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.currentTarget.blur();
    if (!confirm("¿Estás seguro de vaciar este espacio del carrusel?")) return;
    await onDeleteSlot(id);
  };

  const slots = Array.from({ length: 8 }, (_, index) => {
    return slides.find((s) => s.order === index) || null;
  });

  return (
    <div className="space-y-6 relative select-none">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/85 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-base font-extrabold text-[#16275d] tracking-tight">
              Configuración de Imágenes del Carrusel
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Selecciona hasta 8 espacios para mostrar en el carrusel de la página pública de matrículas.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200/60 self-start sm:self-auto">
            {slides.length} de 8 espacios ocupados
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">
            Cargando espacios del carrusel...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {slots.map((item, index) => {
              const slotNumber = index + 1;
              const uniqueKey = item ? `slot-occupied-${item.id}` : `slot-empty-${index}`;

              if (!item) {
                return (
                  <div
                    key={uniqueKey}
                    onClick={(e) => handleOpenSlot(e, index)}
                    className="border-2 border-dashed border-slate-200 hover:border-[#16275d] bg-slate-50/50 hover:bg-[#16275d]/5 rounded-2xl aspect-[16/10] flex flex-col items-center justify-center cursor-pointer transition-all group p-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-[#16275d]/10 flex items-center justify-center text-slate-400 group-hover:text-[#16275d] transition-colors mb-2 shadow-xs">
                      <Plus className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 group-hover:text-[#16275d]">
                      Espacio #{slotNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                      Vacío (Clic para agregar)
                    </span>
                  </div>
                );
              }

              const resolvedImg = item.imageUrl.startsWith("http")
                ? item.imageUrl
                : `${API_URL}${item.imageUrl}`;

              return (
                <div
                  key={uniqueKey}
                  className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                    <Image
                      src={resolvedImg}
                      alt={item.title || "Carrusel Matrícula"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute top-2 right-2">
                      <span
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md shadow-xs ${
                          item.isActive ? "bg-emerald-500 text-white" : "bg-slate-700 text-white"
                        }`}
                      >
                        {item.isActive ? "Activo" : "Oculto"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className="text-xs font-bold text-[#16275d] truncate"
                      title={item.title || `Slot #${slotNumber}`}
                    >
                      {item.title || `Slot #${slotNumber}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={(e) => handleOpenSlot(e, index)}
                      className="p-2 text-[#16275d] hover:bg-[#16275d]/10 rounded-xl transition-colors cursor-pointer outline-none"
                      title="Editar imagen"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleToggleClick(e, item.id, item.isActive)}
                      className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer outline-none"
                      title={item.isActive ? "Ocultar" : "Mostrar"}
                    >
                      {item.isActive ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleDeleteClick(e, item.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer outline-none"
                      title="Vaciar espacio"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[99999] overflow-y-auto bg-slate-950/65 backdrop-blur-md flex min-h-full items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-auto flex flex-col">
            <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <h3 className="text-sm font-extrabold text-[#16275d] tracking-tight">
                Configurar Espacio #{currentOrder + 1} del Carrusel
              </h3>
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  setIsModalOpen(false);
                }}
                className="p-2 text-slate-400 hover:text-[#16275d] bg-slate-100/80 hover:bg-slate-200 rounded-xl transition-all cursor-pointer outline-none"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <form onSubmit={handleSubmitSlot} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Título o Referencia (Opcional)
                </label>
                <input
                  type="text"
                  value={slideTitle}
                  onChange={(e) => setSlideTitle(e.target.value)}
                  placeholder="Ej. Promoción Admisión 2027"
                  className="w-full bg-white text-slate-800 text-xs px-3.5 py-3 rounded-xl border border-slate-200 focus:border-[#16275d] focus:ring-2 focus:ring-[#16275d]/10 outline-none font-semibold shadow-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Imagen del Carrusel
                </label>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/avif, image/gif, image/svg+xml"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2.5 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#16275d] file:text-amber-400 hover:file:bg-[#111c38] cursor-pointer border border-slate-200 rounded-xl bg-slate-50 p-1 transition-all"
                />
              </div>

              {previewUrl && (
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs">
                  <Image
                    src={previewUrl}
                    alt="Vista previa"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    setIsModalOpen(false);
                  }}
                  className="px-4.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer outline-none"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#16275d] hover:bg-[#111c38] text-amber-400 transition-all shadow-sm cursor-pointer disabled:opacity-50 outline-none border border-[#16275d]"
                >
                  <Save className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{submitting ? "Guardando..." : "Guardar Imagen"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}