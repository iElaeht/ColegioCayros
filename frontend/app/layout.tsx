// frontend/app/layout.tsx
"use client";

import { Open_Sans } from "next/font/google";
import { useEffect, useRef } from "react";
import ScrollToTop from "@/app/components/common/ScrollToTop";
import "./globals.css";

const openSans = Open_Sans({ 
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Desactivamos la restauración automática del navegador para evitar saltos al recargar
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const handleScroll = () => {
      // Agregamos la clase para mostrar el scroll con el color #16275d
      document.body.classList.add("is-scrolling");

      // Limpiamos el temporizador anterior si sigue haciendo scroll
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Tiempo de inactividad antes de ocultarlo (1200ms = 1.2 segundos)
      scrollTimeoutRef.current = setTimeout(() => {
        document.body.classList.remove("is-scrolling");
      }, 1200);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  return (
    <html lang="es">
      <body className={`${openSans.className} bg-gray-50 text-gray-900 antialiased`}>
        {/* Componente que asegura el salto al inicio al cambiar de página */}
        <ScrollToTop />
        {children}
      </body>
    </html>
  );
}