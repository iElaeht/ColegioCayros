"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquare } from "lucide-react";
import ContactFilter from "./components/ContactFilter";
import ContactGrid from "./components/ContactGrid";
import Pagination from "./components/Pagination";
import ToastAlert from "../components/ToastAlert";

export interface Mensaje {
  id: string;
  dni: string;
  nombre: string;
  telefono: string;
  asunto: string;
  fecha?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const ITEMS_PER_PAGE = 15;

export default function MensajesPage() {
  useEffect(() => {
    document.title = "Bandeja de Mensajes | Colegio Cayros";
  }, []);

  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [sortOrder, setSortOrder] = useState("recientes");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchMensajes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/mensajes`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Error al obtener mensajes");

      const data = await response.json();
      const listaMensajes = Array.isArray(data) ? data : data.mensajes ?? [];
      setMensajes(listaMensajes);
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const loadInitialMensajes = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/mensajes`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Error al obtener mensajes");

        const data = await response.json();
        if (active) {
          const listaMensajes = Array.isArray(data) ? data : data.mensajes ?? [];
          setMensajes(listaMensajes);
          setError(false);
        }
      } catch (err) {
        if (active) {
          console.error(err);
          setError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadInitialMensajes();

    return () => {
      active = false;
    };
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/mensajes/${id}`, {
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

  const mensajesFiltrados = mensajes.filter((msg) => {
    const matchesSearch =
      msg.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.dni.includes(searchTerm) ||
      msg.telefono.includes(searchTerm);

    const matchesDate = selectedDate ? Boolean(msg.fecha?.startsWith(selectedDate)) : true;
    return matchesSearch && matchesDate;
  });

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

  const totalPages = Math.ceil(mensajesOrdenados.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const mensajesPaginados = mensajesOrdenados.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="w-full space-y-6 select-none max-w-7xl mx-auto p-4 sm:p-8 lg:p-10">
      {toast && (
        <ToastAlert
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

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

      <ContactFilter
        searchTerm={searchTerm}
        setSearchTerm={handleSearchChange}
        selectedDate={selectedDate}
        setSelectedDate={handleDateChange}
        sortOrder={sortOrder}
        setSortOrder={handleSortChange}
        exportData={mensajesOrdenados}
        onImportData={async (nuevosDatos) => {
          try {
            const res = await fetch(`${API_URL}/api/mensajes/importar`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ mensajes: nuevosDatos }),
            });

            if (res.ok) {
              await fetchMensajes();
              setToast({
                message: "¡Registros importados y guardados con éxito!",
                type: "success",
              });
            } else {
              setToast({
                message: "Error al guardar los registros importados.",
                type: "error",
              });
            }
          } catch (err) {
            console.error("Error de red al importar:", err);
            setToast({ message: "Error de red al intentar importar.", type: "error" });
          }
        }}
      />

      <ContactGrid
        mensajes={mensajesPaginados}
        loading={loading}
        error={error}
        currentPage={currentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        onDelete={handleDelete}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={mensajesOrdenados.length}
        onPageChange={setCurrentPage}
        itemName="Mensajes"
      />
    </div>
  );
}