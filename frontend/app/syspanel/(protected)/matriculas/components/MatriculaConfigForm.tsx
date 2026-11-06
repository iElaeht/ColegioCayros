// frontend/app/syspanel/matriculas/components/MatriculaConfigForm.tsx
"use client";

import React, { useState, useEffect } from 'react';
import MatriculaPreviewCard from './MatriculaPreviewCard';
import ToastAlertMatricula from './ToastAlertMatricula';
import MatriculaGalleryConfig from './MatriculaGalleryConfig'; 

interface MatriculaConfig {
  year: string;
  badgeText: string;
  title: string;
  description: string;
  buttonText: string;
  linkUrl: string;
  isActive: boolean;
}

const defaultConfig: MatriculaConfig = {
  year: "2026",
  badgeText: "MATRÍCULAS",
  title: "MATRÍCULAS ABIERTAS",
  description: "Quiero empezar la matrícula y conocer los requisitos del proceso.",
  buttonText: "Ver pasos y requisitos",
  linkUrl: "/matricula",
  isActive: true,
};

export default function MatriculaConfigForm() {
  const [form, setForm] = useState<MatriculaConfig>(defaultConfig);
  const [initialForm, setInitialForm] = useState<MatriculaConfig>(defaultConfig);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Estado para el Toast flotante arriba a la derecha
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/admision-config");
        if (res.ok) {
          const data = await res.json();
          const loadedConfig: MatriculaConfig = {
            year: data.year || "2026",
            badgeText: data.badgeText || "MATRÍCULAS",
            title: data.title || "MATRÍCULAS ABIERTAS",
            description: data.description || "",
            buttonText: data.buttonText || "Ver pasos y requisitos",
            linkUrl: data.linkUrl || "/matricula",
            isActive: data.isActive ?? true,
          };
          setForm(loadedConfig);
          setInitialForm(loadedConfig);
        }
      } catch (error) {
        console.error("Error al cargar configuración de matrícula:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const hasChanges = JSON.stringify(form) !== JSON.stringify(initialForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUndo = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    setForm(initialForm);
    setToast(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setToast(null);

    try {
      const res = await fetch("http://localhost:4000/api/admision-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error al guardar la configuración");

      setInitialForm(form);
      setToast({ message: '¡Configuración actualizada con éxito!', type: 'success' });
    } catch (error) {
      console.error(error);
      setToast({ message: 'Hubo un error al guardar los cambios.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-slate-600 text-sm p-6 select-none">Cargando configuración...</div>;
  }

  return (
    <div className="space-y-10 select-none">
      {/* SECCIÓN SUPERIOR: Configuración del Cartel + Vista Previa */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white border border-slate-200/85 p-6 sm:p-8 rounded-3xl shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-[#16275d] tracking-tight">
              Configuración del Cartel
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Personaliza los textos del banner informativo de la web principal.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Año de Campaña
              </label>
              <input 
                type="text" 
                name="year" 
                value={form.year} 
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#16275d] focus:ring-2 focus:ring-[#16275d]/10 transition-all shadow-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Etiqueta (Badge)
              </label>
              <input 
                type="text" 
                name="badgeText" 
                value={form.badgeText} 
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#16275d] focus:ring-2 focus:ring-[#16275d]/10 transition-all shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Título Principal
            </label>
            <input 
              type="text" 
              name="title" 
              value={form.title} 
              onChange={handleChange}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#16275d] focus:ring-2 focus:ring-[#16275d]/10 transition-all shadow-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Descripción Corta
            </label>
            <textarea 
              name="description" 
              rows={3}
              value={form.description} 
              onChange={handleChange}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#16275d] focus:ring-2 focus:ring-[#16275d]/10 transition-all shadow-xs resize-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Texto del Botón
            </label>
            <input 
              type="text" 
              name="buttonText" 
              value={form.buttonText} 
              onChange={handleChange}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#16275d] focus:ring-2 focus:ring-[#16275d]/10 transition-all shadow-xs"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div>
              <span className="block text-xs font-bold text-[#16275d]">Estado del Cartel</span>
              <span className="text-[11px] text-slate-500 font-medium">Mostrar u ocultar en la página web.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="isActive" 
                checked={form.isActive} 
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16275d] border border-slate-300 shadow-inner"></div>
            </label>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving || !hasChanges}
              className={`flex-1 text-xs font-bold py-3 px-4 rounded-xl transition-all shadow-sm cursor-pointer outline-none ${
                hasChanges && !saving
                  ? "bg-[#16275d] hover:bg-[#111c38] text-amber-400 border border-[#16275d]"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border border-transparent"
              }`}
            >
              {saving ? 'Guardando cambios...' : 'Guardar Cambios'}
            </button>

            <button
              type="button"
              onClick={handleUndo}
              disabled={!hasChanges || saving}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all border border-slate-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed outline-none"
              title="Deshacer cambios no guardados"
            >
              Deshacer
            </button>
          </div>
        </form>

        <div className="lg:col-span-5 sticky top-6">
          <MatriculaPreviewCard {...form} />
        </div>
      </div>

      {/* SECCIÓN INFERIOR: Configuración de la Galería del Carrusel */}
      <div className="pt-6 border-t border-slate-200/80">
        <MatriculaGalleryConfig />
      </div>

      {/* Notificación Toast flotante */}
      {toast && (
        <ToastAlertMatricula 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}