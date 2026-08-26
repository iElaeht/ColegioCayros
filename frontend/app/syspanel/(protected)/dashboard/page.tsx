"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, MessageSquare, Users, Activity } from "lucide-react";

export default function DashboardPage() {
  const [totalMensajes, setTotalMensajes] = useState<number | string>("--");
  const [loadingMensajes, setLoadingMensajes] = useState(true);

  useEffect(() => {
    document.title = "Panel | Colegio Cayros";
    let isMounted = true;

    const fetchMensajesCount = async (isInitial = false) => {
      try {
        // Usamos una variable de entorno para ocultar la ruta/puerto real del backend
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const response = await fetch(`${apiUrl}/api/mensajes`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          // Si hay error de servidor, evitamos romper la consola de forma agresiva
          return;
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          return;
        }

        const data = await response.json();
        const count = Array.isArray(data) ? data.length : (data.total ?? 0);

        if (isMounted) {
          setTotalMensajes(count);
        }
      } catch (error) {
        // Captura silenciosa para proteger la consola del navegador de errores de red o CORS
      } finally {
        if (isInitial && isMounted) {
          setLoadingMensajes(false);
        }
      }
    };

    // Carga inicial
    fetchMensajesCount(true);

    // Polling cada 5 segundos para mantener actualizado sin recargar la página
    const interval = setInterval(() => {
      fetchMensajesCount(false);
    }, 5000);

    // Actualización inmediata si el usuario regresa a la pestaña
    const handleFocus = () => fetchMensajesCount(false);
    window.addEventListener("focus", handleFocus);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return (
    <div className="w-full">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-[#6eb5ec]/10 text-[#6eb5ec] rounded-xl border border-[#6eb5ec]/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Bienvenido
          </h2>
        </div>
        <p className="text-slate-500 text-sm">
          Aquí tienes un resumen general del sistema del Colegio Cayros.
        </p>
      </header>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tarjeta 1: Mensajes Recibidos (Dinámica con actualización automática) */}
        <div className="bg-white border-2 border-[#6eb5ec]/30 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#6eb5ec]"></div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-600 text-sm font-semibold">Mensajes Recibidos</h3>
            <div className="p-2 bg-[#6eb5ec]/10 text-[#6eb5ec] rounded-lg">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">
            {loadingMensajes ? "..." : totalMensajes}
          </p>
          <p className="text-xs text-slate-400 mt-2">Sección de contactos</p>
        </div>
        
        {/* Tarjeta 2: Usuarios Registrados */}
        <div className="bg-white border-2 border-[#6eb5ec]/30 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#6eb5ec]"></div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-600 text-sm font-semibold">Usuarios Registrados</h3>
            <div className="p-2 bg-[#6eb5ec]/10 text-[#6eb5ec] rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">--</p>
          <p className="text-xs text-slate-400 mt-2">Control de accesos</p>
        </div>

        {/* Tarjeta 3: Estado del Sistema */}
        <div className="bg-white border-2 border-[#6eb5ec]/30 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#6eb5ec]"></div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-600 text-sm font-semibold">Estado del Sistema</h3>
            <div className="p-2 bg-[#6eb5ec]/10 text-[#6eb5ec] rounded-lg">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg font-semibold text-emerald-600 mt-2 flex items-center gap-2">
            <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
            Operativo
          </p>
          <p className="text-xs text-slate-400 mt-2">Conectado a PostgreSQL</p>
        </div>

      </div>
    </div>
  );
}