"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, MessageSquare, Users, LogOut } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // 1. Expiramos la cookie inmediatamente
    document.cookie = "sys_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    // 2. Limpiamos todo el almacenamiento local
    localStorage.removeItem("sys_token");
    localStorage.removeItem("admin_user");
    
    // 3. Redirigimos al login y refrescamos el router para limpiar la caché de cliente
    router.replace("/");
    router.refresh();
  };

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Mensajes", href: "/dashboard/mensajes", icon: MessageSquare },
    { name: "Usuarios", href: "/dashboard/usuarios", icon: Users },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 text-slate-300">
      {/* Encabezado */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white tracking-wide">SYS-PANEL</h1>
        <p className="text-xs text-slate-500 mt-1">Colegio Cayros</p>
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-amber-500 text-slate-950 font-semibold shadow-lg shadow-amber-500/20"
                  : "hover:bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Botón Salir */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}