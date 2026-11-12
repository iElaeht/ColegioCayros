// frontend/app/matricula/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import { CheckCircle2, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";

interface MatriculaImage {
  id: number;
  imageUrl: string;
  title?: string | null;
  isActive: boolean;
  order: number;
}

const GRADOS_POR_NIVEL: Record<string, string[]> = {
  Inicial: ["3 Años", "4 Años", "5 Años"],
  Primaria: ["1er Grado", "2do Grado", "3er Grado", "4to Grado", "5to Grado", "6to Grado"],
  Secundaria: ["1er Año", "2do Año", "3er Año", "4to Año", "5to Año"],
};

export default function MatriculaPage() {
  const [slides, setSlides] = useState<MatriculaImage[]>([]);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  const [formData, setFormData] = useState({
    sede: "",
    nombresEstudiante: "",
    apellidosEstudiante: "",
    dniEstudiante: "",
    nivel: "",
    grado: "",
    nombresApoderado: "",
    telefono: "",
    email: "",
    mensaje: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    document.title = "Matrículas | Colegio Cayros";
  }, []);

  useEffect(() => {
    fetch("http://localhost:4000/api/matricula-galeria")
      .then((res) => res.json())
      .then((data: MatriculaImage[]) => {
        if (Array.isArray(data)) {
          const activas = data.filter((item) => item.isActive);
          setSlides(activas.slice(0, 8));
        }
      })
      .catch((err: unknown) => console.error("Error al cargar galería de matrículas:", err));
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;

    const intervalTime = 50;
    const totalDuration = 5000;
    const increment = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((curr) => (curr + 1) % slides.length);
          return 0;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [slides.length]);

  const handleSelectSlide = (index: number): void => {
    setCurrentSlide(index);
    setProgress(0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;

    if (name === "sede") {
      setFormData({
        ...formData,
        sede: value,
        nivel: "",
        grado: "",
      });
    } else if (name === "nivel") {
      setFormData({
        ...formData,
        nivel: value,
        grado: "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleNumberInput = (e: React.FormEvent<HTMLInputElement>, maxLength: number): void => {
    const input = e.currentTarget;
    const numericValue = input.value.replace(/\D/g, "").slice(0, maxLength);
    setFormData({ ...formData, [input.name]: numericValue });
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    if (!formData.sede || !formData.nivel || !formData.grado) {
      setToast({ type: "error", message: "Por favor, selecciona la Sede, Nivel y Grado al que postula." });
      setLoading(false);
      return;
    }

    if (!/^\d{8}$/.test(formData.dniEstudiante)) {
      setToast({ type: "error", message: "El DNI del estudiante debe contener exactamente 8 dígitos." });
      setLoading(false);
      return;
    }

    if (!/^9\d{8}$/.test(formData.telefono)) {
      setToast({ type: "error", message: "El teléfono celular debe ser un número peruano válido de 9 dígitos." });
      setLoading(false);
      return;
    }

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
          sede: "",
          nombresEstudiante: "",
          apellidosEstudiante: "",
          dniEstudiante: "",
          nivel: "",
          grado: "",
          nombresApoderado: "",
          telefono: "",
          email: "",
          mensaje: "",
        });
      } else {
        setToast({ type: "error", message: result.error || "Ocurrió un error al enviar el formulario." });
      }
    } catch {
      setToast({ type: "error", message: "Error de red al conectar con el servidor." });
    } finally {
      setLoading(false);
    }
  };

  const nivelesDisponibles = formData.sede === "Cayros School" ? ["Inicial"] : formData.sede === "Colegio Cayros" ? ["Inicial", "Primaria", "Secundaria"] : [];
  const gradosActuales = formData.nivel ? GRADOS_POR_NIVEL[formData.nivel] || [] : [];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-['Poppins',sans-serif] select-none">
      <Navbar />

      <main className="flex-grow pt-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Botón Volver alineado a la izquierda de forma independiente */}
          <div className="w-full max-w-7xl mx-auto flex justify-start">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#16275d] hover:text-amber-600 px-2 py-1.5 transition-all duration-300 group outline-none"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Volver al inicio</span>
            </Link>
          </div>

          {/* Encabezado Principal Centrado */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Proceso de Matrícula Institucional
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">
              Forma parte de la gran familia de la I.E.P Colegio Cayros. Completa tus datos o conoce nuestra propuesta formativa.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
            
            <div className="lg:col-span-6 relative">
              <div className="absolute -inset-2 bg-gradient-to-tr from-amber-400/20 via-blue-600/10 to-transparent rounded-[2.5rem] blur-xl -z-10 pointer-events-none" />

              <div className="relative aspect-[16/10] w-full rounded-[2rem] overflow-hidden shadow-2xl bg-white transition-transform duration-300 hover:-translate-y-1">
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
                          alt={slide.title || "Colegio Cayros Matrículas"}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className="absolute inset-0 bg-blue-50/40 border-2 border-dashed border-indigo-400/60 rounded-[2rem] flex flex-col items-center justify-center p-6 text-indigo-500">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-100/80 flex items-center justify-center mb-2 shadow-sm">
                      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold tracking-wide text-indigo-600">No hay imágenes activas</span>
                  </div>
                )}
              </div>

              {slides.length > 0 && (
                <div className="flex justify-center items-center gap-2.5 mt-4">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSlide(idx)}
                      className={`h-2 rounded-full overflow-hidden bg-slate-300 transition-all duration-300 cursor-pointer relative ${
                        idx === currentSlide ? "w-10" : "w-2 hover:bg-slate-400"
                      }`}
                      title={`Ir a imagen ${idx + 1}`}
                    >
                      {idx === currentSlide && (
                        <div 
                          className="absolute top-0 left-0 bottom-0 bg-amber-500 transition-all duration-75 ease-linear"
                          style={{ width: `${progress}%` }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-6 bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
                <h2 className="text-xl font-bold text-slate-900">Formulario de Pre-Inscripción</h2>
              </div>
              <p className="text-xs text-slate-500 mb-6 pl-4">
                Déjanos tus datos y nos pondremos en contacto contigo a la brevedad.
              </p>

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
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">DNI del Estudiante</label>
                    <input
                      type="text"
                      name="dniEstudiante"
                      maxLength={8}
                      value={formData.dniEstudiante}
                      onChange={(e) => handleNumberInput(e, 8)}
                      required
                      placeholder="Ej. 74839201"
                      className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Sede de Postulación</label>
                    <select
                      name="sede"
                      value={formData.sede}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none font-medium cursor-pointer"
                    >
                      <option value="">Seleccionar Sede</option>
                      <option value="Colegio Cayros">Colegio Cayros</option>
                      <option value="Cayros School">Cayros School</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Nivel de Estudio</label>
                    <select
                      name="nivel"
                      value={formData.nivel}
                      onChange={handleChange}
                      disabled={!formData.sede}
                      required
                      className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none font-medium transition-all ${
                        !formData.sede
                          ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
                          : "bg-slate-50 text-slate-800 border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 cursor-pointer"
                      }`}
                    >
                      <option value="">Seleccionar Nivel</option>
                      {nivelesDisponibles.map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Grado al que postula</label>
                    <select
                      name="grado"
                      value={formData.grado}
                      onChange={handleChange}
                      disabled={!formData.nivel}
                      required
                      className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none font-medium transition-all ${
                        !formData.nivel
                          ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
                          : "bg-slate-50 text-slate-800 border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 cursor-pointer"
                      }`}
                    >
                      <option value="">Seleccionar Grado</option>
                      {gradosActuales.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Datos Completos del Apoderado</label>
                  <input
                    type="text"
                    name="nombresApoderado"
                    value={formData.nombresApoderado}
                    onChange={handleChange}
                    required
                    placeholder="Ej. María Gómez Martinez Muñoz"
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Teléfono / Celular</label>
                    <input
                      type="text"
                      name="telefono"
                      maxLength={9}
                      value={formData.telefono}
                      onChange={(e) => handleNumberInput(e, 9)}
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
                      placeholder="Ej. correo@ejemplo.com"
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
                    placeholder="Ej. Consulta sobre vacantes disponibles..."
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

                {toast && (
                  <div
                    className={`mt-4 p-4 rounded-xl flex items-center gap-3 text-xs font-semibold transition-all duration-300 ${
                      toast.type === "success" 
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
                        : "bg-rose-50 text-rose-800 border border-rose-200"
                    }`}
                  >
                    {toast.type === "success" ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                    <span>{toast.message}</span>
                  </div>
                )}

              </form>
            </div>

          </div>

          <div className="mt-20">
            <div className="bg-[#16275D] text-white rounded-[2.5rem] shadow-2xl p-8 sm:p-12 border border-slate-700/30 relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 relative z-10">
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