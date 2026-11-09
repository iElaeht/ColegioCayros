// frontend/app/nosotros/objetivos/components/ObjetivoCard.tsx
"use client";

interface Objetivo {
  id: string;
  accent: "red" | "blue" | "yellow";
  texto: string;
}

const ACCENT_CLASSES: Record<Objetivo["accent"], string> = {
  red: "bg-red-500",
  blue: "bg-sky-400",
  yellow: "bg-amber-400",
};

interface ObjetivoCardProps {
  objetivo: Objetivo;
  isActive: boolean;
  onFocus: () => void;
  onBlur: () => void;
}

export default function ObjetivoCard({
  objetivo,
  isActive,
  onFocus,
  onBlur,
}: ObjetivoCardProps) {
  return (
    <div
      tabIndex={0}
      onMouseEnter={onFocus}
      onMouseLeave={onBlur}
      onFocus={onFocus}
      onBlur={onBlur}
      className={`group flex items-start gap-3.5 rounded-2xl p-4 sm:p-5 outline-none transition-all duration-300 border ${
        isActive 
          ? "bg-white border-slate-200/90 shadow-md -translate-y-0.5" 
          : "bg-white/60 border-slate-100 hover:border-slate-200 hover:bg-white shadow-xs"
      }`}
    >
      <span
        aria-hidden="true"
        className={`mt-2 h-2.5 w-2.5 flex-shrink-0 rounded-full transition-transform duration-300 ${
          ACCENT_CLASSES[objetivo.accent]
        } ${isActive ? "scale-125 ring-4 ring-slate-100" : "scale-100"}`}
      />
      <p className="text-xs sm:text-sm leading-relaxed text-slate-700 font-medium">
        {objetivo.texto}
      </p>
    </div>
  );
}