"use client";

import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import ContactFilter from "./ContactFilter";
import ContactGrid from "./ContactGrid";
import Pagination from "./Pagination";

export interface Mensaje {
  id: number | string;
  dni: string;
  nombre: string;
  telefono: string;
  asunto: string;
  fecha?: string;
}

export default function MensajesPage() {
  // Título de la pestaña
  useEffect(() => {
    document.title = "Mensajes | Colegio Cayros";
  }, []);

  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // Estados para filtros, búsqueda y ordenamiento
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("recientes");

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 30;

  useEffect(() => {
    let isMounted = true;

    const fetchMensajes = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const response = await fetch(`${apiUrl}/api/mensajes`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Error al obtener mensajes");

        const data = await response.json();
        const listaMensajes = Array.isArray(data) ? data : (data.mensajes ?? []);

        if (isMounted) {
          setMensajes(listaMensajes);
        }
      } catch (err) {
        if (isMounted) {
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMensajes();

    return () => {
      isMounted = false;
    };
  }, []);

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

  // Lógica de Ordenamiento (Recientes, Antiguos, A-Z, Z-A)
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

  // Handlers para reiniciar la paginación al filtrar u ordenar
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

  // Lógica de Paginación usando los mensajes ya ordenados
  const totalPages = Math.ceil(mensajesOrdenados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const mensajesPaginados = mensajesOrdenados.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full space-y-6">
      {/* Cabecera de la sección */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 bg-[#6eb5ec]/10 text-[#6eb5ec] rounded-xl border border-[#6eb5ec]/20">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Bandeja de Mensajes
            </h2>
          </div>
          <p className="text-slate-500 text-sm">
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
      />

      {/* Componente de Paginación */}
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={mensajesOrdenados.length}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}