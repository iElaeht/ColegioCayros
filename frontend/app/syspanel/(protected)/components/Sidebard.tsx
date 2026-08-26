// frontend/app/syspanel/(protected)/components/Sidebard.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Image as ImageIcon, 
  Video, 
  Calendar, 
  User, 
  LogOut,
  Users,
  GraduationCap,
  FileText,
  CreditCard,
  ChevronDown,
  PanelLeftClose,
  FolderKanban
} from "lucide-react";

interface SidebarProps {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean | ((prev: boolean) => boolean)) => void;
}

export default function Sidebar({ isExpanded, setIsExpanded }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [adminName] = useState<string>(() => {
    if (typeof window === "undefined") return "Admin";
    try {
      const storedUser = localStorage.getItem("admin_user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        return user?.nombre || user?.usuario || "Admin";
      }
    } catch (e) {
      console.error("Error al leer el usuario:", e);
    }
    return "Admin";
  });

  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const handleGroupClick = (key: string) => {
    if (!isExpanded) {
      setIsExpanded(true);
      setOpenGroup(key);
    } else {
      setOpenGroup(prev => (prev === key ? null : key));
    }
  };

  const handleLogout = () => {
    document.cookie = "sys_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem("sys_token");
    localStorage.removeItem("admin_user");
    router.replace("/");
    router.refresh();
  };

  const navigationGroups = [
    {
      key: "comunidad",
      name: "Atención y Comunidad",
      icon: Users,
      items: [
        { name: "Mensajes", href: "/syspanel/mensajes", icon: MessageSquare },
        { name: "Alumnos", href: "/syspanel/alumnos", icon: GraduationCap },
        { name: "Docentes", href: "/syspanel/docentes", icon: User },
      ],
    },
    {
      key: "academico",
      name: "Procesos Escolares",
      icon: FileText,
      items: [
        { name: "Matrículas", href: "/syspanel/matriculas", icon: FileText },
        { name: "Pensiones", href: "/syspanel/pensiones", icon: CreditCard },
      ],
    },
    {
      key: "multimedia",
      name: "Gestión Multimedia",
      icon: FolderKanban,
      items: [
        { name: "Galería", href: "/syspanel/galeria", icon: ImageIcon },
        { name: "Videos", href: "/syspanel/videos", icon: Video },
        { name: "Eventos", href: "/syspanel/eventos", icon: Calendar },
      ],
    },
  ];

  return (
    <aside 
      onClick={() => {
        if (!isExpanded) setIsExpanded(true);
      }}
      className={`fixed left-0 top-0 h-screen bg-slate-900 border-r border-slate-800 flex flex-col z-50 transition-all duration-300 ease-in-out ${
        isExpanded ? "w-64 cursor-default" : "w-20 cursor-pointer"
      }`}
      title={!isExpanded ? "Haz clic para expandir el menú" : undefined}
    >
      {/* 1. Cabecera y Logo perfectamente alineados */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-2 overflow-hidden h-20">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 relative flex-shrink-0 flex items-center justify-center">
            <Image 
              src="/images/ui/Cayros-logo.png" 
              alt="Logo Colegio Cayros" 
              width={36} 
              height={36} 
              className="object-contain"
            />
          </div>
          <div className={`whitespace-nowrap overflow-hidden transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0 pointer-events-none hidden"}`}>
            <h1 className="text-sm font-bold text-white tracking-wide leading-tight">Colegio Cayros</h1>
            <p className="text-[10px] text-slate-400">Panel de Gestión</p>
          </div>
        </div>

        {isExpanded && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(false);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex-shrink-0 cursor-pointer"
            title="Ocultar barra lateral"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. Sección de Usuario Minimalista (Sin cajas pesadas) */}
      <div className="px-3 pt-4 pb-2">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 bg-slate-950/30 border border-slate-800/40 overflow-hidden">
          <User className="w-5 h-5 flex-shrink-0 text-amber-400" />
          <div className={`whitespace-nowrap overflow-hidden transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0 pointer-events-none hidden"}`}>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold leading-none">Conectado</p>
            <p suppressHydrationWarning className="text-xs font-bold text-amber-400 truncate mt-0.5">
              {adminName}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-1">
        <hr className="border-slate-800/60" />
      </div>

      {/* 3. Navegación Principal y Agrupada */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <Link
          href="/syspanel/dashboard"
          onClick={() => {
            if (!isExpanded) setIsExpanded(true);
          }}
          title={!isExpanded ? "Inicio" : undefined}
          className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors relative group ${
            pathname === "/syspanel/dashboard"
              ? "bg-amber-500 text-slate-950 font-semibold shadow-lg shadow-amber-500/20"
              : "hover:bg-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
          <span className={`whitespace-nowrap transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0 pointer-events-none hidden"}`}>
            Inicio
          </span>
        </Link>

        {navigationGroups.map((group) => {
          const GroupIcon = group.icon;
          const isGroupActive = group.items.some((sub) => pathname === sub.href);
          const isOpen = openGroup === group.key || (isGroupActive && openGroup === null);

          return (
            <div key={group.key} className="space-y-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleGroupClick(group.key);
                }}
                title={!isExpanded ? group.name : undefined}
                className={`flex items-center justify-between w-full px-3 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  isGroupActive && !isOpen
                    ? "bg-slate-800/80 text-amber-400"
                    : "hover:bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <GroupIcon className="w-5 h-5 flex-shrink-0" />
                  <span className={`whitespace-nowrap transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0 pointer-events-none hidden"}`}>
                    {group.name}
                  </span>
                </div>
                {isExpanded && (
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                )}
              </button>

              {/* Submenús con animación fluida */}
              <div 
                className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
                  isExpanded && isOpen 
                    ? "grid-rows-[1fr] opacity-100 mt-1 pl-9 space-y-1" 
                    : "grid-rows-[0fr] opacity-0 pl-9 space-y-0"
                }`}
              >
                <div className="overflow-hidden space-y-1">
                  {group.items.map((sub) => {
                    const SubIcon = sub.icon;
                    const isSubActive = pathname === sub.href;

                    return (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        onClick={(e) => e.stopPropagation()}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          isSubActive
                            ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                        }`}
                      >
                        <SubIcon className="w-4 h-4 flex-shrink-0" />
                        <span className="whitespace-nowrap">{sub.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      <div className="px-4 py-1">
        <hr className="border-slate-800/60" />
      </div>

      {/* 4. Botón Cerrar Sesión */}
      <div className="p-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleLogout();
          }}
          title={!isExpanded ? "Cerrar Sesión" : undefined}
          className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer overflow-hidden"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className={`whitespace-nowrap transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0 pointer-events-none hidden"}`}>
            Cerrar Sesión
          </span>
        </button>
      </div>
    </aside>
  );
}