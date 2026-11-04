// frontend/app/syspanel/galeria/components/GalleryModal.tsx
"use client";

import { useState, useEffect } from "react";
import {
  X,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Trash2,
  Eye,
  AlertTriangle,
} from "lucide-react";

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  isActive: boolean;
}

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: {
    alt: string;
    imageUrl: string;
    imageFile: File | null;
  }) => void;
  onDelete?: () => void;
  editingImage: GalleryItem | null;
}

export default function GalleryModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  editingImage,
}: GalleryModalProps) {
  const [alt, setAlt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [inputType, setInputType] = useState<"file" | "url">("file");
  const [previewUrl, setPreviewUrl] = useState("");

  // Estados para comparar cambios en modo edición
  const [initialAlt, setInitialAlt] = useState("");
  const [initialImageUrl, setInitialImageUrl] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  // EFECTO CLAVE: Bloquea el scroll del body global y escucha la tecla ESC
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      if (editingImage) {
        const currentAlt = editingImage.alt || "";
        const currentImg = editingImage.src || "";

        setAlt(currentAlt);
        setInitialAlt(currentAlt);

        const isHttpSource = currentImg.startsWith("http") || false;
        setInputType(isHttpSource ? "url" : "file");
        setImageUrl(isHttpSource ? currentImg : "");
        setInitialImageUrl(currentImg);
        setImageFile(null);

        if (!currentImg) {
          setPreviewUrl("");
        } else {
          setPreviewUrl(
            isHttpSource
              ? currentImg
              : `http://localhost:4000${currentImg}`
          );
        }
      } else {
        setAlt("");
        setInitialAlt("");
        setImageUrl("");
        setInitialImageUrl("");
        setImageFile(null);
        setInputType("file");
        setPreviewUrl("");
      }
    } else {
      setShowLightbox(false);
      setShowDeleteConfirm(false);
    }
  }, [isOpen, editingImage]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleUrlChange = (val: string) => {
    setImageUrl(val);
    setPreviewUrl(val);
  };

  // DETECCIÓN DE CAMBIOS PARA EDICIÓN VS CREACIÓN
  const hasChanges = (() => {
    if (!editingImage) {
      // Modo Creación: requiere al menos título (alt) y una fuente de imagen
      return alt.trim() !== "" && (imageFile !== null || imageUrl.trim() !== "");
    } else {
      // Modo Edición: se habilita si cambia el alt, si se selecciona un nuevo archivo, o si cambia la URL
      const altChanged = alt.trim() !== initialAlt.trim();
      const fileAdded = imageFile !== null;
      const urlChanged = inputType === "url" && imageUrl.trim() !== initialImageUrl;
      return altChanged || fileAdded || urlChanged;
    }
  })();

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges) return;
    onSubmit({ alt: alt.trim(), imageUrl: imageUrl.trim(), imageFile });
  };

  const isLocalFileEditing =
    editingImage && !editingImage.src.startsWith("http");

  return (
    <>
      {/* Modal Principal */}
      <div className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center bg-slate-950/65 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto transform-gpu">
        <div
          className="bg-white border border-slate-100 rounded-xl w-full max-w-md pl-6 pr-4 py-5 shadow-2xl relative flex flex-col my-auto max-h-[92vh] overflow-y-auto transform-gpu 
          [&::-webkit-scrollbar]:w-1.5 
          [&::-webkit-scrollbar-track]:bg-transparent 
          [&::-webkit-scrollbar-thumb]:bg-slate-200 
          [&::-webkit-scrollbar-thumb]:rounded-full 
          hover:[&::-webkit-scrollbar-thumb]:bg-slate-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botón de Cierre Absoluto */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 text-blue-600 hover:text-blue-800 bg-transparent p-1.5 rounded-xl transition-colors duration-200 cursor-pointer z-10"
            title="Cerrar"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Contenedor interno optimizado */}
          <div className="pr-2">
            {/* Cabecera */}
            <div className="pb-3 border-b border-slate-100 mb-4 pr-7">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-800">
                  {editingImage
                    ? "Editar Imagen de Galería"
                    : "Subir Nueva Imagen"}
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {editingImage
                    ? "Modifica los detalles o reemplaza el archivo."
                    : "Completa los campos para añadir una nueva tarjeta."}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Vista Previa Compacta */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Vista Previa
                </label>
                <div
                  onClick={() => previewUrl && setShowLightbox(true)}
                  className={`relative aspect-[16/9] w-full bg-indigo-50/20 rounded-xl border-2 border-dashed border-indigo-300/70 overflow-hidden flex items-center justify-center group transform-gpu transition-all ${
                    previewUrl ? "cursor-zoom-in border-solid border-slate-200 bg-slate-50" : ""
                  }`}
                >
                  {previewUrl ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl}
                        alt="Vista previa"
                        onError={() => {}}
                        className="w-full h-full object-cover transition-transform duration-300 transform-gpu group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1.5 text-white text-xs font-semibold transform-gpu">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver imagen completa</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-indigo-400">
                      <ImageIcon className="w-6 h-6 stroke-[1.5] text-indigo-400" />
                      <span className="text-[11px] font-medium text-indigo-500">
                        Sin imagen seleccionada
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Título / Alt */}
              <div>
                <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  placeholder="Ej. Laboratorio de cómputo modernizado"
                  required
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none transition-all font-medium"
                />
              </div>

              {/* Selector de Pestañas con rounded-xl */}
              <div className="flex gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/60 transform-gpu">
                <button
                  type="button"
                  onClick={() => {
                    setInputType("file");
                    setImageUrl("");
                    if (editingImage && !editingImage.src.startsWith("http")) {
                      setPreviewUrl(`http://localhost:4000${editingImage.src}`);
                    }
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-colors duration-200 cursor-pointer flex items-center justify-center gap-1.5 transform-gpu ${
                    inputType === "file"
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Upload className="w-3.5 h-3.5 text-amber-600" />
                  <span>{editingImage ? "Reemplazar" : "Subir Archivo"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputType("url");
                    setImageFile(null);
                    if (editingImage && editingImage.src.startsWith("http")) {
                      setImageUrl(editingImage.src);
                      setPreviewUrl(editingImage.src);
                    } else {
                      setPreviewUrl(imageUrl);
                    }
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-colors duration-200 cursor-pointer flex items-center justify-center gap-1.5 transform-gpu ${
                    inputType === "url"
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5 text-amber-600" />
                  <span>Enlace URL</span>
                </button>
              </div>

              {/* Input Condicional */}
              {inputType === "file" ? (
                <div>
                  <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    {isLocalFileEditing
                      ? "Nuevo archivo (Opcional)"
                      : "Seleccionar Archivo (Max 5MB)"}
                  </label>
                  <input
                    type="file"
                    key={inputType}
                    accept="image/png, image/jpeg, image/webp, image/avif, image/gif, image/svg+xml"
                    onChange={handleFileChange}
                    required={!editingImage && inputType === "file"}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer border border-slate-200 rounded-xl bg-slate-50 p-1 transition-all"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    URL de la Imagen Externa
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://... pega aquí el enlace"
                    required={inputType === "url"}
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none transition-all font-medium"
                  />
                </div>
              )}

              {/* Botones de Acción y Eliminar con rounded-xl */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-1">
                {editingImage && onDelete ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors duration-200 cursor-pointer flex items-center gap-1 border border-rose-100"
                    title="Eliminar imagen"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors duration-200 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!hasChanges}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                      hasChanges
                        ? "bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 cursor-pointer"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    }`}
                  >
                    {editingImage ? "Guardar Cambios" : "Subir Imagen"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Sub-Modal de Confirmación de Eliminación */}
          {showDeleteConfirm && (
            <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm rounded-xl p-5 flex flex-col items-center justify-center text-center animate-in fade-in duration-150 transform-gpu">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2.5 shadow-sm">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-1">
                ¿Eliminar esta imagen?
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mb-5">
                Esta acción es irreversible y se removerá de la galería permanentemente.
              </p>
              <div className="flex gap-2 w-full max-w-xs">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors duration-200 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    onDelete?.();
                  }}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20 transition-colors duration-200 cursor-pointer"
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sub-Modal: Visor de Imagen Completa (Lightbox) */}
      {showLightbox && previewUrl && (
        <div
          className="fixed inset-0 z-[60] w-screen h-screen flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in duration-200 cursor-default transform-gpu"
          onClick={() => setShowLightbox(false)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center transform-gpu"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowLightbox(false)}
              className="absolute -top-12 right-0 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors duration-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Vista detallada"
              className="max-h-[85vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10 transform-gpu"
            />
          </div>
        </div>
      )}
    </>
  );
}