// frontend/app/syspanel/(protected)/hero/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import HeroGrid from "./components/grid/HeroGrid";
import HeroModal from "./components/modal/HeroModal";
import HeroHomeConfig from "./components/home-config/HeroHomeConfig";
import ToastAlertHero from "./components/home-config/ToastAlertHero";
import { SortOption } from "./components/grid/HeroFilters";

interface HeroSlideItem {
  id: number;
  title?: string | null;
  imageUrl: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt?: string;
}

export default function AdminHeroPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [items, setItems] = useState<HeroSlideItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HeroSlideItem | null>(null);

  // Estado del Toast con soporte para success, error y warning
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
    document.title = "Gestión de Hero | Colegio Cayros";
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadItems = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/hero");
        if (!res.ok)
          throw new Error("Error al obtener los registros del servidor");

        const data = await res.json();

        if (isMounted && Array.isArray(data)) {
          const cleanedData = data.map((item: HeroSlideItem) => ({
            ...item,
            title: item.title ? item.title.trim() : "",
          }));

          setItems(cleanedData);
        }
      } catch (error) {
        console.error("Error al cargar los banners del hero:", error);
      }
    };

    loadItems();

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
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: HeroSlideItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const toggleStatus = async (id: number) => {
    const target = items.find((item) => item.id === id);
    if (!target) return;

    try {
      const formData = new FormData();
      formData.append("isActive", String(!target.isActive));

      const res = await fetch(`http://localhost:4000/api/hero/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("No se pudo actualizar el estado");

      const updated = await res.json();
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
      showToast("success", "Estado actualizado correctamente.");
    } catch (error) {
      console.error("Error al cambiar el estado del banner:", error);
      showToast("error", "No se pudo cambiar el estado.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:4000/api/hero/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("No se pudo eliminar el registro");

      setItems((prev) => prev.filter((item) => item.id !== id));
      setIsModalOpen(false);
      setEditingItem(null);
      showToast("success", "Banner eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar el banner:", error);
      showToast("error", "Error al intentar eliminar el registro.");
    }
  };

  const handleFormSubmit = async ({
    title,
    imageUrl,
    imageFile,
  }: {
    title: string;
    imageUrl: string;
    imageFile: File | null;
  }) => {
    try {
      const formData = new FormData();
      if (title) formData.append("title", title);

      if (imageFile) {
        formData.append("imageFile", imageFile);
      } else if (imageUrl) {
        formData.append("imageUrl", imageUrl);
      }

      const url = editingItem
        ? `http://localhost:4000/api/hero/${editingItem.id}`
        : "http://localhost:4000/api/hero";

      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        const resultItem = await res.json();
        setItems((prev) =>
          editingItem
            ? prev.map((item) => (item.id === resultItem.id ? resultItem : item))
            : [resultItem, ...prev],
        );
        setIsModalOpen(false);
        setEditingItem(null);
        showToast(
          "success",
          editingItem
            ? "Banner actualizado con éxito."
            : "Banner subido con éxito.",
        );
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(
          "error",
          `Error: ${errData.error || "No se pudo guardar el banner"}`,
        );
      }
    } catch (error) {
      console.error("Error de red al procesar el formulario:", error);
      showToast("error", "Error de red al procesar la solicitud.");
    }
  };

  const filteredAndSortedItems = items
    .filter((item) => {
      const itemTitle = item.title || "";
      const matchesSearch = itemTitle
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
      if (sortOption === "az") return (a.title || "").localeCompare(b.title || "");
      return (b.title || "").localeCompare(a.title || "");
    });

  const totalItems = filteredAndSortedItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      updateQueryString({ page: totalPages });
    }
  }, [currentPage, totalPages, updateQueryString]);

  const paginatedItems = filteredAndSortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto w-full font-['Poppins',sans-serif] space-y-6 overflow-x-hidden">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Gestión de Hero
        </h1>
        <p className="text-slate-500 text-xs md:text-sm font-medium">
          Sube, edita, activa o deshabilita los banners principales que se muestran en el Hero de la página pública del Colegio &quot; I.E.P Cayros &quot;
        </p>
      </div>

      <div className="h-px w-full bg-slate-200/90 my-2" />

      {/* Aquí volvemos a pasar showToast={showToast} */}
      <HeroHomeConfig allImages={items} showToast={showToast} />

      <HeroGrid
        images={paginatedItems}
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

      <HeroModal
        key={editingItem ? `edit-${editingItem.id}` : "create-new"}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleFormSubmit}
        onDelete={
          editingItem ? () => handleDelete(editingItem.id) : undefined
        }
        editingItem={editingItem}
      />

      {/* Componente Toast unificado */}
      <ToastAlertHero
        show={toastState.visible}
        type={toastState.type}
        message={toastState.message}
        onClose={() => setToastState((prev) => ({ ...prev, visible: false }))}
      />
    </div>
  );
}