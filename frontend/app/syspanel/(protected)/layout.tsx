// frontend/app/syspanel/(protected)/layout.tsx
"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebard";

export default function SysPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Estado para controlar si el sidebar está expandido (true) o comprimido (false)
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="min-h-screen bg-white flex font-['Poppins',sans-serif]">
      {/* Pasamos las props de control al Sidebar */}
      <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

      {/* Margen dinámico: ml-64 si está abierto, ml-20 si está comprimido */}
      <main 
        className={`flex-1 transition-all duration-300 ease-in-out p-8 text-slate-900 min-h-screen bg-slate-50 ${
          isExpanded ? "ml-64" : "ml-20"
        }`}
      >
        {children}
      </main>
    </div>
  );
}