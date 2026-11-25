"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Suspense } from "react";
import MatriculaSolicitudesTable, {
  SolicitudMatricula,
} from "./components/MatriculaSolicitudesTable";
import ToastAlert from "../components/ToastAlert";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function MatriculasPage() {
  const [solicitudes, setSolicitudes] = useState<SolicitudMatricula[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    document.title = "Gestión de Matrículas | Colegio Cayros";
  }, []);

  const fetchSolicitudes = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await fetch(`${API_URL}/api/matricula-inscripcion?t=${Date.now()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Error al obtener solicitudes");

      const data = await res.json();
      if (Array.isArray(data)) {
        setSolicitudes(data);
      }
    } catch (err) {
      console.error("Error al cargar solicitudes:", err);
      setToast({ message: "Error al conectar con el servidor.", type: "error" });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const loadInitialSolicitudes = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/matricula-inscripcion?t=${Date.now()}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Error al obtener solicitudes");

        const data = await res.json();
        if (active && Array.isArray(data)) {
          setSolicitudes(data);
        }
      } catch (err) {
        if (active) {
          console.error("Error al cargar solicitudes:", err);
          setToast({ message: "Error al conectar con el servidor.", type: "error" });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadInitialSolicitudes();

    return () => {
      active = false;
    };
  }, []);

  const handleDeleteOne = useCallback(async (id: number): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/api/matricula-inscripcion/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSolicitudes((prev) => prev.filter((item) => item.id !== id));
        setToast({ message: "Solicitud eliminada con éxito.", type: "success" });
        return true;
      }

      setToast({ message: "No se pudo eliminar la solicitud.", type: "error" });
      return false;
    } catch (err) {
      console.error("Error al eliminar la solicitud:", err);
      setToast({ message: "Error de red al intentar eliminar.", type: "error" });
      return false;
    }
  }, []);

  const handleDeleteSelected = useCallback(async (ids: number[]) => {
    if (!ids.length) return;

    try {
      const res = await fetch(`${API_URL}/api/matricula-inscripcion/eliminar-masivo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

      if (res.ok) {
        setSolicitudes((prev) => prev.filter((item) => !ids.includes(item.id)));
        setToast({
          message: `${ids.length} ${
            ids.length === 1 ? "solicitud eliminada" : "solicitudes eliminadas"
          } con éxito.`,
          type: "success",
        });
      } else {
        setToast({
          message: "No se pudieron eliminar las solicitudes seleccionadas.",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Error al eliminar seleccionados:", err);
      setToast({ message: "Error de red al eliminar seleccionados.", type: "error" });
    }
  }, []);

  const handleImportData = useCallback(
    async (importedJson: Record<string, unknown>[]) => {
      try {
        const res = await fetch(`${API_URL}/api/matricula-inscripcion/importar`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ matriculas: importedJson }),
        });

        if (res.ok) {
          await fetchSolicitudes(false);
          setToast({ message: "¡Matrículas importadas y guardadas con éxito!", type: "success" });
        } else {
          setToast({ message: "Error al guardar las matrículas importadas.", type: "error" });
        }
      } catch (err) {
        console.error("Error al importar matrículas:", err);
        setToast({ message: "Error de red al intentar importar.", type: "error" });
      }
    },
    [fetchSolicitudes],
  );

  return (
    <div className="p-4 sm:p-8 lg:p-10 space-y-6 sm:space-y-8 max-w-7xl mx-auto select-none">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#16275d] tracking-tight">
            Gestión de Matrículas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Revisa, filtra, exporta o administra las solicitudes de pre-inscripción registradas.
          </p>
        </div>

        <div className="inline-flex items-center gap-2.5 self-start sm:self-auto bg-white border border-slate-200/90 px-4 py-2 rounded-2xl shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
          <span className="text-xs font-medium text-slate-500">Solicitudes registradas</span>
          <span className="text-sm font-black text-[#16275d] tabular-nums">
            {solicitudes.length}
          </span>
        </div>
      </div>

      <div className="animate-in fade-in duration-200">
        <Suspense
          fallback={
            <div className="p-12 text-center text-slate-400 text-xs font-medium">
              Cargando vista de matrículas...
            </div>
          }
        >
          <MatriculaSolicitudesTable
            solicitudes={solicitudes}
            loading={loading}
            isRefreshing={isRefreshing}
            onRefresh={() => fetchSolicitudes(true)}
            onDeleteOne={handleDeleteOne}
            onDeleteSelected={handleDeleteSelected}
            onImportData={handleImportData}
          />
        </Suspense>
      </div>

      {toast && (
        <ToastAlert
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}