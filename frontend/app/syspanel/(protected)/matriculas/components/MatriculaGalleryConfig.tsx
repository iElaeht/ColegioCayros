// frontend/app/syspanel/matriculas/components/MatriculaGalleryConfig.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Upload, Trash2, Eye, EyeOff, Edit2, Save, X, Plus } from "lucide-react";
import ToastAlertMatricula from "./ToastAlertMatricula";

interface MatriculaGaleriaItem {
  id: number;
  imageUrl: string;
  title?: string | null;
  isActive: boolean;
  order: number;
}

export default function MatriculaGalleryConfig() {
  const [slides, setSlides] = useState<MatriculaGaleriaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Estados para el Modal de Subida / Edición de un slot específico
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<number>(0);
  const [slideTitle, setSlideTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Cargar TODAS las imágenes de la galería para administración usando la ruta /admin
  const fetchGaleria = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/matricula-galeria/admin");
      const data = await res.json();
      if (Array.isArray(data)) {
        setSlides(data);
      }
    } catch (err) {
      console.error("Error al cargar galería de matrículas:", err);
      setToast({ message: "Error al conectar con el servidor.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGaleria();
  }, []);

  // Abrir modal para un slot específico (del 0 al 7 para 8 slots)
  const handleOpenSlot = (orderIndex: number) => {
    const existing = slides.find((s) => s.order === orderIndex);
    setCurrentOrder(orderIndex);
    if (existing) {
      setSlideTitle(existing.title || "");
      setPreviewUrl(
        existing.imageUrl.startsWith("http")
          ? existing.imageUrl
          : `http://localhost:4000${existing.imageUrl}`
      );
    } else {
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

  // Guardar o actualizar imagen en el slot
  const handleSubmitSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const existing = slides.find((s) => s.order === currentOrder);
    const formData = new FormData();
    
    // CORRECCIÓN CLAVE: Debe llamarse "imageFile" tal como lo espera multer en el backend
    if (selectedFile) {
      formData.append("imageFile", selectedFile);
    }
    formData.append("title", slideTitle);
    formData.append("order", String(currentOrder));

    try {
      let url = "http://localhost:4000/api/matricula-galeria";
      let method = "POST";

      if (existing) {
        url = `http://localhost:4000/api/matricula-galeria/${existing.id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        setToast({ message: "Imagen guardada correctamente en el carrusel.", type: "success" });
        setIsModalOpen(false);
        fetchGaleria();
      } else {
        const errorData = await res.json();
        setToast({ message: errorData.error || "Error al guardar la imagen.", type: "error" });
      }
    } catch (err) {
      console.error("Error de red:", err);
      setToast({ message: "Error de red al procesar la solicitud.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  // Alternar estado activo / oculto
  const handleToggleActive = async (id: number, currentActive: boolean) => {
    try {
      const res = await fetch(`http://localhost:4000/api/matricula-galeria/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentActive }),
      });
      if (res.ok) {
        setSlides(slides.map((s) => (s.id === id ? { ...s, isActive: !currentActive } : s)));
        setToast({ message: "Estado de la imagen actualizado.", type: "success" });
      }
    } catch (err) {
      console.error("Error al alternar estado:", err);
    }
  };

  // Eliminar imagen del slot
  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de vaciar este espacio del carrusel?")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/matricula-galeria/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSlides(slides.filter((s) => s.id !== id));
        setToast({ message: "Espacio vaciado con éxito.", type: "success" });
      }
    } catch (err) {
      console.error("Error al eliminar:", err);
      setToast({ message: "Error al intentar eliminar la imagen.", type: "error" });
    }
  };

  // Generamos los 8 slots fijos (del 0 al 7)
  const slots = Array.from({ length: 8 }, (_, index) => {
    return slides.find((s) => s.order === index) || null;
  });

  return (
    <div className="space-y-6 relative">
      {/* Toast Flotante */}
      {toast && (
        <ToastAlertMatricula
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Cabecera de Configuración de Imágenes */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-base font-bold text-[#16275D]">Configuración de Imágenes del Carrusel</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Selecciona hasta 8 espacios para mostrar en el carrusel de la página pública de matrículas.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200/60 self-start sm:self-auto">
            {slides.length} de 8 espacios ocupados
          </span>
        </div>

        {/* Grid de 8 Slots Estilo Tarjeta */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">
            Cargando espacios del carrusel...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {slots.map((item, index) => {
              const slotNumber = index + 1;
              if (!item) {
                // Slot Vacío
                return (
                  <div
                    key={index}
                    onClick={() => handleOpenSlot(index)}
                    className="border-2 border-dashed border-slate-200 hover:border-[#16275D] bg-slate-50/50 hover:bg-slate-50 rounded-2xl aspect-[16/10] flex flex-col items-center justify-center cursor-pointer transition-all group p-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-[#16275D]/10 flex items-center justify-center text-slate-400 group-hover:text-[#16275D] transition-colors mb-2 shadow-sm">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-500 group-hover:text-[#16275D]">Espacio #{slotNumber}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Vacío (Clic para agregar)</span>
                  </div>
                );
              }

              // Slot Ocupado
              const resolvedImg = item.imageUrl.startsWith("http")
                ? item.imageUrl
                : `http://localhost:4000${item.imageUrl}`;

              return (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                    <Image src={resolvedImg} alt={item.title || "Carrusel Matrícula"} fill className="object-cover" unoptimized />
                    <div className="absolute top-2 right-2">
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md shadow-sm ${item.isActive ? "bg-emerald-500 text-white" : "bg-slate-700 text-white"}`}>
                        {item.isActive ? "Activo" : "Oculto"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 truncate" title={item.title || `Slot #${slotNumber}`}>
                      {item.title || `Slot #${slotNumber}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenSlot(index)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="Editar imagen"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleToggleActive(item.id, item.isActive)}
                      className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title={item.isActive ? "Ocultar" : "Mostrar"}
                    >
                      {item.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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

      {/* MODAL PARA SUBIR / EDITAR IMAGEN DEL SLOT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            
            <div className="bg-[#16275D] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold">Configurar Espacio #{currentOrder + 1} del Carrusel</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitSlot} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Título o Referencia (Opcional)</label>
                <input
                  type="text"
                  value={slideTitle}
                  onChange={(e) => setSlideTitle(e.target.value)}
                  placeholder="Ej. Promoción Admisión 2027"
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#16275D] focus:bg-white outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Imagen del Carrusel</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#16275D] file:text-white hover:file:bg-blue-900 cursor-pointer"
                />
              </div>

              {previewUrl && (
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
                  <Image src={previewUrl} alt="Vista previa" fill className="object-cover" unoptimized />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#16275D] hover:bg-blue-900 text-white transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Guardando..." : "Guardar Imagen"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}