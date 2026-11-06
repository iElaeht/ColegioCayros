// frontend/app/syspanel/(protected)/hero/components/HeroModal.tsx
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

interface HeroSlideItem {
  id: number;
  title?: string | null;
  imageUrl: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt?: string;
}

interface HeroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: {
    title: string;
    imageUrl: string;
    imageFile: File | null;
  }) => void;
  onDelete?: () => void;
  editingItem: HeroSlideItem | null;
}

export default function HeroModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  editingItem,
}: HeroModalProps) {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [inputType, setInputType] = useState<"file" | "url">("file");
  const [previewUrl, setPreviewUrl] = useState("");

  const [initialTitle, setInitialTitle] = useState("");
  const [initialImageUrl, setInitialImageUrl] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  // Bloqueo de scroll seguro y manejo de la tecla ESC jerárquico
  useEffect(() => {
    if (!isOpen) return;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showLightbox) {
          setShowLightbox(false);
        } else if (showDeleteConfirm) {
          setShowDeleteConfirm(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [isOpen, showLightbox, showDeleteConfirm, onClose]);

  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        const currentTitle = editingItem.title || "";
        const currentImg = editingItem.imageUrl || "";

        setTitle(currentTitle);
        setInitialTitle(currentTitle);

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
        setTitle("");
        setInitialTitle("");
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
  }, [isOpen, editingItem]);

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
    if (!editingItem) {
      return title.trim() !== "" && (imageFile !== null || imageUrl.trim() !== "");
    } else {
      const titleChanged = title.trim() !== initialTitle.trim();
      const fileAdded = imageFile !== null;
      const urlChanged = inputType === "url" && imageUrl.trim() !== initialImageUrl;
      return titleChanged || fileAdded || urlChanged;
    }
  })();

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges) return;
    onSubmit({ title: title.trim(), imageUrl: imageUrl.trim(), imageFile });
  };

  const isLocalFileEditing =
    editingItem && !editingItem.imageUrl.startsWith("http");

  return (
    <>
      {/* Modal Principal */}
      <div className="fixed inset-0 z-[99999] overflow-y-auto bg-slate-950/65 backdrop-blur-md flex min-h-full items-center justify-center p-3 sm:p-6 select-none animate-in fade-in duration-200">
        <div
          className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 shadow-2xl relative flex flex-col my-auto max-h-[85vh] overflow-y-auto custom-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botón de Cierre Absoluto */}
          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              onClose();
            }}
            className="absolute top-5 right-5 text-slate-400 hover:text-[#16275d] bg-slate-100/80 hover:bg-slate-200 p-2 rounded-xl transition-all duration-200 cursor-pointer z-10 outline-none"
            title="Cerrar"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Cabecera */}
          <div className="pb-4 border-b border-slate-100 mb-4 pr-8">
            <h2 className="text-base font-extrabold text-[#16275d] tracking-tight">
              {editingItem
                ? "Editar Banner de Hero"
                : "Subir Nuevo Banner"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              {editingItem
                ? "Modifica los detalles o reemplaza el archivo."
                : "Completa los campos para añadir un nuevo banner."}
            </p>
          </div>

          <form onSubmit={handleSubmitForm} className="space-y-4">
            {/* Vista Previa */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Vista Previa
              </label>
              <div
                onClick={() => previewUrl && setShowLightbox(true)}
                className={`relative aspect-[16/9] w-full bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center group transition-all ${
                  previewUrl ? "cursor-zoom-in border-solid border-slate-300" : ""
                }`}
              >
                {previewUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Vista previa"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1.5 text-white text-xs font-semibold">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver imagen completa</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-slate-400">
                    <ImageIcon className="w-6 h-6 stroke-[1.5] text-slate-400" />
                    <span className="text-xs font-semibold text-slate-500">
                      Sin imagen seleccionada
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Título */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Título
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Bienvenidos al nuevo año escolar"
                required
                className="w-full bg-white text-slate-800 text-xs px-3.5 py-3 rounded-xl border border-slate-200 focus:border-[#16275d] focus:ring-2 focus:ring-[#16275d]/10 outline-none transition-all font-medium shadow-xs"
              />
            </div>

            {/* Selector de Pestañas */}
            <div className="flex gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  setInputType("file");
                  setImageUrl("");
                  if (editingItem && !editingItem.imageUrl.startsWith("http")) {
                    setPreviewUrl(`http://localhost:4000${editingItem.imageUrl}`);
                  }
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors duration-200 cursor-pointer flex items-center justify-center gap-1.5 outline-none ${
                  inputType === "file"
                    ? "bg-[#16275d] text-amber-400 shadow-sm"
                    : "text-slate-600 hover:text-[#16275d]"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{editingItem ? "Reemplazar" : "Subir Archivo"}</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  setInputType("url");
                  setImageFile(null);
                  if (editingItem && editingItem.imageUrl.startsWith("http")) {
                    setImageUrl(editingItem.imageUrl);
                    setPreviewUrl(editingItem.imageUrl);
                  } else {
                    setPreviewUrl(imageUrl);
                  }
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors duration-200 cursor-pointer flex items-center justify-center gap-1.5 outline-none ${
                  inputType === "url"
                    ? "bg-[#16275d] text-amber-400 shadow-sm"
                    : "text-slate-600 hover:text-[#16275d]"
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Enlace URL</span>
              </button>
            </div>

            {/* Input Condicional */}
            {inputType === "file" ? (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  {isLocalFileEditing
                    ? "Nuevo archivo (Opcional)"
                    : "Seleccionar Archivo (Max 5MB)"}
                </label>
                <input
                  type="file"
                  key={inputType}
                  accept="image/png, image/jpeg, image/webp, image/avif, image/gif, image/svg+xml"
                  onChange={handleFileChange}
                  required={!editingItem && inputType === "file"}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2.5 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#16275d] file:text-amber-400 hover:file:bg-[#111c38] cursor-pointer border border-slate-200 rounded-xl bg-slate-50 p-1 transition-all"
                />
              </div>
            ) : (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  URL de la Imagen Externa
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://... pega aquí el enlace"
                  required={inputType === "url"}
                  className="w-full bg-white text-slate-800 text-xs px-3.5 py-3 rounded-xl border border-slate-200 focus:border-[#16275d] focus:ring-2 focus:ring-[#16275d]/10 outline-none transition-all font-medium shadow-xs"
                />
              </div>
            )}

            {/* Botones de Acción y Eliminar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
              {editingItem && onDelete ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    setShowDeleteConfirm(true);
                  }}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors duration-200 cursor-pointer flex items-center gap-1.5 border border-rose-100 outline-none"
                  title="Eliminar banner"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Eliminar</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    onClose();
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors duration-200 cursor-pointer outline-none"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!hasChanges}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 outline-none shadow-sm ${
                    hasChanges
                      ? "bg-[#16275d] hover:bg-[#111c38] text-amber-400 cursor-pointer border border-[#16275d]"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border border-transparent"
                  }`}
                >
                  {editingItem ? "Guardar Cambios" : "Subir Banner"}
                </button>
              </div>
            </div>
          </form>

          {/* Sub-Modal de Confirmación de Eliminación */}
          {showDeleteConfirm && (
            <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm rounded-3xl p-6 flex flex-col items-center justify-center text-center animate-in fade-in duration-150">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 shadow-sm border border-rose-100">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-1">
                ¿Eliminar este banner?
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mb-5 font-medium">
                Esta acción es irreversible y se removerá del sistema permanentemente.
              </p>
              <div className="flex gap-2.5 w-full max-w-xs">
                <button
                  type="button"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    setShowDeleteConfirm(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors duration-200 cursor-pointer outline-none"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    setShowDeleteConfirm(false);
                    onDelete?.();
                  }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition-colors duration-200 cursor-pointer outline-none"
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
          className="fixed inset-0 z-[99999] w-screen h-screen flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in duration-200 cursor-default"
          onClick={() => setShowLightbox(false)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowLightbox(false)}
              className="absolute -top-12 right-0 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors duration-200 cursor-pointer outline-none"
            >
              <X className="w-5 h-5" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Vista detallada"
              className="max-h-[85vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}
    </>
  );
}