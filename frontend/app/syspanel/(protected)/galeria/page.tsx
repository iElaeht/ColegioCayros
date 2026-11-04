// frontend/app/syspanel/(protected)/galeria/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import GalleryGrid from "./components/grid/GalleryGrid";
import GalleryModal from "./components/modal/GalleryModal";
import GalleryHomeConfig from "./components/home-config/GalleryHomeConfig";
import ToastAlertGallery from "./components/home-config/ToastAlertGallery"; // <-- Importamos el componente correcto
import { SortOption } from "./components/grid/GalleryFilters"; 

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  isActive: boolean;
  isFeatured?: boolean;
  createdAt?: string;
}

export default function AdminGaleriaPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [images, setImages] = useState<GalleryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryItem | null>(null);

  // Estado del Toast unificado con soporte para success, error y warning (igual que Hero)
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
    document.title = "Gestión de Galería | Colegio Cayros";
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadImages = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/galeria");
        if (!res.ok)
          throw new Error("Error al obtener los registros del servidor");

        const data = await res.json();

        if (isMounted && Array.isArray(data)) {
          const cleanedData = data.map((img: GalleryItem) => ({
            ...img,
            alt: img.alt ? img.alt.trim() : "",
          }));

          setImages(cleanedData);
        }
      } catch (error) {
        console.error("Error al cargar la galería:", error);
      }
    };

    loadImages();

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
    setEditingImage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingImage(item);
    setIsModalOpen(true);
  };

  const toggleStatus = async (id: number) => {
    const target = images.find((img) => img.id === id);
    if (!target) return;

    try {
      const formData = new FormData();
      formData.append("isActive", String(!target.isActive));

      const res = await fetch(`http://localhost:4000/api/galeria/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("No se pudo actualizar el estado");

      const updated = await res.json();
      setImages((prev) => prev.map((img) => (img.id === id ? updated : img)));
      showToast("success", "Estado actualizado correctamente.");
    } catch (error) {
      console.error("Error al cambiar el estado de la imagen:", error);
      showToast("error", "No se pudo cambiar el estado.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:4000/api/galeria/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("No se pudo eliminar el registro");

      setImages((prev) => prev.filter((img) => img.id !== id));
      setIsModalOpen(false);
      setEditingImage(null);
      showToast("success", "Imagen eliminada correctamente.");
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
      showToast("error", "Error al intentar eliminar el registro.");
    }
  };

  const handleFormSubmit = async ({
    alt,
    imageUrl,
    imageFile,
  }: {
    alt: string;
    imageUrl: string;
    imageFile: File | null;
  }) => {
    try {
      const formData = new FormData();
      if (alt) formData.append("alt", alt);

      if (imageFile) {
        formData.append("imageFile", imageFile);
      } else if (imageUrl) {
        formData.append("imageUrl", imageUrl);
      }

      const url = editingImage
        ? `http://localhost:4000/api/galeria/${editingImage.id}`
        : "http://localhost:4000/api/galeria";

      const method = editingImage ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        const resultItem = await res.json();
        setImages((prev) =>
          editingImage
            ? prev.map((img) => (img.id === resultItem.id ? resultItem : img))
            : [resultItem, ...prev],
        );
        setIsModalOpen(false);
        setEditingImage(null);
        showToast(
          "success",
          editingImage
            ? "Imagen actualizada con éxito."
            : "Imagen subida con éxito.",
        );
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(
          "error",
          `Error: ${errData.error || "No se pudo guardar la imagen"}`,
        );
      }
    } catch (error) {
      console.error("Error de red al procesar el formulario:", error);
      showToast("error", "Error de red al procesar la solicitud.");
    }
  };

  const filteredAndSortedImages = images
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

  const totalItems = filteredAndSortedImages.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      updateQueryString({ page: totalPages });
    }
  }, [currentPage, totalPages, updateQueryString]);

  const paginatedImages = filteredAndSortedImages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto w-full font-['Poppins',sans-serif] space-y-6 overflow-x-hidden">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Gestión de Galería
        </h1>
        <p className="text-slate-500 text-xs md:text-sm font-medium">
          Sube, edita, activa o deshabilita las imágenes que muestran la página
          pública del Colegio &quot; I.E.P Cayros &quot;
        </p>
      </div>

      <div className="h-[1px] w-full bg-slate-200/90 my-2" />

      {/* Configuración de Galería con soporte de notificaciones extendido */}
      <GalleryHomeConfig allImages={images} showToast={showToast} />

      <GalleryGrid
        images={paginatedImages}
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

      <GalleryModal
        key={editingImage ? `edit-${editingImage.id}` : "create-new"}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingImage(null);
        }}
        onSubmit={handleFormSubmit}
        onDelete={
          editingImage ? () => handleDelete(editingImage.id) : undefined
        }
        editingImage={editingImage}
      />

      {/* Renderizamos el ToastAlertGallery unificado mediante Portal */}
      {toastState.visible &&
        typeof window !== "undefined" &&
        createPortal(
          <ToastAlertGallery
            show={toastState.visible}
            message={toastState.message}
            type={toastState.type}
            onClose={() =>
              setToastState((prev) => ({ ...prev, visible: false }))
            }
          />,
          document.body,
        )}
    </div>
  );
}