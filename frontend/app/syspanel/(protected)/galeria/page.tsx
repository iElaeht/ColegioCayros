// frontend/app/syspanel/galeria/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import GalleryGrid from "./components/GalleryGrid";
import GalleryModal from "./components/GalleryModal";
import { SortOption } from "./components/GalleryFilters";

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  isActive: boolean;
  createdAt?: string;
}

export default function AdminGaleriaPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Estados principales de la aplicación para control de datos y modales
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryItem | null>(null);

  const itemsPerPage = 20; // Configuración de elementos por página (4 columnas x 5 filas)

  // ---------------------------------------------------------------------------
  // FUENTE ÚNICA DE VERDAD: Lectura directa de los parámetros de la URL
  // ---------------------------------------------------------------------------
  const currentPage = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";
  const selectedDate = searchParams.get("date") || "";
  const sortOption = (searchParams.get("sort") as SortOption) || "oldest";

  // Efecto para inicializar parámetros por defecto en la URL si el usuario entra con una ruta limpia
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

  // Sincronizador centralizado para actualizar la URL sin perder el historial de navegación
  const updateQueryString = useCallback(
    (paramsToUpdate: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(paramsToUpdate).forEach(([key, value]) => {
        const shouldDelete = (key === "search" || key === "date") && (!value || value === "");

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
    [searchParams, pathname, router]
  );

  // Configuración del título de la pestaña del navegador
  useEffect(() => {
    document.title = "Galeria Photos | Colegio Cayros";
  }, []);

  // Carga inicial de los elementos de la galería desde el servidor backend
  useEffect(() => {
    let isMounted = true;

    const loadImages = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/galeria");
        const data = await res.json();
        
        if (isMounted) {
          // CORRECCIÓN: Limpiamos los espacios en blanco de los registros antiguos 
          // que ya estaban sucios en la base de datos antes de aplicar el parche.
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

  // Handlers para interactuar con los filtros y la paginación actualizando la URL
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

  // Handlers para la apertura y gestión del modal de creación/edición
  const handleOpenCreate = () => {
    setEditingImage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingImage(item);
    setIsModalOpen(true);
  };

  // Acción para alternar el estado (activo/inactivo) de una imagen en el backend
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

      if (res.ok) {
        const updated = await res.json();
        setImages(images.map((img) => (img.id === id ? updated : img)));
      }
    } catch (error) {
      console.error("Error al cambiar el estado de la imagen:", error);
    }
  };

  // Acción para eliminar un registro de la galería en el backend
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:4000/api/galeria/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setImages(images.filter((img) => img.id !== id));
        setIsModalOpen(false);
        setEditingImage(null);
      }
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
    }
  };

  // Envío del formulario para crear una nueva imagen o actualizar una existente
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
        if (editingImage) {
          setImages(images.map((img) => (img.id === resultItem.id ? resultItem : img)));
        } else {
          setImages([resultItem, ...images]);
        }
        setIsModalOpen(false);
      } else {
        const errData = await res.json();
        console.error("Error del servidor al guardar:", errData.error);
        alert(`Error: ${errData.error || "No se pudo guardar la imagen"}`);
      }
    } catch (error) {
      console.error("Error de red al procesar el formulario:", error);
    }
  };

  // ---------------------------------------------------------------------------
  // LÓGICA DE PROCESAMIENTO: Filtrado por texto/fecha y ordenamiento dinámico
  // ---------------------------------------------------------------------------
  const filteredAndSortedImages = images
    .filter((item) => {
      const matchesSearch = item.alt.toLowerCase().includes(searchQuery.toLowerCase());

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

  // Métricas para el cálculo de la paginación y control de límites
  const totalItems = filteredAndSortedImages.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  // Validación de seguridad: redirige a la última página válida si el índice actual excede el total
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      updateQueryString({ page: totalPages });
    }
  }, [currentPage, totalPages, updateQueryString]);

  // Selección de los elementos correspondientes a la página visualizada actualmente
  const paginatedImages = filteredAndSortedImages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full font-['Poppins',sans-serif] space-y-6">
      
      {/* Encabezado descriptivo de la sección administrativa */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Gestión de Galería
        </h1>
        <p className="text-slate-500 text-xs md:text-sm font-medium">
          Sube, edita, activa o deshabilita las imágenes que muestran la página pública del Colegio &quot; I.E.P Cayros &quot;
        </p>
      </div>

      {/* Divisor visual estructural */}
      <div className="h-[1px] w-full bg-slate-200/90 my-2" />

      {/* Componente contenedor de la grilla, herramientas de búsqueda, filtros y paginación */}
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

      {/* Modal interactivo para operaciones de alta y modificación de registros */}
      <GalleryModal
        key={editingImage ? `edit-${editingImage.id}` : "create-new"}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingImage(null);
        }}
        onSubmit={handleFormSubmit}
        onDelete={editingImage ? () => handleDelete(editingImage.id) : undefined}
        editingImage={editingImage}
      />
    </div>
  );
}