// frontend/app/syspanel/videos/components/VideoModal.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Video as VideoIcon,
  Upload,
  Link as LinkIcon,
  Trash2,
  Eye,
  Globe,
  Music2,
} from "lucide-react";

interface VideoItem {
  id: number;
  src: string;
  alt: string;
  isActive: boolean;
}

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: {
    alt: string;
    videoUrl: string;
    videoFile: File | null;
  }) => void;
  onDelete?: () => void;
  editingVideo: VideoItem | null;
}

const tiktokThumbnailCache: Record<string, string> = {};

export default function VideoModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  editingVideo,
}: VideoModalProps) {
  const [alt, setAlt] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [inputType, setInputType] = useState<"file" | "url">("file");
  const [previewUrl, setPreviewUrl] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [tiktokThumb, setTiktokThumb] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      if (editingVideo) {
        setAlt(editingVideo.alt || "");
        const isHttpSource = editingVideo.src?.startsWith("http") || false;
        setInputType(isHttpSource ? "url" : "file");
        setVideoUrl(isHttpSource ? editingVideo.src : "");
        setVideoFile(null);

        if (!editingVideo.src) {
          setPreviewUrl("");
        } else {
          const initialUrl = isHttpSource
            ? editingVideo.src
            : `http://localhost:4000${editingVideo.src}`;
          setPreviewUrl(initialUrl);

          // Si es TikTok, revisamos la caché global
          if (isHttpSource && editingVideo.src.includes("tiktok.com")) {
            setTiktokThumb(tiktokThumbnailCache[editingVideo.src] || "");
          } else {
            setTiktokThumb("");
          }
        }
      } else {
        setAlt("");
        setVideoUrl("");
        setVideoFile(null);
        setInputType("file");
        setPreviewUrl("");
        setTiktokThumb("");
      }
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, editingVideo]);

  // Petición oEmbed para TikTok de forma idéntica a VideoCard
  useEffect(() => {
    const isHttpUrl = previewUrl.startsWith('http://') || previewUrl.startsWith('https://');
    const isTikTok = isHttpUrl && previewUrl.includes('tiktok.com');

    if (isTikTok && !tiktokThumb && !tiktokThumbnailCache[previewUrl]) {
      fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(previewUrl)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.thumbnail_url) {
            tiktokThumbnailCache[previewUrl] = data.thumbnail_url;
            setTiktokThumb(data.thumbnail_url);
          }
        })
        .catch(() => {});
    }
  }, [previewUrl, tiktokThumb]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setVideoFile(file);
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setTiktokThumb("");
    }
  };

  const handleUrlChange = (val: string) => {
    setVideoUrl(val);
    setPreviewUrl(val);
    if (val.includes("tiktok.com")) {
      setTiktokThumb(tiktokThumbnailCache[val] || "");
    } else {
      setTiktokThumb("");
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ alt: alt.trim(), videoUrl: videoUrl.trim(), videoFile });
  };

  const isLocalFileEditing =
    editingVideo && !editingVideo.src.startsWith("http");

  // Detección de enlaces externos
  const isHttpUrl = previewUrl.startsWith('http://') || previewUrl.startsWith('https://');
  const isYouTube = isHttpUrl && (previewUrl.includes('youtube.com') || previewUrl.includes('youtu.be'));
  const isTikTok = isHttpUrl && previewUrl.includes('tiktok.com');

  // Lógica para extraer la miniatura inicial de YouTube
  let initialThumbnail = "";
  if (isYouTube) {
    let videoId = "";
    if (previewUrl.includes("youtu.be/")) {
      videoId = previewUrl.split("youtu.be/")[1]?.split("?")[0];
    } else if (previewUrl.includes("watch?v=")) {
      videoId = previewUrl.split("watch?v=")[1]?.split("&")[0];
    } else if (previewUrl.includes("embed/")) {
      videoId = previewUrl.split("embed/")[1]?.split("?")[0];
    }
    if (videoId) {
      initialThumbnail = `https://img.youtube.com/vi/${videoId}/hq720.jpg`;
    }
  }

  const activeThumb = tiktokThumb || initialThumbnail;

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
                {editingVideo
                  ? "Editar Video de la Lista"
                  : "Subir Nuevo Video"}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {editingVideo
                  ? "Modifica los detalles o reemplaza el archivo multimedia."
                  : "Completa los campos para añadir un nuevo video a la vista."}
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

          <form onSubmit={handleSubmitForm} className="space-y-5">
            {/* Vista Previa */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Vista Previa
              </label>
              <div
                onClick={() => previewUrl && !isHttpUrl && setShowLightbox(true)}
                className={`relative aspect-[16/9] w-full bg-slate-900 rounded-2xl border border-dashed border-slate-200 overflow-hidden flex items-center justify-center group ${
                  previewUrl && !isHttpUrl ? "cursor-zoom-in" : ""
                }`}
              >
                {previewUrl ? (
                  activeThumb ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={activeThumb}
                        alt="Miniatura externa"
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-white/10 text-white px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-lg">
                        <Globe className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-[10px] font-bold tracking-wider uppercase">URL</span>
                      </div>
                    </div>
                  ) : isHttpUrl ? (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 flex flex-col items-center justify-center p-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white mb-2 shadow-inner backdrop-blur-xs">
                        {isYouTube ? (
                          <span className="text-red-500 font-bold text-sm">YT</span>
                        ) : isTikTok ? (
                          <Music2 className="w-6 h-6 text-pink-500 animate-pulse" />
                        ) : (
                          <Globe className="w-6 h-6 text-amber-400" />
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-slate-300 line-clamp-1 px-2">
                        {isYouTube ? "Enlace de YouTube" : isTikTok ? "Cargando miniatura de TikTok..." : "Enlace Externo"}
                      </span>
                      <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-white/10 text-white px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-lg">
                        <Globe className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-[10px] font-bold tracking-wider uppercase">URL</span>
                      </div>
                    </div>
                  ) : (
                    // Archivo local de video
                    <>
                      <video
                        src={previewUrl}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        controls
                        muted
                      />
                      <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold pointer-events-none">
                        <Eye className="w-4 h-4" />
                        <span>Ver video completo</span>
                      </div>
                    </>
                  )
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-slate-400">
                    <VideoIcon className="w-8 h-8 stroke-[1.5] text-amber-500/70" />
                    <span className="text-xs font-medium">
                      Sin video seleccionado
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
                placeholder="Ej. Presentación del proyecto AI Mangas"
                required
                className="w-full bg-slate-50 text-slate-800 text-xs px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none transition-all font-medium"
              />
            </div>

            {/* Selector de Pestañas */}
            <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/60">
              <button
                type="button"
                onClick={() => {
                  setInputType("file");
                  setVideoUrl("");
                  setVideoFile(null);
                  setPreviewUrl("");
                  setTiktokThumb("");
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  inputType === "file"
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  {editingVideo ? "Reemplazar Archivo" : "Subir Archivo"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setInputType("url");
                  setVideoFile(null);
                  setPreviewUrl(videoUrl);
                  if (videoUrl.includes("tiktok.com")) {
                    setTiktokThumb(tiktokThumbnailCache[videoUrl] || "");
                  }
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
                    ? "Nuevo archivo de video (Opcional)"
                    : "Seleccionar Archivo (Max 50MB)"}
                </label>
                <input
                  type="file"
                  key={inputType}
                  accept="video/mp4, video/webm, video/ogg, video/quicktime"
                  onChange={handleFileChange}
                  required={!editingVideo && inputType === "file"}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer border border-slate-200 rounded-xl bg-slate-50 p-1 transition-all"
                />
              </div>
            ) : (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  URL del Video Externo
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://www.tiktok.com/... o YouTube"
                  required={inputType === "url"}
                  className="w-full bg-slate-50 text-slate-800 text-xs px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none transition-all font-medium"
                />
              </div>
            )}

            {/* Botones de Acción y Eliminar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
              {editingVideo && onDelete ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer flex items-center gap-1.5 border border-rose-100"
                  title="Eliminar video"
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
                  {editingVideo ? "Guardar Cambios" : "Subir Video"}
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
              ¿Eliminar este video?
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Esta acción es irreversible y se removerá de la lista
              permanentemente.
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

      {/* Sub-Modal: Visor de Video Completa (Lightbox) para locales */}
      {showLightbox && previewUrl && !isHttpUrl && (
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
            <video
              src={previewUrl}
              className="max-h-[85vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
              controls
              autoPlay
            />
          </div>
        </div>
      )}
    </>
  );
}