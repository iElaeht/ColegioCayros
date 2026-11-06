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

  const [initialAlt, setInitialAlt] = useState("");
  const [initialImageUrl, setInitialImageUrl] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

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
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
          setPreviewUrl(
            isHttpSource
              ? currentImg
              : `${apiUrl}${currentImg}`
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

  const hasChanges = (() => {
    if (!editingImage) {
      return alt.trim() !== "" && (imageFile !== null || imageUrl.trim() !== "");
    } else {
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
      <div className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center bg-slate-950/65 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto transform-gpu select-none">
        <div
          className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative flex flex-col my-auto max-h-[92vh] overflow-y-auto transform-gpu custom-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cabecera y Botón de Cierre */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#16275d]">
                {editingImage
                  ? "Editar Imagen de Galería"
                  : "Subir Nueva Imagen"}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {editingImage
                  ? "Modifica los detalles o reemplaza el archivo multimedia."
                  : "Completa los campos para añadir una nueva fotografía institucional."}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-[#16275d] bg-slate-100 hover:bg-slate-200 p-2 rounded-2xl transition-all cursor-pointer border border-slate-200/60 shrink-0"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmitForm} className="space-y-4">
            {/* Vista Previa */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#16275d]">
                Vista Previa
              </label>
              <div
                onClick={() => previewUrl && setShowLightbox(true)}
                className={`relative aspect-[16/9] w-full bg-slate-50 rounded-2xl border border-dashed border-slate-200 overflow-hidden flex items-center justify-center group transform-gpu transition-all ${
                  previewUrl ? "cursor-zoom-in border-solid border-slate-200" : ""
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
                    <div className="absolute inset-0 bg-[#16275d]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 text-white text-xs font-semibold backdrop-blur-[2px]">
                      <Eye className="w-4 h-4 text-amber-400" />
                      <span>Ver imagen completa</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-slate-400">
                    <ImageIcon className="w-8 h-8 stroke-[1.5] text-amber-500" />
                    <span className="text-xs font-semibold text-slate-500">
                      Sin imagen seleccionada
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Título / Alt */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#16275d] mb-1.5">
                Título de la Imagen
              </label>
              <input
                type="text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Ej. Ceremonia de aniversario escolar"
                required
                className="w-full bg-white text-slate-800 text-xs sm:text-sm px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#16275d] focus:ring-2 focus:ring-[#16275d]/10 outline-none transition-all font-semibold shadow-xs"
              />
            </div>

            {/* Selector de Pestañas */}
            <div className="flex gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setInputType("file");
                  setImageUrl("");
                  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
                  if (editingImage && !editingImage.src.startsWith("http")) {
                    setPreviewUrl(`${apiUrl}${editingImage.src}`);
                  }
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  inputType === "file"
                    ? "bg-[#16275d] text-amber-400 shadow-sm"
                    : "text-slate-600 hover:text-[#16275d]"
                }`}
              >
                <Upload className="w-4 h-4 shrink-0" />
                <span>{editingImage ? "Reemplazar Archivo" : "Subir Archivo"}</span>
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
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  inputType === "url"
                    ? "bg-[#16275d] text-amber-400 shadow-sm"
                    : "text-slate-600 hover:text-[#16275d]"
                }`}
              >
                <LinkIcon className="w-4 h-4 shrink-0" />
                <span>Enlace URL</span>
              </button>
            </div>

            {/* Input Condicional */}
            {inputType === "file" ? (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#16275d] mb-1.5">
                  {isLocalFileEditing
                    ? "Nuevo archivo de imagen (Opcional)"
                    : "Seleccionar Archivo (Max 5MB)"}
                </label>
                <input
                  type="file"
                  key={inputType}
                  accept="image/png, image/jpeg, image/webp, image/avif, image/gif, image/svg+xml"
                  onChange={handleFileChange}
                  required={!editingImage && inputType === "file"}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#16275d]/10 file:text-[#16275d] hover:file:bg-[#16275d]/20 cursor-pointer border border-slate-200 rounded-2xl bg-slate-50 p-1 transition-all"
                />
              </div>
            ) : (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#16275d] mb-1.5">
                  URL de la Imagen Externa
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://... pega aquí el enlace de la imagen"
                  required={inputType === "url"}
                  className="w-full bg-white text-slate-800 text-xs sm:text-sm px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#16275d] focus:ring-2 focus:ring-[#16275d]/10 outline-none transition-all font-semibold shadow-xs"
                />
              </div>
            )}

            {/* Botones de Acción y Eliminar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-3">
              {editingImage && onDelete ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2.5 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer flex items-center gap-2 border border-rose-200"
                  title="Eliminar imagen"
                >
                  <Trash2 className="w-4 h-4 shrink-0" />
                  <span>Eliminar</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!hasChanges}
                  className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                    hasChanges
                      ? "bg-[#16275d] hover:bg-[#111c38] text-amber-400 shadow-md cursor-pointer border border-[#16275d]"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border border-slate-200"
                  }`}
                >
                  {editingImage ? "Guardar Cambios" : "Subir Imagen"}
                </button>
              </div>
            </div>
          </form>

          {/* Sub-Modal de Confirmación de Eliminación */}
          {showDeleteConfirm && (
            <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm rounded-3xl p-6 flex flex-col items-center justify-center text-center animate-in fade-in duration-150 transform-gpu">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mb-4 shadow-xs">
                <AlertTriangle className="w-7 h-7 stroke-[2]" />
              </div>
              <h3 className="text-base font-bold text-[#16275d] mb-1">
                ¿Eliminar esta imagen?
              </h3>
              <p className="text-xs text-slate-500 font-medium max-w-xs mb-6">
                Esta acción es irreversible y la fotografía se removerá del sistema permanentemente.
              </p>
              <div className="flex gap-3 w-full max-w-xs">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 rounded-2xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    onDelete?.();
                  }}
                  className="flex-1 py-3 rounded-2xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-colors cursor-pointer"
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
              className="absolute -top-12 right-0 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-2xl transition-all cursor-pointer border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Vista detallada"
              className="max-h-[85vh] max-w-full object-contain rounded-3xl shadow-2xl border border-white/10 transform-gpu"
            />
          </div>
        </div>
      )}
    </>
  );
}