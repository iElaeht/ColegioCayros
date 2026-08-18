"use client";

import React, { useState } from 'react';

export default function ContactSchool() {
  const [formData, setFormData] = useState({
    dni: '',
    nombre: '',
    telefono: '',
    asunto: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="Contáctanos" className="py-40 px-6 bg-white text-[#111c38] select-none font-['Poppins',sans-serif]">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        
        {/* Columna Izquierda: Título y Descripción Justificada */}
        <div className="flex flex-col items-start pt-1">
          <div className="max-w-xs">
            <h1 className="text-lg font-extrabold uppercase tracking-wider text-[#111c38] m-0 mb-4 flex items-center space-x-2">
              <span className="w-2 h-2 bg-yellow-400 shrink-0 inline-block"></span>
              <span>CONTÁCTANOS</span>
            </h1>
            <p className="text-[#111c38]/70 text-sm leading-relaxed text-justify font-['Open_Sans',sans-serif]">
              ¿Tienes alguna consulta o deseas más información sobre nuestra institución y procesos de admisión? Escríbenos y nos pondremos en contacto contigo a la brevedad.
            </p>
          </div>
        </div>

        {/* Columna Derecha: Formulario */}
        <div className="bg-white">
          <div className="w-full">
            <form onSubmit={handleSubmit} className="space-y-9">
              
              {/* Campo DNI */}
              <div className="relative group">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111c38]/60 mb-1">
                  DNI
                </label>
                <input 
                  type="text" 
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent text-[#111c38] text-sm py-2 border-b border-slate-400 outline-none transition-colors duration-300 font-['Open_Sans',sans-serif]"
                />
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#111c38] transition-all duration-300 group-focus-within:w-full"></span>
              </div>

              {/* Campo Nombres y Apellidos */}
              <div className="relative group">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111c38]/60 mb-1">
                  NOMBRES Y APELLIDOS
                </label>
                <input 
                  type="text" 
                  name="nombre"
                  placeholder="Ejem: Juan Perez"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent text-[#111c38] placeholder:text-slate-400 text-sm py-2 border-b border-slate-400 outline-none transition-colors duration-300 font-['Open_Sans',sans-serif]"
                />
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#111c38] transition-all duration-300 group-focus-within:w-full"></span>
              </div>

              {/* Campo Teléfono / Celular */}
              <div className="relative group">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111c38]/60 mb-1">
                  TELÉFONO / CELULAR
                </label>
                <input 
                  type="tel" 
                  name="telefono"
                  placeholder="Ejem: 999 555 000"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent text-[#111c38] placeholder:text-slate-400 text-sm py-2 border-b border-slate-400 outline-none transition-colors duration-300 font-['Open_Sans',sans-serif]"
                />
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#111c38] transition-all duration-300 group-focus-within:w-full"></span>
              </div>

              {/* Campo Asunto */}
              <div className="relative group">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111c38]/60 mb-1">
                  ASUNTO
                </label>
                <textarea 
                  name="asunto"
                  rows={4}
                  placeholder="Motivo del mensaje"
                  value={formData.asunto}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent text-[#111c38] placeholder:text-slate-400 text-sm py-2 border-b border-slate-400 outline-none resize-y block font-['Open_Sans',sans-serif]"
                />
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#111c38] transition-all duration-300 group-focus-within:w-full"></span>
              </div>

              {/* Botón de Enviar Alineado a la Derecha */}
              <div className="pt-2 flex items-center justify-end gap-4">
                {submitted && (
                  <p className="text-green-600 text-xs font-semibold animate-fade-in font-['Open_Sans',sans-serif]">
                    ¡Enviado con éxito!
                  </p>
                )}
                <button 
                  type="submit"
                  className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-[#111c38] text-sm font-bold rounded-full shadow-md transition-all duration-300 cursor-pointer text-center"
                >
                  Enviar Mensaje
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </section>
  );
}