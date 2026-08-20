"use client";

import { useState } from "react";

export default function DashboardPage() {
  // Inicializamos el estado de manera segura leyendo localStorage una sola vez al montar
  const [adminName] = useState<string>(() => {
    if (typeof window === "undefined") return "Administrador";
    try {
      const storedUser = localStorage.getItem("admin_user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user && typeof user.usuario === "string") {
          return user.usuario;
        }
      }
    } catch (e) {
      console.error("Error al leer los datos del usuario desde localStorage", e);
    }
    return "Administrador";
  });

  return (
    <div>
      <header className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">
          Bienvenido, <span className="text-amber-400">{adminName}</span> 👋
        </h2>
        <p className="text-slate-400 mt-1">
          Aquí tienes un resumen general del sistema del Colegio Cayros.
        </p>
      </header>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
          <h3 className="text-slate-400 text-sm font-medium">Mensajes Recibidos</h3>
          <p className="text-3xl font-bold text-amber-400 mt-2">--</p>
          <p className="text-xs text-slate-500 mt-2">Sección de contactos</p>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
          <h3 className="text-slate-400 text-sm font-medium">Usuarios Registrados</h3>
          <p className="text-3xl font-bold text-amber-400 mt-2">--</p>
          <p className="text-xs text-slate-500 mt-2">Control de accesos</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
          <h3 className="text-slate-400 text-sm font-medium">Estado del Sistema</h3>
          <p className="text-lg font-semibold text-emerald-400 mt-2 flex items-center gap-2">
            <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
            Operativo
          </p>
          <p className="text-xs text-slate-500 mt-2">Conectado a PostgreSQL</p>
        </div>
      </div>
    </div>
  );
}