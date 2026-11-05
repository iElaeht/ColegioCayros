// frontend/app/syspanel/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, MessageSquare, Users, Activity, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [totalMensajes, setTotalMensajes] = useState<number | string>("--");
  const [loadingMensajes, setLoadingMensajes] = useState(true);

  useEffect(() => {
    document.title = "Panel | Colegio Cayros";
    let isMounted = true;

    const fetchMensajesCount = async (isInitial = false) => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const response = await fetch(`${apiUrl}/api/mensajes`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) return;

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) return;

        const data = await response.json();
        const count = Array.isArray(data) ? data.length : (data.total ?? 0);

        if (isMounted) {
          setTotalMensajes(count);
        }
      } catch (error) {
        // Captura silenciosa para proteger la consola del navegador
      } finally {
        if (isInitial && isMounted) {
          setLoadingMensajes(false);
        }
      }
    };

    fetchMensajesCount(true);

    const interval = setInterval(() => {
      fetchMensajesCount(false);
    }, 5000);

    const handleFocus = () => fetchMensajesCount(false);
    window.addEventListener("focus", handleFocus);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto select-none">
      
      {/* Cabecera optimizada y responsiva */}
      <header className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-[#16275d]/10 text-[#16275d] rounded-2xl border border-[#16275d]/20 flex-shrink-0 shadow-xs">
            <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16275d]">
              Panel de Control
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Resumen general y estadísticas del sistema del Colegio Cayros.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto bg-amber-100/60 border border-amber-200 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold text-[#16275d]">
          <span className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping"></span>
          Sistema Activo
        </div>
      </header>

      {/* Tarjetas de estadísticas adaptadas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        
        {/* Tarjeta 1: Mensajes Recibidos */}
        <Link 
          href="/syspanel/mensajes"
          className="group bg-white border border-slate-200 hover:border-[#16275d]/40 p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#16275d]"></div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 text-xs sm:text-sm font-bold uppercase tracking-wider">Mensajes</span>
              <div className="p-2.5 bg-[#16275d]/10 text-[#16275d] rounded-xl group-hover:bg-[#16275d] group-hover:text-amber-400 transition-colors">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-black text-[#16275d]">
              {loadingMensajes ? "..." : totalMensajes}
            </p>
            <p className="text-xs text-slate-400 mt-2 font-medium">Bandeja de contactos institucionales</p>
          </div>
          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#16275d] group-hover:text-amber-600 transition-colors">
            <span>Ver bandeja</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
        
        {/* Tarjeta 2: Usuarios Registrados */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400"></div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 text-xs sm:text-sm font-bold uppercase tracking-wider">Usuarios</span>
              <div className="p-2.5 bg-amber-400/20 text-[#16275d] rounded-xl">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-black text-[#16275d]">--</p>
            <p className="text-xs text-slate-400 mt-2 font-medium">Control de accesos y personal</p>
          </div>
          <div className="mt-6 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-400">
            <span>Control interno</span>
          </div>
        </div>

        {/* Tarjeta 3: Estado del Sistema */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm transition-all duration-300 relative overflow-hidden flex flex-col justify-between sm:col-span-2 lg:col-span-1">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 text-xs sm:text-sm font-bold uppercase tracking-wider">Estado</span>
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1 flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500/50"></span>
              Operativo
            </p>
            <p className="text-xs text-slate-400 mt-2 font-medium">Sincronizado con base de datos</p>
          </div>
          <div className="mt-6 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-400">
            <span>PostgreSQL & Prisma ORM</span>
          </div>
        </div>

      </div>
    </div>
  );
}