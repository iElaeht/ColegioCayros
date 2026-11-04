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

  // Estado para la configuración dinámica del cartel de admisiones
  const [matriculaConfig, setMatriculaConfig] = useState<MatriculaConfig | null>(null);

  // Referencia para controlar el temporizador y poder reiniciarlo al hacer clic
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Cargar los banners activos y la configuración del cartel en paralelo sin caché
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

  // Función para avanzar a la siguiente diapositiva
  const nextSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // 2. Temporizador inteligente que se reinicia cada vez que cambia el slide
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

  const handleManualNext = () => nextSlide();
  const handleManualPrev = () => prevSlide();
  const handleDotClick = (index: number) => setCurrentSlide(index);

  // Si está cargando
  if (loading) {
    return (
      <section className="relative w-full h-[55vh] sm:h-[65vh] lg:h-[70vh] flex items-center justify-center bg-[#16275D]">
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
    <section className="relative w-full h-[55vh] sm:h-[65vh] lg:h-[70vh] flex items-center justify-center overflow-hidden bg-[#16275D]">
      
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
            <div className="absolute inset-0 bg-[#16275D]/30 z-10" />
          </div>
        ))}
      </div>

      {/* Botones de Navegación Lateral */}
      {slides.length > 1 && (
        <>
          <button 
            onClick={handleManualPrev}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-black/50 hover:bg-[#F8DE32] text-white hover:text-[#16275D] backdrop-blur-md transition-all duration-300 absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 cursor-pointer shadow-lg border border-white/20 group"
            aria-label="Anterior"
          >
            <svg className="w-5 h-5 transform transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button 
            onClick={handleManualNext}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-black/50 hover:bg-[#F8DE32] text-white hover:text-[#16275D] backdrop-blur-md transition-all duration-300 absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 cursor-pointer shadow-lg border border-white/20 group"
            aria-label="Siguiente"
          >
            <svg className="w-5 h-5 transform transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* CARTEL DE ADMISIÓN DINÁMICO (Más alto con py-8/py-10 y ligeramente más abajo con top-[53%]) */}
      {matriculaConfig && matriculaConfig.isActive && (
        <Link 
          href={matriculaConfig.linkUrl || "/matricula"}
          className="absolute left-16 sm:left-24 lg:left-28 top-[53%] -translate-y-1/2 z-30 bg-white/95 hover:bg-white text-[#16275D] border border-slate-200 backdrop-blur-xl py-8 sm:py-10 px-7 sm:px-9 rounded-2xl shadow-2xl transition-all duration-300 transform hover:-translate-y-[calc(50%+4px)] flex flex-col justify-between w-[340px] sm:w-[410px] lg:w-[440px] group cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                {matriculaConfig.badgeText || "Admisión"}
              </span>
              <span className="bg-[#16275D] text-[#F8DE32] text-xs sm:text-sm font-black px-3 py-1 rounded-lg shadow-sm">
                {matriculaConfig.year || "2026"}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#16275D] mb-2 sm:mb-3 group-hover:text-blue-900 transition-colors">
              {matriculaConfig.title}
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mb-6">
              {matriculaConfig.description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="text-xs sm:text-sm font-bold text-[#16275D] group-hover:text-amber-600 transition-colors">
              {matriculaConfig.buttonText || "Ver pasos y requisitos"}
            </span>
            <div className="w-8 h-8 rounded-full bg-[#16275D]/5 group-hover:bg-[#16275D] group-hover:text-white flex items-center justify-center transition-all duration-300">
              <svg className="w-4 h-4 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      )}

      {/* Indicadores de Progreso Animados */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-0 right-0 z-30 flex items-center justify-center space-x-3">
          {slides.map((_, index) => {
            const isActive = index === currentSlide;
            return (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className="relative h-2 rounded-full overflow-hidden bg-white/30 hover:bg-white/50 transition-all duration-300 cursor-pointer"
                style={{ width: isActive ? '42px' : '12px' }}
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