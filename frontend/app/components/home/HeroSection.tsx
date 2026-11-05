// frontend/components/HeroSection.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HeroSlide {
  id: number;
  title?: string | null;
  imageUrl: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
}

interface MatriculaConfig {
  year: string;
  badgeText: string;
  title: string;
  description: string;
  buttonText: string;
  linkUrl: string;
  isActive: boolean;
}

export default function HeroSection() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matriculaConfig, setMatriculaConfig] = useState<MatriculaConfig | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [heroRes, configRes] = await Promise.all([
          fetch("http://localhost:4000/api/hero", { cache: 'no-store' }),
          fetch("http://localhost:4000/api/admision-config", { cache: 'no-store' })
        ]);

        if (heroRes.ok) {
          const heroData = await heroRes.json();
          if (isMounted && Array.isArray(heroData)) {
            const activeSlides = heroData
              .filter((item: HeroSlide) => item.isActive && item.isFeatured)
              .sort((a, b) => a.order - b.order);
            setSlides(activeSlides);
          }
        }

        if (configRes.ok) {
          const configData = await configRes.json();
          if (isMounted && configData) {
            setMatriculaConfig(configData);
          }
        }
      } catch (error) {
        console.error("Error al conectar con el backend:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const nextSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (slides.length <= 1) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [slides.length, currentSlide, nextSlide]);

  if (loading) {
    return (
      <section className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[80vh] flex items-center justify-center bg-[#16275D]">
        <div className="w-8 h-8 border-4 border-[#F8DE32] border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative w-full h-[45vh] flex items-center justify-center bg-[#16275D] text-white">
        <p className="text-slate-300 text-sm font-medium">No hay banners activos configurados en el panel.</p>
      </section>
    );
  }

  return (
    <section className="relative w-full h-[62vh] sm:h-[72vh] lg:h-[80vh] flex items-center justify-center overflow-hidden bg-[#16275D]">
      
      {/* Carrusel dinámico de Imágenes con Fade limpio */}
      <div className="absolute inset-0 z-0 w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
           <Image
            src={slide.imageUrl.startsWith("http") ? slide.imageUrl : `http://localhost:4000${slide.imageUrl}`}
            alt={slide.title || "Banner Colegio Cayros"}
            fill
            sizes="100vw"
            priority={index === 0}
            className="object-cover object-center"
           />
            <div className="absolute inset-0 bg-gradient-to-t from-[#16275D]/80 via-[#16275D]/20 to-black/30 z-10" />
          </div>
        ))}
      </div>

      {/* Botones de Navegación Lateral (Solo en pantallas medianas y grandes) */}
      {slides.length > 1 && (
        <>
          <button 
            onClick={() => prevSlide()}
            className="hidden sm:flex w-10 h-10 lg:w-11 lg:h-11 items-center justify-center rounded-full bg-black/30 hover:bg-[#F8DE32] text-white hover:text-[#16275D] backdrop-blur-md transition-all duration-300 absolute left-3 lg:left-8 top-1/2 -translate-y-1/2 z-30 cursor-pointer border border-white/20 shadow-lg group"
            aria-label="Anterior"
          >
            <svg className="w-5 h-5 transform transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button 
            onClick={() => nextSlide()}
            className="hidden sm:flex w-10 h-10 lg:w-11 lg:h-11 items-center justify-center rounded-full bg-black/30 hover:bg-[#F8DE32] text-white hover:text-[#16275D] backdrop-blur-md transition-all duration-300 absolute right-3 lg:right-8 top-1/2 -translate-y-1/2 z-30 cursor-pointer border border-white/20 shadow-lg group"
            aria-label="Siguiente"
          >
            <svg className="w-5 h-5 transform transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* CARTEL DE ADMISIÓN MINIMALISTA Y RESPONSIVO */}
      {matriculaConfig && matriculaConfig.isActive && (
        <div className="absolute inset-x-4 sm:inset-x-auto sm:left-8 lg:left-16 xl:left-24 bottom-10 sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2 z-30 flex justify-center sm:justify-start">
          <Link 
            href={matriculaConfig.linkUrl || "/matricula"}
            className="w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[400px] bg-white/90 hover:bg-white text-[#16275D] border border-white/50 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer"
          >
            {/* Header del Cartel */}
            <div className="flex items-center justify-between mb-2 sm:mb-3 pb-2 border-b border-slate-200/60">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
                {matriculaConfig.badgeText || "Admisión"}
              </span>
              <span className="bg-[#16275D] text-[#F8DE32] text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-md shadow-sm">
                {matriculaConfig.year || "2026"}
              </span>
            </div>

            {/* Título Principal */}
            <h3 className="text-base sm:text-xl lg:text-2xl font-black tracking-tight text-[#16275D] mb-1 sm:mb-2 group-hover:text-blue-900 transition-colors">
              {matriculaConfig.title}
            </h3>
            
            {/* Descripción (Oculta o ultra-corta en móvil pequeño) */}
            <p className="text-[11px] sm:text-xs text-slate-600 font-medium leading-relaxed mb-3 line-clamp-2">
              {matriculaConfig.description}
            </p>

            {/* Botón de Acción */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
              <span className="text-[11px] sm:text-xs font-bold text-[#16275D] group-hover:text-amber-600 transition-colors">
                {matriculaConfig.buttonText || "Ver pasos y requisitos"}
              </span>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#16275D]/10 group-hover:bg-[#16275D] group-hover:text-white flex items-center justify-center transition-all duration-300 shrink-0">
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 transform transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Indicadores de Progreso Animados (Dots Inferiores) */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 sm:bottom-5 left-0 right-0 z-30 flex items-center justify-center space-x-2">
          {slides.map((_, index) => {
            const isActive = index === currentSlide;
            return (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className="relative h-1.5 sm:h-2 rounded-full overflow-hidden bg-white/40 hover:bg-white/60 transition-all duration-300 cursor-pointer"
                style={{ width: isActive ? '32px' : '8px' }}
                aria-label={`Ir a diapositiva ${index + 1}`}
              >
                {isActive && (
                  <span 
                    key={currentSlide}
                    className="absolute inset-0 bg-[#F8DE32] shadow-[0_0_8px_rgba(248,222,50,0.8)] origin-left animate-progress"
                    style={{ animationDuration: '5s', animationTimingFunction: 'linear' }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      <style jsx>{`
        @keyframes progress {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        .animate-progress {
          animation-name: progress;
          animation-fill-mode: forwards;
        }
      `}</style>

    </section>
  );
}