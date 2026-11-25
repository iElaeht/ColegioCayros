// frontend/components/layout/SubNavbar.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Home, 
  Award, 
  Building2, 
  GraduationCap, 
  HeartHandshake, 
  MessageSquare, 
  FileText, 
  ChevronDown, 
  BookOpen, 
  Video, 
  Calendar, 
  CheckCircle,
  Shield,
  ScrollText,
  CreditCard,
  Menu,
  X
} from "lucide-react";

export default function SubNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdownMobile, setOpenDropdownMobile] = useState<string | null>(null);

  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) {
      setActiveSection("");
      return;
    }

    const handleScroll = () => {
      if (window.scrollY < 200) {
        setActiveSection("");
        return;
      }

      const sections = ["niveles", "galeria", "objetivos", "eventos", "contacto"];
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdownMobile(null);
  }, [pathname]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (!isHome) {
      router.push(`/${href}`);
      return;
    }

    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 125;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(targetId);
    }
  };

  const menuCategories = [
    {
      title: "Inicio",
      href: "/",
      icon: Home,
      hasDropdown: false,
    },
    {
      title: "Nosotros",
      icon: Award,
      hasDropdown: true,
      items: [
        { label: "Galería", href: "/galeria", icon: BookOpen },
        { label: "Videos", href: "/#videos", icon: Video },
        { label: "Eventos", href: "/eventos", icon: Calendar },
        { label: "Nuestra Identidad", href: "/nosotros", icon: Award },
      ]
    },
    {
      title: "Sedes",
      href: "/sedes",
      icon: Building2,
      hasDropdown: false,
    },
    {
      title: "Académico",
      icon: GraduationCap,
      hasDropdown: true,  
      items: [
        { label: "Inicial", href: "/academico/inicial", icon: GraduationCap },
        { label: "Primaria", href: "/academico/primaria", icon: GraduationCap },
        { label: "Secundaria", href: "/academico/secundaria", icon: GraduationCap },
      ]
    },
    {
      title: "Servicios",
      icon: HeartHandshake,
      hasDropdown: true,
      items: [
        { label: "Enfermería", href: "/servicios/enfermeria", icon: HeartHandshake },
        { label: "Psicológica", href: "/servicios/psicologica", icon: HeartHandshake },
      ]
    },
    {
      title: "Inscripciones",
      icon: FileText,
      hasDropdown: true,
      items: [
        { label: "Zona de Matrícula", href: "/matricula", icon: CheckCircle },
        { label: "Pagos Institucionales", href: "/pagos-institucional", icon: CreditCard },
        { label: "Boletín Informativo", href: "/boletin", icon: FileText },
      ]
    },
    {
      title: "Legal",
      icon: Shield,
      hasDropdown: true,
      items: [
        { label: "Política de Privacidad", href: "/legal/politica", icon: Shield },
        { label: "Términos y Condiciones", href: "/legal/terminos", icon: ScrollText },
      ]
    },
    {
      title: "Contáctanos",
      href: "/contactanos",
      icon: MessageSquare,
      hasDropdown: false,
    },
  ];

  return (
    <div className="sticky top-[73px] sm:top-[77px] z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between lg:justify-center h-14">
          
          <span className="lg:hidden text-xs font-extrabold text-[#16275d] uppercase tracking-wider flex items-center gap-1.5">
            Menú Institucional
          </span>

          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {menuCategories.map((menu) => {
              const Icon = menu.icon;
              const isDirectActive = menu.href && pathname === menu.href;

              if (!menu.hasDropdown) {
                return (
                  <Link
                    key={menu.title}
                    href={menu.href || "#"}
                    onClick={(e) => {
                      if (menu.href?.includes("#")) scrollToSection(e, menu.href);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer outline-none shrink-0 ${
                      isDirectActive
                        ? "bg-[#16275d] text-amber-400 shadow-xs"
                        : "text-slate-700 hover:bg-slate-100 hover:text-[#16275d]"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isDirectActive ? "text-amber-400" : "text-[#16275d]"}`} />
                    <span>{menu.title}</span>
                  </Link>
                );
              }

              const hasActiveSubItem = menu.items?.some(sub => pathname.startsWith(sub.href) && sub.href !== "/");

              return (
                <div key={menu.title} className="relative group shrink-0">
                  <button
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer outline-none ${
                      hasActiveSubItem
                        ? "bg-[#16275d]/10 text-[#16275d] font-extrabold"
                        : "text-slate-700 hover:bg-slate-100 hover:text-[#16275d]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-[#16275d]" />
                    <span>{menu.title}</span>
                    <ChevronDown className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180 text-slate-400" />
                  </button>

                  <div className="absolute left-0 top-full pt-1 hidden group-hover:block z-50">
                    <div className="w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="space-y-1">
                        {menu.items?.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const isSubActive = pathname === subItem.href || (subItem.href.startsWith("/nosotros") && pathname.startsWith("/nosotros"));

                          return (
                            <Link
                              key={subItem.label}
                              href={subItem.href}
                              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                                isSubActive
                                  ? "bg-[#16275d] text-amber-400 font-bold"
                                  : "text-slate-600 hover:bg-slate-50 hover:text-[#16275d]"
                              }`}
                            >
                              <SubIcon className={`w-4 h-4 ${isSubActive ? "text-amber-400" : "text-[#16275d]"}`} />
                              <span>{subItem.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#16275d] transition-colors cursor-pointer outline-none flex items-center gap-2 text-xs font-bold"
          >
            <span>{mobileMenuOpen ? "Cerrar" : "Menú"}</span>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xl p-4 space-y-2 max-h-[75vh] overflow-y-auto animate-in slide-in-from-top-2 duration-200 z-50">
          {menuCategories.map((menu) => {
            const Icon = menu.icon;
            const isDirectActive = menu.href && pathname === menu.href;
            const isDropdownOpen = openDropdownMobile === menu.title;

            if (!menu.hasDropdown) {
              return (
                <Link
                  key={menu.title}
                  href={menu.href || "#"}
                  onClick={(e) => {
                    if (menu.href?.includes("#")) scrollToSection(e, menu.href);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isDirectActive
                      ? "bg-[#16275d] text-amber-400"
                      : "text-slate-700 bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isDirectActive ? "text-amber-400" : "text-[#16275d]"}`} />
                  <span>{menu.title}</span>
                </Link>
              );
            }

            return (
              <div key={menu.title} className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                <button
                  type="button"
                  onClick={() => setOpenDropdownMobile(isDropdownOpen ? null : menu.title)}
                  className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-[#16275d]" />
                    <span>{menu.title}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isDropdownOpen && (
                  <div className="px-3 pb-3 space-y-1 bg-white pt-1 border-t border-slate-100">
                    {menu.items?.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = pathname === subItem.href || (subItem.href.startsWith("/nosotros") && pathname.startsWith("/nosotros"));

                      return (
                        <Link
                          key={subItem.label}
                          href={subItem.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                            isSubActive
                              ? "bg-[#16275d] text-amber-400 font-bold"
                              : "text-slate-600 hover:bg-slate-100 hover:text-[#16275d]"
                          }`}
                        >
                          <SubIcon className={`w-4 h-4 ${isSubActive ? "text-amber-400" : "text-[#16275d]"}`} />
                          <span>{subItem.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}