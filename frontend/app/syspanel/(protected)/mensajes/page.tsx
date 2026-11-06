// frontend/app/syspanel/mensajes/page.tsx
"use client";

import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import ContactFilter from "./components/ContactFilter";
import ContactGrid from "./components/ContactGrid";
import Pagination from "./components/Pagination";
import ToastAlertMatricula from "../matriculas/components/ToastAlertMatricula";

export interface Mensaje {
  id: string; // Sincronizado con UUID string de Prisma
  dni: string;
  nombre: string;
  telefono: string;
  asunto: string;
  fecha?: string;
}

export default function MensajesPage() {
  // Título de la pestaña
  useEffect(() => {
    document.title = "Bandeja de Mensajes | Colegio Cayros";
  }, []);

  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Estados para filtros, búsqueda y ordenamiento
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("recientes");

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 15;

  const fetchMensajes = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const response = await fetch(`${apiUrl}/api/mensajes`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Error al obtener mensajes");

      const data = await response.json();
      const listaMensajes = Array.isArray(data) ? data : (data.mensajes ?? []);
      setMensajes(listaMensajes);
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMensajes();
  }, []);

  // Función para eliminar el mensaje comunicándose con el backend
  const handleDelete = async (id: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiUrl}/api/mensajes/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMensajes((prev) => prev.filter((msg) => msg.id !== id));
        setToast({ message: "Mensaje eliminado con éxito.", type: "success" });
      } else {
        setToast({ message: "No se pudo eliminar el mensaje.", type: "error" });
      }
    } catch (err) {
      console.error("Error al eliminar mensaje:", err);
      setToast({ message: "Error de red al intentar eliminar.", type: "error" });
    }
  };

  // Lógica de filtrado en tiempo real
  const mensajesFiltrados = mensajes.filter((msg) => {
    const matchesSearch =
      msg.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.dni.includes(searchTerm) ||
      msg.telefono.includes(searchTerm);

    const matchesDate = selectedDate
      ? msg.fecha?.startsWith(selectedDate)
      : true;

    return matchesSearch && matchesDate;
  });

  // Lógica de Ordenamiento
  const mensajesOrdenados = [...mensajesFiltrados].sort((a, b) => {
    if (sortOrder === "recientes") {
      return new Date(b.fecha || 0).getTime() - new Date(a.fecha || 0).getTime();
    }
    if (sortOrder === "antiguos") {
      return new Date(a.fecha || 0).getTime() - new Date(b.fecha || 0).getTime();
    }
    if (sortOrder === "az") {
      return a.nombre.localeCompare(b.nombre);
    }
    if (sortOrder === "za") {
      return b.nombre.localeCompare(a.nombre);
    }
    return 0;
  });

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setCurrentPage(1);
  };

  const handleSortChange = (order: string) => {
    setSortOrder(order);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(mensajesOrdenados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const mensajesPaginados = mensajesOrdenados.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full space-y-6 select-none max-w-7xl mx-auto p-4 sm:p-8 lg:p-10">
      {/* Toast de alerta flotante */}
      {toast && (
        <ToastAlertMatricula
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Cabecera de la sección */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 bg-[#16275d]/10 text-[#16275d] rounded-2xl border border-[#16275d]/20">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#16275d]">
              Bandeja de Mensajes
            </h2>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">
            Gestiona y revisa las consultas enviadas desde el formulario de contacto.
          </p>
        </div>
      </header>

      {/* Componente de Filtros, Búsqueda y Ordenamiento */}
      <ContactFilter 
        searchTerm={searchTerm}
        setSearchTerm={handleSearchChange}
        selectedDate={selectedDate}
        setSelectedDate={handleDateChange}
        sortOrder={sortOrder}
        setSortOrder={handleSortChange}
      />

      {/* Componente Grid / Tabla de Mensajes */}
      <ContactGrid 
        mensajes={mensajesPaginados}
        loading={loading}
        error={error}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onDelete={handleDelete}
      />

      {/* Componente de Paginación */}
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={mensajesOrdenados.length}
        onPageChange={(page) => setCurrentPage(page)}
        itemName="Mensajes"
      />
    </div>
  );
}