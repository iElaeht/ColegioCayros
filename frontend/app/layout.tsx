import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

// Cargamos Open Sans usando el optimizador de fuentes nativo de Next.js
const openSans = Open_Sans({ 
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Colegio Cayros - Sistema de Gestión Institucional",
  description: "Portal institucional y académico de la I.E.P. Cayros",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${openSans.className} bg-gray-50 text-gray-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}