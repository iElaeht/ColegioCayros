// frontend/app/syspanel/(protected)/eventos/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import EventGrid from "./components/grid/EventGrid";
import EventModal from "./components/modal/EventModal";
import EventHomeConfig from "./components/home-config/EventHomeConfig";
import { SortOption } from "./components/grid/EventFilters";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface EventItem {
  id: number;
  src: string;
  alt: string;
  isActive: boolean;
  isFeatured?: boolean;
  createdAt?: string;
}

export default function AdminEventosPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = useCallback(
    (type: "success" | "error", message: string) => {
      setToast({ type, message });
      setTimeout(() => {
        setToast(null);
      }, 3500);
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
    document.title = "Gestión de Eventos | Colegio Cayros";
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const res = await fetch(`${apiUrl}/api/eventos`);
        if (!res.ok)
          throw new Error("Error al obtener los registros del servidor");

        const data = await res.json();

        if (isMounted && Array.isArray(data)) {
          const cleanedData = data.map((item: EventItem) => ({
            ...item,
            alt: item.alt ? item.alt.trim() : "",
          }));

          setEvents(cleanedData);
        }
      } catch (error) {
        console.error("Error al cargar los eventos:", error);
      }
    };

    loadEvents();

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
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: EventItem) => {
    setEditingEvent(item);
    setIsModalOpen(true);
  };

  const toggleStatus = async (id: number) => {
    const target = events.find((item) => item.id === id);
    if (!target) return;

    try {
      const formData = new FormData();
      formData.append("isActive", String(!target.isActive));

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiUrl}/api/eventos/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("No se pudo actualizar el estado");

      const updated = await res.json();
      setEvents((prev) =>
        prev.map((item) => (item.id === id ? updated : item)),
      );
      showToast("success", "Estado actualizado correctamente.");
    } catch (error) {
      console.error("Error al cambiar el estado del evento:", error);
      showToast("error", "No se pudo cambiar el estado.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiUrl}/api/eventos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("No se pudo eliminar el registro");

      setEvents((prev) => prev.filter((item) => item.id !== id));
      setIsModalOpen(false);
      setEditingEvent(null);
      showToast("success", "Evento eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar el evento:", error);
      showToast("error", "Error al intentar eliminar el registro.");
    }
  };

  const handleFormSubmit = async ({
    alt,
    descripcion,
    imageUrl,
    imageFile,
  }: {
    alt: string;
    descripcion: string;
    imageUrl: string;
    imageFile: File | null;
  }) => {
    try {
      const formData = new FormData();
      if (alt) {
        formData.append("alt", alt);
        formData.append("titulo", alt);
      }

      if (descripcion) {
        formData.append("descripcion", descripcion);
      }

      if (imageFile) {
        formData.append("imageFile", imageFile);
      } else if (imageUrl) {
        formData.append("imageUrl", imageUrl);
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const url = editingEvent
        ? `${apiUrl}/api/eventos/${editingEvent.id}`
        : `${apiUrl}/api/eventos`;

      const method = editingEvent ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        const resultItem = await res.json();
        setEvents((prev) =>
          editingEvent
            ? prev.map((item) =>
                item.id === resultItem.id ? resultItem : item,
              )
            : [resultItem, ...prev],
        );
        setIsModalOpen(false);
        setEditingEvent(null);
        showToast(
          "success",
          editingEvent
            ? "Evento actualizado con éxito."
            : "Evento creado con éxito.",
        );
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(
          "error",
          `Error: ${errData.error || "No se pudo guardar el evento"}`,
        );
      }
    } catch (error) {
      console.error("Error de red al procesar el formulario:", error);
      showToast("error", "Error de red al procesar la solicitud.");
    }
  };

  const filteredAndSortedEvents = events
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

  const totalItems = filteredAndSortedEvents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      updateQueryString({ page: totalPages });
    }
  }, [currentPage, totalPages, updateQueryString]);

  const paginatedEvents = filteredAndSortedEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6 overflow-x-hidden select-none">
      
      {/* Cabecera del Módulo */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#16275d] tracking-tight">
          Gestión de Eventos
        </h1>
        <p className="text-slate-500 text-xs md:text-sm font-medium">
          Administra, edita, activa o deshabilita los eventos institucionales de la I.E.P. Colegio Cayros.
        </p>
      </div>

      <div className="h-[1px] w-full bg-slate-200 my-2" />

      {/* Configuración de Destacados en Inicio */}
      <EventHomeConfig allImages={events} showToast={showToast} />

      {/* Grilla General de Eventos */}
      <EventGrid
        images={paginatedEvents}
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

      {/* Modal de Creación / Edición */}
      <EventModal
        key={editingEvent ? `edit-${editingEvent.id}` : "create-new"}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEvent(null);
        }}
        onSubmit={handleFormSubmit}
        onDelete={
          editingEvent ? () => handleDelete(editingEvent.id) : undefined
        }
        editingImage={editingEvent}
      />

      {/* Sistema de Notificaciones Toast */}
      {toast &&
        typeof window !== "undefined" &&
        createPortal(
          <div className="fixed top-6 right-6 z-[99999] flex items-center gap-3 px-5 py-3.5 bg-[#16275d] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-3 duration-200 border border-[#16275d]/60">
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>,
          document.body,
        )}
    </div>
  );
}