"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1920&auto=format&fit=crop",
    title: "Colegio \"CAYROS\"",
    subtitle: "Inicial - Primaria - Secundaria",
    quote: "“Ven y estudia con los mejores...”"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1920&auto=format&fit=crop",
    title: "Formación Integral",
    subtitle: "Excelencia académica y valores",
    quote: "“Generando un liderazgo transformacional”"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1920&auto=format&fit=crop",
    title: "Infraestructura Moderna",
    subtitle: "Espacios diseñados para el aprendizaje",
    quote: "“Tecnología y confort para nuestros alumnos”"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1920&auto=format&fit=crop",
    title: "Actividades y Desarrollo",
    subtitle: "Potenciando talentos y habilidades",
    quote: "“Construyendo el futuro de Chincha”"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1920&auto=format&fit=crop",
    title: "Compromiso Educativo",
    subtitle: "Docentes altamente calificados",
    quote: "“Guiando cada paso hacia el éxito”"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1920&auto=format&fit=crop",
    title: "Comunidad CAYROS",
    subtitle: "Unidos por la educación del mañana",
    quote: "“Familia y colegio trabajando juntos”"
  }
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Temporizador inteligente: se reinicia cada vez que currentSlide cambia
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative bg-[#111c38] text-white min-h-[85vh] flex flex-col justify-between items-center overflow-hidden py-12 px-4 shadow-xl">
      
      {/* 1. Carrusel de Imágenes de Fondo (Efecto Fade limpio sin saltos de zoom) */}
      <div className="absolute inset-0 z-0 w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              sizes="100vw"
              priority={index === 0}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111c38] via-[#111c38]/70 to-black/50 z-10" />
          </div>
        ))}
      </div>

      {/* 2. Botones de Navegación Modernos (Flechas flotantes con hover negro/amarillo) */}
      <button 
        onClick={prevSlide}
        className="w-14 h-14 flex items-center justify-center rounded-full transition-all duration-300 ease-in-out group cursor-pointer hover:bg-yellow-400 absolute left-6 top-1/2 -translate-y-1/2 z-20"
        aria-label="Anterior"
      >
        <svg className="w-7 h-7 stroke-[2.5] text-white/80 group-hover:text-[#111c38] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button 
        onClick={nextSlide}
        className="w-14 h-14 flex items-center justify-center rounded-full transition-all duration-300 ease-in-out group cursor-pointer hover:bg-yellow-400 absolute right-6 top-1/2 -translate-y-1/2 z-20"
        aria-label="Siguiente"
      >
        <svg className="w-7 h-7 stroke-[2.5] text-white/80 group-hover:text-[#111c38] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* 3. Contenido Dinámico */}
      <div className="relative z-20 text-center max-w-3xl mx-auto mt-8 transition-all duration-500 transform translate-y-0">
        <h1 className="text-3xl sm:text-6xl font-extrabold text-yellow-400 tracking-wide mb-3 drop-shadow-lg">
          {slides[currentSlide].title}
        </h1>
        <p className="text-gray-100 text-lg sm:text-xl font-semibold tracking-wider mb-3 drop-shadow">
          {slides[currentSlide].subtitle}
        </p>
        <p className="text-xl sm:text-2xl italic font-light text-yellow-200 tracking-wide drop-shadow">
          {slides[currentSlide].quote}
        </p>
      </div>

      {/* 4. Llamado a la Acción */}
      <div className="relative z-20 text-center max-w-xl mx-auto my-6 flex flex-col items-center">
        <div className="inline-block bg-yellow-400 text-[#111c38] font-bold text-xs sm:text-sm px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider shadow-md">
          BRINDAMOS FORMACIÓN INTEGRAL
        </div>

        <p className="text-gray-200 text-base sm:text-lg font-light mb-6 px-4 drop-shadow">
          Generando un liderazgo transformacional, que le facilite su proyecto de desarrollo personal.
        </p>

        <a
          href="#contacto"
          className="bg-yellow-400 hover:bg-yellow-300 text-[#111c38] font-bold px-8 py-3.5 rounded-lg shadow-xl transition-all transform hover:-translate-y-1 text-sm uppercase tracking-wider"
        >
          Contáctanos
        </a>
      </div>

      {/* 5. Dots Inferiores */}
      <div className="relative z-20 flex items-center justify-center space-x-3 mb-6">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              index === currentSlide 
                ? 'w-8 h-3 bg-yellow-400 shadow-md' 
                : 'w-3 h-3 bg-white/50 hover:bg-white'
            }`}
            aria-label={`Ir a diapositiva ${index + 1}`}
          />
        ))}
      </div>

    </section>
  );
}