// frontend/app/syspanel/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, MessageSquare, Users, Image as ImageIcon, Video, Calendar, Activity, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [totalMensajes, setTotalMensajes] = useState<number | null>(null);
  const [totalMatriculas, setTotalMatriculas] = useState<number | null>(null);
  const [totalPhotos, setTotalPhotos] = useState<number | null>(null);
  const [totalVideos, setTotalVideos] = useState<number | null>(null);
  const [totalEventos, setTotalEventos] = useState<number | null>(null);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Panel | Colegio Cayros";
    let isMounted = true;

    const fetchDashboardData = async (isInitial = false) => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

      try {
        // 1. Fetch Mensajes
        const resMensajes = await fetch(`${apiUrl}/api/mensajes`).catch(() => null);
        if (resMensajes && resMensajes.ok) {
          const data = await resMensajes.json();
          if (isMounted) setTotalMensajes(Array.isArray(data) ? data.length : (data.total ?? 0));
        } else {
          if (isMounted) setTotalMensajes(0);
        }

        // 2. Fetch Matrículas
        const resMatriculas = await fetch(`${apiUrl}/api/matricula-inscripcion`).catch(() => null);
        if (resMatriculas && resMatriculas.ok) {
          const data = await resMatriculas.json();
          if (isMounted) setTotalMatriculas(Array.isArray(data) ? data.length : 0);
        } else {
          if (isMounted) setTotalMatriculas(0);
        }

        // 3. Fetch Galería / Photos
        const resPhotos = await fetch(`${apiUrl}/api/matricula-galeria`).catch(() => null);
        if (resPhotos && resPhotos.ok) {
          const data = await resPhotos.json();
          if (isMounted) setTotalPhotos(Array.isArray(data) ? data.length : 0);
        } else {
          if (isMounted) setTotalPhotos(0);
        }

        // 4. Fetch Videos
        const resVideos = await fetch(`${apiUrl}/api/videos`).catch(() => null);
        if (resVideos && resVideos.ok) {
          const data = await resVideos.json();
          if (isMounted) setTotalVideos(Array.isArray(data) ? data.length : 0);
        } else {
          if (isMounted) setTotalVideos(0);
        }

        // 5. Fetch Eventos
        const resEventos = await fetch(`${apiUrl}/api/eventos`).catch(() => null);
        if (resEventos && resEventos.ok) {
          const data = await resEventos.json();
          if (isMounted) setTotalEventos(Array.isArray(data) ? data.length : 0);
        } else {
          if (isMounted) setTotalEventos(0);
        }

      } catch (error) {
        // Captura silenciosa para proteger la consola del navegador
      } finally {
        if (isInitial && isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData(true);

    const interval = setInterval(() => {
      fetchDashboardData(false);
    }, 10000);

    const handleFocus = () => fetchDashboardData(false);
    window.addEventListener("focus", handleFocus);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto select-none space-y-8">
      
      {/* Cabecera optimizada y minimalista */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-[#16275d]/10 text-[#16275d] rounded-2xl border border-[#16275d]/15 flex-shrink-0 shadow-2xs">
            <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16275d]">
              Panel de Control
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5 font-medium">
              Resumen general y métricas institucionales del Colegio Cayros.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto bg-emerald-50 border border-emerald-200/80 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold text-emerald-800">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-xs shadow-emerald-500/50"></span>
          Sistema Operativo
        </div>
      </header>

      {/* Grid de Tarjetas con Carga Esquelética y Enlaces Direccionales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        
        {/* 1. Mensajes */}
        <Link 
          href="/syspanel/mensajes"
          className="group bg-white border border-slate-200/90 hover:border-[#16275d]/40 p-6 rounded-3xl shadow-2xs hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#16275d]"></div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Mensajes</span>
              <div className="p-2.5 bg-[#16275d]/8 text-[#16275d] rounded-xl group-hover:bg-[#16275d] group-hover:text-yellow-400 transition-colors">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
            {loading ? (
              <div className="h-10 w-20 bg-slate-200 rounded-xl animate-pulse my-1"></div>
            ) : (
              <p className="text-3xl sm:text-4xl font-black text-[#16275d]">
                {totalMensajes}
              </p>
            )}
            <p className="text-xs text-slate-400 mt-2 font-medium">Bandeja de contactos institucionales</p>
          </div>
          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#16275d] group-hover:text-yellow-600 transition-colors">
            <span>Ver bandeja</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* 2. Matriculados */}
        <Link 
          href="/syspanel/matriculas"
          className="group bg-white border border-slate-200/90 hover:border-amber-500/40 p-6 rounded-3xl shadow-2xs hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Matriculados</span>
              <div className="p-2.5 bg-amber-500/10 text-amber-700 rounded-xl group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <Users className="w-5 h-5" />
              </div>
            </div>
            {loading ? (
              <div className="h-10 w-20 bg-slate-200 rounded-xl animate-pulse my-1"></div>
            ) : (
              <p className="text-3xl sm:text-4xl font-black text-[#16275d]">
                {totalMatriculas}
              </p>
            )}
            <p className="text-xs text-slate-400 mt-2 font-medium">Pre-inscripciones y matrículas</p>
          </div>
          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#16275d] group-hover:text-amber-600 transition-colors">
            <span>Ver solicitudes</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* 3. Photos (Galería) */}
        <Link 
          href="/syspanel/galeria"
          className="group bg-white border border-slate-200/90 hover:border-blue-500/40 p-6 rounded-3xl shadow-2xs hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Photos</span>
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <ImageIcon className="w-5 h-5" />
              </div>
            </div>
            {loading ? (
              <div className="h-10 w-20 bg-slate-200 rounded-xl animate-pulse my-1"></div>
            ) : (
              <p className="text-3xl sm:text-4xl font-black text-[#16275d]">
                {totalPhotos}
              </p>
            )}
            <p className="text-xs text-slate-400 mt-2 font-medium">Imágenes activas en galerías</p>
          </div>
          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#16275d] group-hover:text-blue-600 transition-colors">
            <span>Gestionar fotos</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* 4. Videos */}
        <Link 
          href="/syspanel/videos"
          className="group bg-white border border-slate-200/90 hover:border-rose-500/40 p-6 rounded-3xl shadow-2xs hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500"></div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Videos</span>
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl group-hover:bg-rose-500 group-hover:text-white transition-colors">
                <Video className="w-5 h-5" />
              </div>
            </div>
            {loading ? (
              <div className="h-10 w-20 bg-slate-200 rounded-xl animate-pulse my-1"></div>
            ) : (
              <p className="text-3xl sm:text-4xl font-black text-[#16275d]">
                {totalVideos}
              </p>
            )}
            <p className="text-xs text-slate-400 mt-2 font-medium">Contenido audiovisual</p>
          </div>
          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#16275d] group-hover:text-rose-600 transition-colors">
            <span>Gestionar videos</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* 5. Eventos */}
        <Link 
          href="/syspanel/eventos"
          className="group bg-white border border-slate-200/90 hover:border-purple-500/40 p-6 rounded-3xl shadow-2xs hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500"></div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Eventos</span>
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            {loading ? (
              <div className="h-10 w-20 bg-slate-200 rounded-xl animate-pulse my-1"></div>
            ) : (
              <p className="text-3xl sm:text-4xl font-black text-[#16275d]">
                {totalEventos}
              </p>
            )}
            <p className="text-xs text-slate-400 mt-2 font-medium">Agenda y actividades escolares</p>
          </div>
          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#16275d] group-hover:text-purple-600 transition-colors">
            <span>Ver eventos</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* 6. Estado del Sistema */}
        <div className="bg-white border border-slate-200/90 p-6 rounded-3xl shadow-2xs transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Estado</span>
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1 flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500/50"></span>
              Operativo
            </p>
            <p className="text-xs text-slate-400 mt-2 font-medium">PostgreSQL & Prisma ORM</p>
          </div>
          <div className="mt-6 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-400">
            <span>Sincronizado</span>
          </div>
        </div>

      </div>
    </div>
  );
}