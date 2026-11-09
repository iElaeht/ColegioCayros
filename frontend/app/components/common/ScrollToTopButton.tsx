// frontend/app/components/common/ScrollToTopButton.tsx
"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#16275d] hover:bg-[#111c38] text-amber-400 shadow-xl border border-white/20 flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 cursor-pointer outline-none group"
      aria-label="Volver arriba"
    >
      <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] transition-transform group-hover:-translate-y-0.5" />
    </button>
  );
}