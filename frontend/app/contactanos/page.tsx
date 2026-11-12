// frontend/app/contactanos/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import { MessageSquare, Mail, Phone, MapPin, Send, ArrowLeft } from "lucide-react";

export default function ContactanosPage() {
  const [formData, setFormData] = useState({
    dni: "",
    nombre: "",
    telefono: "",
    asunto: "",
  });

  const [errors, setErrors] = useState({ dni: "", telefono: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    document.title = "Contáctanos | Colegio Cayros";
  }, []);

  const validate = (name: string, value: string) => {
    let error = "";
    if (name === "dni" && value.length > 0 && (value.length !== 8 || !/^\d+$/.test(value))) {
      error = "El DNI debe tener 8 dígitos.";
    }
    if (name === "telefono" && value.length > 0 && (value.length !== 9 || !/^\d+$/.test(value))) {
      error = "El teléfono debe tener 9 dígitos.";
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if ((name === "dni" || name === "telefono") && !/^\d*$/.test(value)) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
    validate(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (errors.dni || errors.telefono) return;

    setStatus("loading");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/mensajes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error();

      setStatus("success");
      setFormData({ dni: "", nombre: "", telefono: "", asunto: "" });
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const socialLinks = [
    { name: "Facebook", href: "https://facebook.com", path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
    { name: "YouTube", href: "https://www.youtube.com/@ColegioCayrosOficial", path: "M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" },
    { name: "Instagram", href: "https://instagram.com", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
    { name: "TikTok", href: "https://www.tiktok.com/@i.e.p.cayros", path: "M19.589 6.686a4.793 4.793 0 0 1-3.77-4.242V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002-.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.836 4.836 0 0 1-1.003-.104z" },
    { name: "WhatsApp", href: "https://api.whatsapp.com/send?phone=51956411538", path: "M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.124-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 select-none">
      <Navbar />

      <main className="flex-grow py-12 sm:py-20 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-10">
          
          {/* Botón Volver alineado perfectamente al margen izquierdo */}
          <div className="w-full flex justify-start">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#16275d] hover:text-amber-600 py-1.5 transition-all duration-300 group outline-none"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Volver al inicio</span>
            </Link>
          </div>

          <div className="text-center max-w-3xl mx-auto space-y-4 flex flex-col items-center">
            
            <div className="inline-flex items-center gap-2.5 text-[#16275d] text-sm sm:text-base font-extrabold uppercase tracking-[0.25em]">
              <MessageSquare className="w-5 h-5 text-amber-500" />
              Canal de Comunicación
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111c38] font-['Poppins',sans-serif]">
              Contáctanos
            </h1>
            
            <p className="text-gray-600 text-sm sm:text-base font-['Open_Sans',sans-serif] leading-relaxed max-w-2xl mx-auto">
              ¿Tienes alguna consulta o deseas más información sobre nuestra institución y procesos de admisión? Escríbenos y nos pondremos en contacto contigo a la brevedad.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
            
            <div className="lg:col-span-5 bg-white border border-gray-200/80 p-8 rounded-3xl shadow-sm space-y-8">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md mb-2 inline-block">
                  Información Institucional
                </span>
                <h3 className="text-xl font-bold text-[#111c38] font-['Poppins',sans-serif]">
                  Estamos para ayudarte
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm font-['Open_Sans',sans-serif] mt-2 leading-relaxed">
                  Comunícate directamente a través de nuestros canales oficiales o síguenos en nuestras redes sociales.
                </p>
              </div>

              <div className="space-y-4 border-t border-gray-100 pt-6 text-xs sm:text-sm text-gray-600 font-['Open_Sans',sans-serif]">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-gray-50 text-[#16275d] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <strong className="text-[#111c38] block font-semibold">Ubicación Principal:</strong>
                    <span>Av. José Carlos Mariátegui Lt 01, Grocio Prado, Chincha</span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-gray-50 text-[#16275d] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <strong className="text-[#111c38] block font-semibold">Teléfono:</strong>
                    <span>(+51) 956 411 538</span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-gray-50 text-[#16275d] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <strong className="text-[#111c38] block font-semibold">Correo Electrónico:</strong>
                    <span>promotoria@colegiocayros.edu.pe</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <span className="text-xs font-bold text-[#111c38] uppercase tracking-wider block mb-3">
                  Síguenos en Redes
                </span>
                <div className="flex items-center gap-2.5">
                  {socialLinks.map((social) => (
                    <a 
                      key={social.name} 
                      href={social.href} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-10 h-10 rounded-2xl bg-gray-50 hover:bg-amber-400 text-[#111c38] flex items-center justify-center transition-all duration-300 shadow-xs hover:-translate-y-0.5"
                      title={social.name}
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d={social.path}/></svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white border border-gray-200/80 p-8 sm:p-10 rounded-3xl shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#111c38]">DNI</label>
                  <input 
                    type="text" 
                    name="dni" 
                    inputMode="numeric" 
                    maxLength={8} 
                    value={formData.dni} 
                    onChange={handleChange} 
                    placeholder="Ingresa tu DNI" 
                    required 
                    className="w-full bg-gray-50/50 text-sm px-4 py-3 rounded-xl border border-gray-200 focus:border-[#16275d] focus:bg-white outline-none transition-all font-['Open_Sans',sans-serif]" 
                  />
                  {errors.dni && <p className="text-red-600 text-xs font-semibold mt-1">{errors.dni}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#111c38]">Nombres y Apellidos</label>
                  <input 
                    type="text" 
                    name="nombre" 
                    placeholder="Ejem: Juan Pérez" 
                    value={formData.nombre} 
                    onChange={handleChange} 
                    required 
                    className="w-full bg-gray-50/50 text-sm px-4 py-3 rounded-xl border border-gray-200 focus:border-[#16275d] focus:bg-white outline-none transition-all font-['Open_Sans',sans-serif]" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#111c38]">Teléfono / Celular</label>
                  <input 
                    type="tel" 
                    name="telefono" 
                    inputMode="numeric" 
                    maxLength={9} 
                    placeholder="Ejem: 999555000" 
                    value={formData.telefono} 
                    onChange={handleChange} 
                    required 
                    className="w-full bg-gray-50/50 text-sm px-4 py-3 rounded-xl border border-gray-200 focus:border-[#16275d] focus:bg-white outline-none transition-all font-['Open_Sans',sans-serif]" 
                  />
                  {errors.telefono && <p className="text-red-600 text-xs font-semibold mt-1">{errors.telefono}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#111c38]">Asunto / Mensaje</label>
                  <textarea 
                    name="asunto" 
                    rows={4} 
                    placeholder="Escribe el motivo de tu consulta..." 
                    value={formData.asunto} 
                    onChange={handleChange} 
                    required 
                    className="w-full bg-gray-50/50 text-sm px-4 py-3 rounded-xl border border-gray-200 focus:border-[#16275d] focus:bg-white outline-none resize-none transition-all font-['Open_Sans',sans-serif]" 
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    {status === "success" && (
                      <p className="text-green-600 text-xs font-bold animate-pulse">
                        ¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.
                      </p>
                    )}
                    {status === "error" && (
                      <p className="text-red-600 text-xs font-bold">
                        Error al enviar el mensaje. Inténtalo de nuevo.
                      </p>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    disabled={status === "loading" || !!errors.dni || !!errors.telefono} 
                    className="w-full sm:w-auto px-8 py-3.5 bg-amber-400 hover:bg-amber-500 text-[#111c38] text-xs sm:text-sm font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    {status === "loading" ? (
                      <svg className="animate-spin h-4 w-4 text-[#111c38]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>{status === "loading" ? "Enviando mensaje..." : "Enviar Mensaje"}</span>
                  </button>
                </div>

              </form>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}