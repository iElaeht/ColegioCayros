// frontend/app/matricula/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import { CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

interface HeroSlide {
  id: number;
  imageUrl: string;
  title?: string | null;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
}

export default function MatriculaPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [formData, setFormData] = useState({
    nombresEstudiante: "",
    apellidosEstudiante: "",
    nivel: "Inicial",
    grado: "",
    nombresApoderado: "",
    telefono: "",
    email: "",
    mensaje: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/hero")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const activeSlides = data
            .filter((item: HeroSlide) => item.isActive)
            .slice(0, 6);
          setSlides(activeSlides);
        }
      })
      .catch((err) => console.error("Error al cargar carrusel:", err));
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    try {
      const res = await fetch("http://localhost:4000/api/matricula-inscripcion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        setToast({ type: "success", message: "¡Inscripción enviada con éxito! Nos comunicaremos contigo pronto." });
        setFormData({
          nombresEstudiante: "",
          apellidosEstudiante: "",
          nivel: "Inicial",
          grado: "",
          nombresApoderado: "",
          telefono: "",
          email: "",
          mensaje: "",
        });
      } else {
        setToast({ type: "error", message: result.error || "Ocurrió un error al enviar el formulario." });
      }
    } catch (error) {
      setToast({ type: "error", message: "Error de red al conectar con el servidor." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-['Poppins',sans-serif]">
      <Navbar />

      <main className="flex-grow pt-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Admisión Abierta 2027
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Proceso de Matrícula Institucional
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Forma parte de la gran familia del Colegio I.E.P Cayros. Completa tus datos o conoce nuestra propuesta formativa.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* LADO IZQUIERDO: Carrusel con diseño de marcos orgánicos y efecto mancha */}
            <div className="lg:col-span-6 relative">
              <div className="absolute -inset-2 bg-gradient-to-tr from-amber-400/20 via-blue-600/10 to-transparent rounded-[2.5rem] blur-xl -z-10 pointer-events-none" />

              <div className="relative aspect-[16/10] w-full bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                {slides.length > 0 ? (
                  slides.map((slide, index) => {
                    const resolvedImg = slide.imageUrl.startsWith("http")
                      ? slide.imageUrl
                      : `http://localhost:4000${slide.imageUrl}`;
                    return (
                      <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                          index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                        }`}
                      >
                        <Image
                          src={resolvedImg}
                          alt={slide.title || "Colegio Cayros Instalaciones"}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                          <p className="text-white text-sm sm:text-base font-semibold drop-shadow-md">
                            {slide.title || "Instalaciones y momentos en el Colegio Cayros"}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
                    Cargando galería institucional...
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-2 mt-4">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentSlide ? "w-8 bg-amber-500" : "w-2 bg-slate-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* LADO DERECHO: Formulario limpio con barra vertical en el título */}
            <div className="lg:col-span-6 bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
                <h2 className="text-xl font-bold text-slate-900">Formulario de Pre-Inscripción</h2>
              </div>
              <p className="text-xs text-slate-500 mb-6 pl-4">
                Déjanos tus datos y nos pondremos en contacto contigo a la brevedad.
              </p>

              {toast && (
                <div
                  className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-xs font-semibold ${
                    toast.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}
                >
                  {toast.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />}
                  <span>{toast.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Nombres del Estudiante</label>
                    <input
                      type="text"
                      name="nombresEstudiante"
                      value={formData.nombresEstudiante}
                      onChange={handleChange}
                      required
                      placeholder="Ej. Juan Carlos"
                      className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Apellidos del Estudiante</label>
                    <input
                      type="text"
                      name="apellidosEstudiante"
                      value={formData.apellidosEstudiante}
                      onChange={handleChange}
                      required
                      placeholder="Ej. Pérez Gómez"
                      className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Nivel de Estudio</label>
                    <select
                      name="nivel"
                      value={formData.nivel}
                      onChange={handleChange}
                      className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none font-medium"
                    >
                      <option value="Inicial">Inicial</option>
                      <option value="Primaria">Primaria</option>
                      <option value="Secundaria">Secundaria</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Grado al que postula</label>
                    <input
                      type="text"
                      name="grado"
                      value={formData.grado}
                      onChange={handleChange}
                      required
                      placeholder="Ej. 1er Grado"
                      className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Nombre del Padre / Apoderado</label>
                  <input
                    type="text"
                    name="nombresApoderado"
                    value={formData.nombresApoderado}
                    onChange={handleChange}
                    required
                    placeholder="Ej. María Gómez (Madre)"
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Teléfono / Celular</label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      required
                      placeholder="Ej. 987654321"
                      className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Correo Electrónico (Opcional)</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="correo@ejemplo.com"
                      className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Mensaje o Comentarios (Opcional)</label>
                  <textarea
                    name="mensaje"
                    rows={2}
                    value={formData.mensaje}
                    onChange={handleChange}
                    placeholder="¿Alguna consulta adicional sobre el proceso?"
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none font-medium resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-[#16275D] hover:bg-blue-900 text-white transition-all shadow-lg shadow-blue-900/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Enviar Solicitud de Matrícula</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>

          {/* PARTE INFERIOR: Banner Flotante Estilo Tarjeta (Misión, Visión, Propósito, Valores) */}
          <div className="mt-20">
            <div className="bg-[#16275D] text-white rounded-[2.5rem] shadow-2xl p-8 sm:p-12 border border-slate-700/30 relative overflow-hidden">
              
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 relative z-10">
                
                {/* 1. MISIÓN */}
                <div className="flex flex-col items-start text-left">
                  <div className="w-12 h-12 mb-4 text-[#F8DE32]">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 tracking-tight text-white">Misión</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    Formar estudiantes líderes con sólidos valores éticos y excelencia académica, potenciando sus habilidades críticas y creativas para afrontar los retos del futuro.
                  </p>
                </div>

                {/* 2. VISIÓN */}
                <div className="flex flex-col items-start text-left">
                  <div className="w-12 h-12 mb-4 text-[#F8DE32]">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 tracking-tight text-white">Visión</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    Ser reconocidos como una institución educacional referente en calidad e innovación pedagógica, donde cada alumno alcance su máximo potencial humano e intelectual.
                  </p>
                </div>

                {/* 3. PROPÓSITO */}
                <div className="flex flex-col items-start text-left">
                  <div className="w-12 h-12 mb-4 text-[#F8DE32]">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 tracking-tight text-white">Propósito</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    Brindar un entorno seguro, motivador y acogedor que inspire a nuestros niños y jóvenes a descubrir sus pasiones y lograr que cumplan sus sueños.
                  </p>
                </div>

                {/* 4. VALORES */}
                <div className="flex flex-col items-start text-left">
                  <div className="w-12 h-12 mb-4 text-[#F8DE32]">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.684a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 tracking-tight text-white">Valores</h3>
                  <ul className="text-xs sm:text-sm text-slate-300 space-y-1.5 font-normal">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F8DE32]" />
                      <span>Innovación constante</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F8DE32]" />
                      <span>Respeto y Empatía</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F8DE32]" />
                      <span>Solidaridad</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F8DE32]" />
                      <span>Integridad y Sinceridad</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}