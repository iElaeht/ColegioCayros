// frontend/app/syspanel/(protected)/videos/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import VideoGrid from "./components/grid/VideoGrid";
import VideoModal from "./components/modal/VideoModal";
import VideoHomeConfig from "./components/home-config/VideoHomeConfig";
import ToastAlertVideo from "./components/home-config/ToastAlertVideo";
import { SortOption } from "./components/grid/VideoFilters"; 

interface VideoItem {
  id: number;
  src: string;
  alt: string;
  isActive: boolean;
  isFeatured?: boolean;
  createdAt?: string;
}

export default function AdminVideosPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);

  // Estado del Toast unificado con soporte para success, error y warning
  const [toastState, setToastState] = useState<{
    visible: boolean;
    type: "success" | "error" | "warning";
    message: string;
  }>({
    visible: false,
    type: "success",
    message: "",
  });

  const showToast = useCallback(
    (type: "success" | "error" | "warning", message: string) => {
      setToastState({ visible: true, type, message });
    },
    [],
  );

  const itemsPerPage = 20;

  const currentPage = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";
  const selectedDate = searchParams.get("date") || "";
  const sortOption = (searchParams.get("sort") as SortOption) || "oldest";

  useEffect(() => {
    const hasPage = searchParams.has("page");
    const hasSort = searchParams.has("sort");

    if (!hasPage || !hasSort) {
      const params = new URLSearchParams(searchParams.toString());
      if (!hasPage) params.set("page", "1");
      if (!hasSort) params.set("sort", "oldest");

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  const updateQueryString = useCallback(
    (paramsToUpdate: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(paramsToUpdate).forEach(([key, value]) => {
        const shouldDelete =
          (key === "search" || key === "date") && (!value || value === "");

        if (shouldDelete) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      const query = params.toString();
      const newUrl = query ? `${pathname}?${query}` : pathname;

      router.push(newUrl, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  useEffect(() => {
    document.title = "Gestión de Videos | Colegio Cayros";
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadVideos = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/videos");
        if (!res.ok)
          throw new Error("Error al obtener los registros del servidor");

        const data = await res.json();

        if (isMounted && Array.isArray(data)) {
          const cleanedData = data.map((vid: VideoItem) => ({
            ...vid,
            alt: vid.alt ? vid.alt.trim() : "",
          }));

          setVideos(cleanedData);
        }
      } catch (error) {
        console.error("Error al cargar los videos:", error);
      }
    };

    loadVideos();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearchChange = (query: string) => {
    updateQueryString({ search: query, page: 1 });
  };

  const handleDateChange = (date: string) => {
    updateQueryString({ date: date || null, page: 1 });
  };

  const handleSortChange = (sort: SortOption) => {
    updateQueryString({ sort, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateQueryString({ page });
  };

  const handleOpenCreate = () => {
    setEditingVideo(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: VideoItem) => {
    setEditingVideo(item);
    setIsModalOpen(true);
  };

  const toggleStatus = async (id: number) => {
    const target = videos.find((vid) => vid.id === id);
    if (!target) return;

    try {
      const formData = new FormData();
      formData.append("isActive", String(!target.isActive));

      const res = await fetch(`http://localhost:4000/api/videos/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("No se pudo actualizar el estado");

      const updated = await res.json();
      setVideos((prev) => prev.map((vid) => (vid.id === id ? updated : vid)));
      showToast("success", "Estado actualizado correctamente.");
    } catch (error) {
      console.error("Error al cambiar el estado del video:", error);
      showToast("error", "No se pudo cambiar el estado.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:4000/api/videos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("No se pudo eliminar el registro");

      setVideos((prev) => prev.filter((vid) => vid.id !== id));
      setIsModalOpen(false);
      setEditingVideo(null);
      showToast("success", "Video eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar el video:", error);
      showToast("error", "Error al intentar eliminar el registro.");
    }
  };

  const handleFormSubmit = async ({
    alt,
    videoUrl,
    videoFile,
  }: {
    alt: string;
    videoUrl: string;
    videoFile: File | null;
  }) => {
    try {
      const formData = new FormData();
      if (alt) formData.append("alt", alt);

      if (videoFile) {
        formData.append("videoFile", videoFile);
      } else if (videoUrl) {
        formData.append("videoUrl", videoUrl);
      }

      const url = editingVideo
        ? `http://localhost:4000/api/videos/${editingVideo.id}`
        : "http://localhost:4000/api/videos";

      const method = editingVideo ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        const resultItem = await res.json();
        setVideos((prev) =>
          editingVideo
            ? prev.map((vid) => (vid.id === resultItem.id ? resultItem : vid))
            : [resultItem, ...prev],
        );
        setIsModalOpen(false);
        setEditingVideo(null);
        showToast(
          "success",
          editingVideo
            ? "Video actualizado con éxito."
            : "Video guardado con éxito.",
        );
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(
          "error",
          `Error: ${errData.error || "No se pudo guardar el video"}`,
        );
      }
    } catch (error) {
      console.error("Error de red al procesar el formulario:", error);
      showToast("error", "Error de red al procesar la solicitud.");
    }
  };

  const filteredAndSortedVideos = videos
    .filter((item) => {
      const matchesSearch = item.alt
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      let matchesDate = true;
      if (selectedDate && item.createdAt) {
        const itemDate = item.createdAt.split("T")[0];
        matchesDate = itemDate === selectedDate;
      }

      return matchesSearch && matchesDate;
    })
    .sort((a, b) => {
      const valA = a.createdAt ? new Date(a.createdAt).getTime() : a.id;
      const valB = b.createdAt ? new Date(b.createdAt).getTime() : b.id;

      if (sortOption === "oldest") return valA - valB;
      if (sortOption === "newest") return valB - valA;
      if (sortOption === "az") return a.alt.localeCompare(b.alt);
      return b.alt.localeCompare(a.alt);
    });

  const totalItems = filteredAndSortedVideos.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      updateQueryString({ page: totalPages });
    }
  }, [currentPage, totalPages, updateQueryString]);

  const paginatedVideos = filteredAndSortedVideos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto w-full font-['Poppins',sans-serif] space-y-6 overflow-x-hidden">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Gestión de Videos
        </h1>
        <p className="text-slate-500 text-xs md:text-sm font-medium">
          Sube archivos de video o añade enlaces (YouTube, TikTok) que muestran la página
          pública del Colegio &quot; I.E.P Cayros &quot;
        </p>
      </div>

      <div className="h-[1px] w-full bg-slate-200/90 my-2" />

      <VideoHomeConfig allVideos={videos} showToast={showToast} />

      <VideoGrid
        videos={paginatedVideos}
        onToggleStatus={toggleStatus}
        onOpenEdit={handleOpenEdit}
        onDelete={handleDelete}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        sortOption={sortOption}
        onSortChange={handleSortChange}
        onOpenCreate={handleOpenCreate}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
      />

      <VideoModal
        key={editingVideo ? `edit-${editingVideo.id}` : "create-new"}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingVideo(null);
        }}
        onSubmit={handleFormSubmit}
        onDelete={
          editingVideo ? () => handleDelete(editingVideo.id) : undefined
        }
        editingVideo={editingVideo}
      />

      {/* Componente Toast unificado para Videos */}
      <ToastAlertVideo
        show={toastState.visible}
        type={toastState.type}
        message={toastState.message}
        onClose={() => setToastState((prev) => ({ ...prev, visible: false }))}
      />
    </div>
  );
}