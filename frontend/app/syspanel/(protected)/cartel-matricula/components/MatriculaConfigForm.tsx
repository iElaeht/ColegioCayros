"use client";

import React from "react";
import MatriculaPreviewCard from "./MatriculaPreviewCard";

export interface MatriculaConfig {
  year: string;
  badgeText: string;
  title: string;
  description: string;
  buttonText: string;
  linkUrl: string;
  isActive: boolean;
}

interface MatriculaConfigFormProps {
  form: MatriculaConfig;
  hasChanges: boolean;
  saving: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onUndo: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function MatriculaConfigForm({
  form,
  hasChanges,
  saving,
  onChange,
  onUndo,
  onSubmit,
}: MatriculaConfigFormProps) {
  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-start select-none">
      <form
        onSubmit={onSubmit}
        className="lg:col-span-7 bg-white border border-slate-200/85 p-6 sm:p-8 rounded-3xl shadow-sm space-y-5"
      >
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
              onChange={onChange}
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
              onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#16275d] focus:ring-2 focus:ring-[#16275d]/10 transition-all shadow-xs"
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div>
            <span className="block text-xs font-bold text-[#16275d]">Estado del Cartel</span>
            <span className="text-[11px] text-slate-500 font-medium">
              Mostrar u ocultar en la página web.
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={onChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16275d] border border-slate-300 shadow-inner" />
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
            {saving ? "Guardando cambios..." : "Guardar Cambios"}
          </button>

          <button
            type="button"
            onClick={onUndo}
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
  );
}