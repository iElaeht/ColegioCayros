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
  ScrollText
} from "lucide-react";

export default function SubNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("");

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

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();

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

      window.history.pushState(null, "", window.location.pathname);
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
        { label: "Galería", href: "#galeria", icon: BookOpen },
        { label: "Videos", href: "#videos", icon: Video },
        { label: "Eventos", href: "#eventos", icon: Calendar },
        { label: "Nuestros Objetivos", href: "#objetivos", icon: Award },
      ]
    },
    {
      title: "Sedes",
      href: "/sedes", // Enlace directo a la nueva página independiente de sedes
      icon: Building2,
      hasDropdown: false,
    },
    {
      title: "Académico",
      icon: GraduationCap,
      hasDropdown: true,
      items: [
        { label: "Inicial", href: "#niveles", icon: GraduationCap },
        { label: "Primaria", href: "#niveles", icon: GraduationCap },
        { label: "Secundaria", href: "#niveles", icon: GraduationCap },
      ]
    },
    {
      title: "Servicios",
      icon: HeartHandshake,
      hasDropdown: true,
      items: [
        { label: "Enfermería", href: "#servicios", icon: HeartHandshake },
        { label: "Psicológica", href: "#servicios", icon: HeartHandshake },
      ]
    },
    {
      title: "Inscripciones",
      icon: FileText,
      hasDropdown: true,
      items: [
        { label: "Zona de Matrícula", href: "/matricula", icon: CheckCircle },
        { label: "Boletín Informativo", href: "/boletin", icon: FileText },
      ]
    },
    {
      title: "Legal",
      icon: Shield,
      hasDropdown: true,
      items: [
        { label: "Política de Privacidad", href: "/politica", icon: Shield },
        { label: "Términos y Condiciones", href: "/terminos", icon: ScrollText },
      ]
    },
    {
      title: "Contáctanos",
      href: "#contacto",
      icon: MessageSquare,
      hasDropdown: false,
    },
  ];

  return (
    <div className="sticky top-[73px] sm:top-[77px] z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs select-none">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-center h-14 gap-1 lg:gap-2">
          
          {menuCategories.map((menu) => {
            const Icon = menu.icon;

            if (!menu.hasDropdown) {
              return (
                <Link
                  key={menu.title}
                  href={menu.href || "#"}
                  onClick={(e) => {
                    if (menu.href?.startsWith("#")) scrollToSection(e, menu.href);
                  }}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-[11px] sm:text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-[#16275d] transition-all cursor-pointer outline-none shrink-0"
                >
                  <Icon className="w-3.5 h-3.5 text-[#16275d]" />
                  <span>{menu.title}</span>
                </Link>
              );
            }

            return (
              <div key={menu.title} className="relative group shrink-0">
                <button
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-[11px] sm:text-xs font-bold text-slate-700 group-hover:bg-[#16275d] group-hover:text-amber-400 transition-all cursor-pointer outline-none"
                >
                  <Icon className="w-3.5 h-3.5 text-[#16275d] group-hover:text-amber-400 transition-colors" />
                  <span>{menu.title}</span>
                  <ChevronDown className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" />
                </button>

                <div className="absolute left-0 top-full pt-1 hidden group-hover:block z-50">
                  <div className="w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="space-y-1">
                      {menu.items?.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const isInternalAnchor = subItem.href.startsWith("#");
                        const targetId = isInternalAnchor ? subItem.href.replace("#", "") : "";
                        const isActive = isHome && isInternalAnchor && activeSection === targetId;

                        if (!isInternalAnchor) {
                          return (
                            <Link
                              key={subItem.label}
                              href={subItem.href}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-blue-50 hover:text-[#16275d] transition-colors"
                            >
                              <SubIcon className="w-4 h-4 text-[#16275d]" />
                              <span>{subItem.label}</span>
                            </Link>
                          );
                        }

                        return (
                          <a
                            key={subItem.label}
                            href={subItem.href}
                            onClick={(e) => scrollToSection(e, subItem.href)}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                              isActive 
                                ? "bg-[#16275d] text-amber-400" 
                                : "text-slate-600 hover:bg-blue-50 hover:text-[#16275d]"
                            }`}
                          >
                            <SubIcon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-[#16275d]"}`} />
                            <span>{subItem.label}</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}