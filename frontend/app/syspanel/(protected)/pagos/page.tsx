"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, Loader2, AlertTriangle, Trash2, X } from "lucide-react";
import PagosFiltrosBar, { type FiltroEstadoPago } from "./components/PagosFiltrosBar";
import PagosTabla, { type RegistroPagoAdmin } from "./components/PagosTabla";
import PagoRevisionModal from "./components/PagoRevisionModal";
import ExportImportModal from "../components/ExportImport";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const POR_PAGINA = 8;

type ModoEliminacion =
  | { tipo: "uno"; pago: RegistroPagoAdmin }
  | { tipo: "seleccionados"; ids: number[] }
  | null;

export default function SyspanelPagosPage() {
  const [pagos, setPagos] = useState<RegistroPagoAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState<FiltroEstadoPago>("TODOS");
  const [paginaActual, setPaginaActual] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [pagoSeleccionado, setPagoSeleccionado] = useState<RegistroPagoAdmin | null>(null);
  const [isExportImportOpen, setIsExportImportOpen] = useState(false);
  const [modoEliminacion, setModoEliminacion] = useState<ModoEliminacion>(null);
  const [eliminando, setEliminando] = useState(false);

  const cargarPagos = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${API_URL}/api/pagos-matricula`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "No se pudieron cargar los pagos de matrícula.");
        return;
      }
      setPagos(Array.isArray(data) ? data : []);
    } catch {
      setErrorMsg("Error de conexión al obtener los pagos desde el backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = "Gestión de Pagos | Syspanel";
    let active = true;

    const runInitialLoad = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await fetch(`${API_URL}/api/pagos-matricula`, { cache: "no-store" });
        const data = await res.json();
        if (!active) return;
        if (!res.ok) {
          setErrorMsg(data.error || "No se pudieron cargar los pagos de matrícula.");
          return;
        }
        setPagos(Array.isArray(data) ? data : []);
      } catch {
        if (active) {
          setErrorMsg("Error de conexión al obtener los pagos desde el backend.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void runInitialLoad();

    return () => {
      active = false;
    };
  }, []);

  const conteos = useMemo<Record<FiltroEstadoPago, number>>(() => {
    const base: Record<FiltroEstadoPago, number> = {
      TODOS: pagos.length,
      PENDIENTE_SUBIDA: 0,
      EN_REVISION: 0,
      OBSERVADO_RECHAZADO: 0,
      CONFIRMADO: 0,
      COMPLETADO: 0,
    };

    for (const p of pagos) {
      base[p.estado] = (base[p.estado] || 0) + 1;
    }

    return base;
  }, [pagos]);

  const pagosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();

    return pagos.filter((p) => {
      if (estadoFiltro !== "TODOS" && p.estado !== estadoFiltro) {
        return false;
      }

      if (!q) return true;

      const nombreCompleto =
        `${p.matricula.nombresEstudiante} ${p.matricula.apellidosEstudiante}`.toLowerCase();
      return (
        p.codigoPago.toLowerCase().includes(q) ||
        p.matricula.dniEstudiante.toLowerCase().includes(q) ||
        nombreCompleto.includes(q) ||
        p.matricula.nombresApoderado.toLowerCase().includes(q) ||
        (p.numeroOperacion || "").toLowerCase().includes(q)
      );
    });
  }, [pagos, busqueda, estadoFiltro]);

  const datosExportar = useMemo(
    () =>
      pagosFiltrados.map((p) => ({
        codigoPago: p.codigoPago,
        estado: p.estado,
        accesoHabilitado: p.accesoHabilitado ? "Habilitado" : "Cerrado",
        dniEstudiante: p.matricula.dniEstudiante,
        estudiante: `${p.matricula.nombresEstudiante} ${p.matricula.apellidosEstudiante}`,
        nivel: p.matricula.nivel,
        grado: p.matricula.grado,
        sede: p.matricula.sede,
        apoderado: p.matricula.nombresApoderado,
        telefono: p.matricula.telefono,
        bancoOrigen: p.bancoOrigen || "",
        numeroOperacion: p.numeroOperacion || "",
        montoPagado: p.montoPagado ?? "",
        mensajeAdmin: p.mensajeAdmin || "",
      })),
    [pagosFiltrados],
  );

  const handleImportarPagos = async (importedJson: Record<string, unknown>[]) => {
    const res = await fetch(`${API_URL}/api/pagos-matricula/importar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pagos: importedJson }),
    });
    if (res.ok) {
      await cargarPagos();
    }
  };

  const totalPaginas = Math.max(1, Math.ceil(pagosFiltrados.length / POR_PAGINA));
  const paginaSegura = Math.min(paginaActual, totalPaginas);

  const pagosPaginados = useMemo(() => {
    const inicio = (paginaSegura - 1) * POR_PAGINA;
    return pagosFiltrados.slice(inicio, inicio + POR_PAGINA);
  }, [pagosFiltrados, paginaSegura]);

  const handleActualizado = (actualizado: RegistroPagoAdmin) => {
    setPagos((prev) => prev.map((item) => (item.id === actualizado.id ? actualizado : item)));
  };

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleToggleSelectPage = (idsPagina: number[]) => {
    const todosMarcados = idsPagina.every((id) => selectedIds.includes(id));
    if (todosMarcados) {
      setSelectedIds((prev) => prev.filter((id) => !idsPagina.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...idsPagina])));
    }
  };

  const confirmarEliminacion = useCallback(async () => {
    if (!modoEliminacion || eliminando) return;
    setEliminando(true);
    setErrorMsg(null);

    try {
      if (modoEliminacion.tipo === "uno") {
        const targetId = modoEliminacion.pago.id;
        const res = await fetch(`${API_URL}/api/pagos-matricula/${targetId}`, {
          method: "DELETE",
        });

        if (res.ok || res.status === 404) {
          setPagos((prev) => prev.filter((p) => p.id !== targetId));
          setSelectedIds((prev) => prev.filter((id) => id !== targetId));
        } else {
          setErrorMsg("No se pudo eliminar el registro desde el servidor.");
        }
      } else {
        const idsAEliminar = modoEliminacion.ids;
        const res = await fetch(`${API_URL}/api/pagos-matricula/eliminar-lote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: idsAEliminar }),
        });

        if (res.ok) {
          setPagos((prev) => prev.filter((p) => !idsAEliminar.includes(p.id)));
          setSelectedIds((prev) => prev.filter((id) => !idsAEliminar.includes(id)));
        } else {
          setErrorMsg("No se pudieron eliminar los registros seleccionados desde el servidor.");
        }
      }

      setModoEliminacion(null);
    } catch {
      setErrorMsg("Error de red al intentar eliminar los registros.");
    } finally {
      setEliminando(false);
    }
  }, [modoEliminacion, eliminando]);

  useEffect(() => {
    if (!modoEliminacion) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !eliminando) {
        e.preventDefault();
        setModoEliminacion(null);
        return;
      }
      if (e.key === "Enter" && !eliminando) {
        const target = e.target as HTMLElement | null;
        if (target?.dataset?.cancelDelete === "true") return;
        e.preventDefault();
        void confirmarEliminacion();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow || "unset";
    };
  }, [modoEliminacion, eliminando, confirmarEliminacion]);

  return (
    <div className="min-h-screen bg-slate-50 py-5 sm:py-8 px-3 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">
        <div className="space-y-1">
          <Link
            href="/syspanel"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16275d] hover:text-amber-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Syspanel</span>
          </Link>
          <div className="flex items-center gap-2.5 pt-1">
            <div className="w-9 h-9 rounded-xl bg-[#111c38] text-amber-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-['Poppins',sans-serif] text-[#111c38]">
              Pagos Institucionales de Matrícula
            </h1>
          </div>
        </div>

        <PagosFiltrosBar
          busqueda={busqueda}
          onBusquedaChange={(val) => {
            setBusqueda(val);
            setPaginaActual(1);
          }}
          estadoFiltro={estadoFiltro}
          onEstadoFiltroChange={(est) => {
            setEstadoFiltro(est);
            setPaginaActual(1);
          }}
          conteos={conteos}
          onLimpiar={() => {
            setBusqueda("");
            setEstadoFiltro("TODOS");
            setPaginaActual(1);
          }}
          onRefresh={cargarPagos}
          isRefreshing={loading}
          onOpenExportImport={() => setIsExportImportOpen(true)}
          totalSeleccionados={selectedIds.length}
          onEliminarSeleccionados={() =>
            setModoEliminacion({ tipo: "seleccionados", ids: selectedIds })
          }
        />

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {loading && pagos.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 flex items-center justify-center gap-3 text-xs font-semibold text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin text-[#16275d]" />
            <span>Cargando registros de pago...</span>
          </div>
        ) : (
          <PagosTabla
            pagos={pagosPaginados}
            paginaActual={paginaSegura}
            totalPaginas={totalPaginas}
            totalFiltrados={pagosFiltrados.length}
            porPagina={POR_PAGINA}
            onCambiarPagina={(num) => setPaginaActual(num)}
            onRevisar={(pago) => setPagoSeleccionado(pago)}
            onEliminarUno={(pago) => setModoEliminacion({ tipo: "uno", pago })}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectPage={handleToggleSelectPage}
          />
        )}

        <PagoRevisionModal
          apiUrl={API_URL}
          pago={pagoSeleccionado}
          onClose={() => setPagoSeleccionado(null)}
          onGuardado={handleActualizado}
        />

        <ExportImportModal
          isOpen={isExportImportOpen}
          onClose={() => setIsExportImportOpen(false)}
          title="Gestión de Pagos Institucionales"
          data={datosExportar}
          filename="reporte-pagos-matricula"
          onImportData={handleImportarPagos}
        />

        {modoEliminacion && (
          <div className="fixed inset-0 z-[99999] bg-slate-950/65 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
              <div className="bg-rose-600 text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold">Confirmar Eliminación</h3>
                    <p className="text-[11px] text-rose-100">
                      Presiona Enter para confirmar o Esc para cancelar
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setModoEliminacion(null)}
                  disabled={eliminando}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 cursor-pointer disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 text-xs sm:text-sm text-slate-600 space-y-2">
                {modoEliminacion.tipo === "uno" && (
                  <p>
                    ¿Deseas eliminar el registro de pago{" "}
                    <strong className="text-slate-900 font-mono">
                      {modoEliminacion.pago.codigoPago}
                    </strong>{" "}
                    de{" "}
                    <strong className="text-slate-900">
                      {modoEliminacion.pago.matricula.nombresEstudiante}{" "}
                      {modoEliminacion.pago.matricula.apellidosEstudiante}
                    </strong>
                    ?
                  </p>
                )}

                {modoEliminacion.tipo === "seleccionados" && (
                  <p>
                    ¿Deseas eliminar los{" "}
                    <strong className="text-slate-900">{modoEliminacion.ids.length}</strong>{" "}
                    registros seleccionados?
                  </p>
                )}
              </div>

              <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  data-cancel-delete="true"
                  onClick={() => setModoEliminacion(null)}
                  disabled={eliminando}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => void confirmarEliminacion()}
                  disabled={eliminando}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{eliminando ? "Eliminando..." : "Sí, eliminar"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}