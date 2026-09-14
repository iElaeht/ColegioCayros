// frontend/app/syspanel/(protected)/layout.tsx
"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebard";

export default function SysPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-['Poppins',sans-serif]">
      {/* Sidebar / Navbar móvil y de escritorio */}
      <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

      {/* Contenedor principal: sin margen izquierdo en móvil (w-full), y margen dinámico en escritorio (lg:ml-64 o lg:ml-20). 
          Se añade pt-20 en móvil para compensar la altura del navbar fijo superior (h-16 + padding). */}
      <main 
        className={`flex-1 transition-all duration-300 ease-in-out p-4 md:p-8 text-slate-900 min-h-screen bg-slate-50 pt-20 lg:pt-8 w-full overflow-x-hidden ${
          isExpanded ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        {children}
      </main>
    </div>
  );
}