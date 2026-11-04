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
  AlertTriangle,
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
const youtubeThumbnailCache: Record<string, string> = {};

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

  const [initialAlt, setInitialAlt] = useState("");
  const [initialVideoUrl, setInitialVideoUrl] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [tiktokThumb, setTiktokThumb] = useState("");
  const [youtubeThumb, setYoutubeThumb] = useState("");

  // Manejo de la tecla ESC y bloqueo de scroll idéntico al HeroModal
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

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
    };
  }, [isOpen, showLightbox, showDeleteConfirm, onClose]);

  useEffect(() => {
    if (isOpen) {
      if (editingVideo) {
        const currentAlt = editingVideo.alt || "";
        const isHttpSource = editingVideo.src?.startsWith("http") || false;
        const currentUrl = isHttpSource ? editingVideo.src : "";

        setAlt(currentAlt);
        setInitialAlt(currentAlt);

        setInputType(isHttpSource ? "url" : "file");
        setVideoUrl(currentUrl);
        setInitialVideoUrl(currentUrl);
        setVideoFile(null);

        if (!editingVideo.src) {
          setPreviewUrl("");
        } else {
          const resolvedUrl = isHttpSource
            ? editingVideo.src
            : `http://localhost:4000${editingVideo.src}`;
          setPreviewUrl(resolvedUrl);

          if (isHttpSource) {
            if (editingVideo.src.includes("tiktok.com")) {
              setTiktokThumb(tiktokThumbnailCache[editingVideo.src] || "");
              setYoutubeThumb("");
            } else if (editingVideo.src.includes("youtube.com") || editingVideo.src.includes("youtu.be")) {
              setYoutubeThumb(youtubeThumbnailCache[editingVideo.src] || extractYoutubeThumb(editingVideo.src));
              setTiktokThumb("");
            } else {
              setTiktokThumb("");
              setYoutubeThumb("");
            }
          }
        }
      } else {
        setAlt("");
        setInitialAlt("");
        setVideoUrl("");
        setInitialVideoUrl("");
        setVideoFile(null);
        setInputType("file");
        setPreviewUrl("");
        setTiktokThumb("");
        setYoutubeThumb("");
      }
    } else {
      setShowLightbox(false);
      setShowDeleteConfirm(false);
    }
  }, [isOpen, editingVideo]);

  // Función robusta para extraer miniatura de YouTube soportando Shorts, youtu.be, watch, embed, etc.
  const extractYoutubeThumb = (url: string) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0]?.split("/")[0];
    } else if (url.includes("watch?v=")) {
      videoId = url.split("watch?v=")[1]?.split("&")[0];
    } else if (url.includes("embed/")) {
      videoId = url.split("embed/")[1]?.split("?")[0]?.split("/")[0];
    } else if (url.includes("shorts/")) {
      videoId = url.split("shorts/")[1]?.split("?")[0]?.split("/")[0];
    }
    return videoId ? `https://img.youtube.com/vi/${videoId}/hq720.jpg` : "";
  };

  // Petición oEmbed para TikTok y procesamiento dinámico para YouTube
  useEffect(() => {
    const isHttpUrl = previewUrl.startsWith('http://') || previewUrl.startsWith('https://');
    const isTikTok = isHttpUrl && previewUrl.includes('tiktok.com');
    const isYouTube = isHttpUrl && (previewUrl.includes('youtube.com') || previewUrl.includes('youtu.be'));

    if (isTikTok) {
      if (!tiktokThumb && !tiktokThumbnailCache[previewUrl]) {
        fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(previewUrl)}`)
          .then((res) => res.json())
          .then((data) => {
            if (data && data.thumbnail_url) {
              tiktokThumbnailCache[previewUrl] = data.thumbnail_url;
              setTiktokThumb(data.thumbnail_url);
            }
          })
          .catch(() => {});
      } else if (tiktokThumbnailCache[previewUrl]) {
        setTiktokThumb(tiktokThumbnailCache[previewUrl]);
      }
    } else {
      setTiktokThumb("");
    }

    if (isYouTube) {
      const generatedThumb = extractYoutubeThumb(previewUrl);
      if (generatedThumb) {
        youtubeThumbnailCache[previewUrl] = generatedThumb;
        setYoutubeThumb(generatedThumb);
      }
    } else {
      setYoutubeThumb("");
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
      setYoutubeThumb("");
    }
  };

  const handleUrlChange = (val: string) => {
    setVideoUrl(val);
    setPreviewUrl(val);
    if (val.includes("tiktok.com")) {
      setTiktokThumb(tiktokThumbnailCache[val] || "");
      setYoutubeThumb("");
    } else if (val.includes("youtube.com") || val.includes("youtu.be")) {
      setYoutubeThumb(youtubeThumbnailCache[val] || extractYoutubeThumb(val));
      setTiktokThumb("");
    } else {
      setTiktokThumb("");
      setYoutubeThumb("");
    }
  };

  // Detección exacta de cambios inteligente igual al HeroModal
  const hasChanges = (() => {
    if (!editingVideo) {
      return alt.trim() !== "" && (videoFile !== null || videoUrl.trim() !== "");
    } else {
      const titleChanged = alt.trim() !== initialAlt.trim();
      const fileAdded = videoFile !== null;
      const urlChanged = inputType === "url" && videoUrl.trim() !== initialVideoUrl;
      return titleChanged || fileAdded || urlChanged;
    }
  })();

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges) return;
    onSubmit({ alt: alt.trim(), videoUrl: videoUrl.trim(), videoFile });
  };

  const isLocalFileEditing =
    editingVideo && !editingVideo.src.startsWith("http");

  const isHttpUrl = previewUrl.startsWith('http://') || previewUrl.startsWith('https://');
  const isYouTube = isHttpUrl && (previewUrl.includes('youtube.com') || previewUrl.includes('youtu.be'));
  const isTikTok = isHttpUrl && previewUrl.includes('tiktok.com');

  const activeThumb = tiktokThumb || youtubeThumb;

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
            className="absolute top-3.5 right-3.5 text-blue-600 hover:text-blue-800 bg-transparent p-1.5 rounded-xl transition-colors duration-200 cursor-pointer z-10 select-none outline-none"
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
                  {editingVideo ? "Editar Video" : "Subir Nuevo Video"}
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {editingVideo
                    ? "Modifica los detalles del video seleccionado."
                    : "Completa los campos para añadir un nuevo video a la vista."}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Vista Previa con transición suave (fade-in) para evitar saltos */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Vista Previa
                </label>
                <div
                  onClick={() => previewUrl && !isHttpUrl && setShowLightbox(true)}
                  className={`relative aspect-[16/9] w-full bg-indigo-50/20 rounded-xl border-2 border-dashed border-indigo-300/70 overflow-hidden flex items-center justify-center group transform-gpu transition-all select-none ${
                    previewUrl && !isHttpUrl ? "cursor-zoom-in border-solid border-slate-200 bg-slate-50" : ""
                  }`}
                >
                  {previewUrl ? (
                    activeThumb ? (
                      <div className="relative w-full h-full animate-in fade-in duration-300">
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
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 flex flex-col items-center justify-center p-4 text-center animate-in fade-in duration-300">
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
                          {isYouTube ? "Cargando miniatura de YouTube..." : isTikTok ? "Cargando miniatura de TikTok..." : "Enlace Externo"}
                        </span>
                        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-white/10 text-white px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-lg">
                          <Globe className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-[10px] font-bold tracking-wider uppercase">URL</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <video
                          src={previewUrl}
                          className="w-full h-full object-cover transition-transform duration-300 transform-gpu group-hover:scale-105"
                          controls
                          muted
                        />
                        <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1.5 text-white text-xs font-semibold transform-gpu">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver video completo</span>
                        </div>
                      </>
                    )
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-indigo-400">
                      <VideoIcon className="w-6 h-6 stroke-[1.5] text-indigo-400" />
                      <span className="text-[11px] font-medium text-indigo-500">
                        Sin video seleccionado
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
                  placeholder="Ej. Presentación del proyecto AI Mangas"
                  required
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none transition-all font-medium"
                />
              </div>

              {/* Selector de Pestañas */}
              <div className="flex gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/60 transform-gpu">
                <button
                  type="button"
                  onClick={() => {
                    setInputType("file");
                    setVideoUrl("");
                    setVideoFile(null);
                    if (!editingVideo) {
                      setPreviewUrl("");
                    } else {
                      const isHttp = editingVideo.src?.startsWith("http");
                      setPreviewUrl(isHttp ? "" : `http://localhost:4000${editingVideo.src}`);
                    }
                    setTiktokThumb("");
                    setYoutubeThumb("");
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-colors duration-200 cursor-pointer flex items-center justify-center gap-1.5 transform-gpu select-none outline-none ${
                    inputType === "file"
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Upload className="w-3.5 h-3.5 text-amber-600" />
                  <span>
                    {editingVideo ? "Reemplazar" : "Subir Archivo"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputType("url");
                    setVideoFile(null);
                    const targetUrl = editingVideo && editingVideo.src?.startsWith("http") ? editingVideo.src : "";
                    setVideoUrl(targetUrl);
                    setPreviewUrl(targetUrl);
                    if (targetUrl.includes("tiktok.com")) {
                      setTiktokThumb(tiktokThumbnailCache[targetUrl] || "");
                    } else if (targetUrl.includes("youtube.com") || targetUrl.includes("youtu.be")) {
                      setYoutubeThumb(youtubeThumbnailCache[targetUrl] || extractYoutubeThumb(targetUrl));
                    }
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-colors duration-200 cursor-pointer flex items-center justify-center gap-1.5 transform-gpu select-none outline-none ${
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
                      : "Seleccionar Archivo (Max 50MB)"}
                  </label>
                  <input
                    type="file"
                    key={inputType}
                    accept="video/mp4, video/webm, video/ogg, video/quicktime"
                    onChange={handleFileChange}
                    required={!editingVideo && inputType === "file"}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer border border-slate-200 rounded-xl bg-slate-50 p-1 transition-all"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    URL del Video Externo
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://... pega aquí el enlace"
                    required={inputType === "url"}
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none transition-all font-medium"
                  />
                </div>
              )}

              {/* Botones de Acción y Eliminar */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-1">
                {editingVideo && onDelete ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors duration-200 cursor-pointer flex items-center gap-1 border border-rose-100 select-none outline-none"
                    title="Eliminar video"
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
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors duration-200 cursor-pointer select-none outline-none"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!hasChanges}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 select-none outline-none ${
                      hasChanges
                        ? "bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 cursor-pointer"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    }`}
                  >
                    {editingVideo ? "Guardar Cambios" : "Subir Video"}
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
                ¿Eliminar este video?
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mb-5">
                Esta acción es irreversible y se removerá del sistema permanentemente.
              </p>
              <div className="flex gap-2 w-full max-w-xs">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors duration-200 cursor-pointer select-none outline-none"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    onDelete?.();
                  }}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20 transition-colors duration-200 cursor-pointer select-none outline-none"
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sub-Modal: Visor de Video Completa (Lightbox) */}
      {showLightbox && previewUrl && !isHttpUrl && (
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
              className="absolute -top-12 right-0 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors duration-200 cursor-pointer select-none outline-none"
            >
              <X className="w-5 h-5" />
            </button>
            <video
              src={previewUrl}
              className="max-h-[85vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10 transform-gpu"
              controls
              autoPlay
            />
          </div>
        </div>
      )}
    </>
  );
}