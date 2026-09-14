// frontend/app/syspanel/eventos/components/modal/EventModal.tsx
"use client";

import { useState, useEffect } from "react";
import {
  X,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Trash2,
  Eye,
} from "lucide-react";

interface EventItem {
  id: number;
  src: string;
  alt: string;
  descripcion?: string | null;
  isActive: boolean;
}

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: {
    alt: string;
    descripcion: string;
    imageUrl: string;
    imageFile: File | null;
  }) => void;
  onDelete?: () => void;
  editingImage: EventItem | null;
}

export default function EventModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  editingImage,
}: EventModalProps) {
  const [alt, setAlt] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [inputType, setInputType] = useState<"file" | "url">("file");
  const [previewUrl, setPreviewUrl] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      if (editingImage) {
        setAlt(editingImage.alt || "");
        setDescripcion(editingImage.descripcion || "");
        const isHttpSource = editingImage.src?.startsWith("http") || false;
        setInputType(isHttpSource ? "url" : "file");
        setImageUrl(isHttpSource ? editingImage.src : "");
        setImageFile(null);

        if (!editingImage.src) {
          setPreviewUrl("");
        } else {
          setPreviewUrl(
            isHttpSource
              ? editingImage.src
              : `http://localhost:4000${editingImage.src}`
          );
        }
      } else {
        setAlt("");
        setDescripcion("");
        setImageUrl("");
        setImageFile(null);
        setInputType("file");
        setPreviewUrl("");
      }
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
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

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      alt: alt.trim(),
      descripcion: descripcion.trim(),
      imageUrl: imageUrl.trim(),
      imageFile,
    });
  };

  const isLocalFileEditing =
    editingImage && !editingImage.src.startsWith("http");

  return (
    <>
      {/* Modal Principal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-md p-4 animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          className="bg-white border border-slate-100 rounded-3xl w-full max-w-lg px-7 pt-7 pb-8 shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cabecera */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-800">
                {editingImage ? "Editar Evento" : "Subir Nuevo Evento"}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {editingImage
                  ? "Modifica los detalles o reemplaza el archivo multimedia."
                  : "Completa los campos para añadir un nuevo evento a la vista."}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmitForm} className="space-y-4">
            {/* Vista Previa */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Vista Previa
              </label>
              <div
                onClick={() => previewUrl && setShowLightbox(true)}
                className={`relative aspect-[16/9] w-full bg-slate-50 rounded-2xl border border-dashed border-slate-200 overflow-hidden flex items-center justify-center group ${
                  previewUrl ? "cursor-zoom-in" : ""
                }`}
              >
                {previewUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Vista previa"
                      onError={() => {}}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold">
                      <Eye className="w-4 h-4" />
                      <span>Ver imagen completa</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-slate-400">
                    <ImageIcon className="w-8 h-8 stroke-[1.5] text-amber-500/70" />
                    <span className="text-xs font-medium">
                      Sin imagen seleccionada
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Título / Alt */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Título
              </label>
              <input
                type="text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Ej. Conferencia anual de tecnología"
                required
                className="w-full bg-slate-50 text-slate-800 text-xs px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none transition-all font-medium"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Descripción detallada
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Escribe una breve descripción del evento..."
                rows={3}
                className="w-full bg-slate-50 text-slate-800 text-xs px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none transition-all font-medium resize-none custom-scrollbar"
              />
            </div>

            {/* Selector de Pestañas */}
            <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/60">
              <button
                type="button"
                onClick={() => {
                  setInputType("file");
                  setImageUrl("");
                  setImageFile(null);
                  setPreviewUrl("");
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  inputType === "file"
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  {editingImage ? "Reemplazar Archivo" : "Subir Archivo"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setInputType("url");
                  setImageFile(null);
                  setPreviewUrl(imageUrl);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
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
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
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
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer border border-slate-200 rounded-xl bg-slate-50 p-1 transition-all"
                />
              </div>
            ) : (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  URL de la Imagen Externa
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://scontent... pega aquí el enlace de la imagen"
                  required={inputType === "url"}
                  className="w-full bg-slate-50 text-slate-800 text-xs px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none transition-all font-medium"
                />
              </div>
            )}

            {/* Botones de Acción y Eliminar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
              {editingImage && onDelete ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer flex items-center gap-1.5 border border-rose-100"
                  title="Eliminar evento"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Eliminar</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  {editingImage ? "Guardar Cambios" : "Subir Evento"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Sub-Modal: Confirmación de Eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-sm p-6 shadow-2xl flex flex-col text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              ¿Eliminar este evento?
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Esta acción es irreversible y se removerá de los eventos permanentemente.
            </p>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  onDelete?.();
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20 transition-colors cursor-pointer"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Modal: Visor de Imagen Completa (Lightbox) */}
      {showLightbox && previewUrl && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in duration-200 cursor-default"
          onClick={() => setShowLightbox(false)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowLightbox(false)}
              className="absolute -top-12 right-0 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all cursor-pointer"
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