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
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const handleScroll = () => {
      document.body.classList.add("is-scrolling");

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

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
        <ScrollToTop />
        {children}
      </body>
    </html>
  );
}