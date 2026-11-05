// frontend/components/ui/LogoCayros.tsx
"use client";

import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export default function LogoCayros({ className = "w-12 h-12", size }: LogoProps) {
  return (
    <div 
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={size ? { width: `${size}px`, height: `${size}px` } : undefined}
    >
      <svg 
        viewBox="0 0 300 360" 
        width="100%" 
        height="100%" 
        className="drop-shadow-md select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Fondo del Escudo (Forma de Escudo Tradicional) */}
        <path 
          d="M 150 10 C 230 10 280 30 280 80 C 280 200 230 300 150 350 C 70 300 20 200 20 80 C 20 30 70 10 150 10 Z" 
          fill="#5bc0eb" 
          stroke="#facc15" 
          strokeWidth="12" 
        />

        {/* Texto superior: I.E.P. */}
        <text 
          x="150" 
          y="55" 
          fill="#b91c1c" 
          fontFamily="Arial, sans-serif" 
          fontWeight="bold" 
          fontSize="30" 
          textAnchor="middle"
          letterSpacing="3"
        >
          I.E.P.
        </text>

        {/* Texto principal: CAYROS */}
        <text 
          x="150" 
          y="105" 
          fill="#b91c1c" 
          fontFamily="Arial, sans-serif" 
          fontWeight="900" 
          fontSize="44" 
          textAnchor="middle"
          letterSpacing="4"
        >
          CAYROS
        </text>

        {/* Símbolo de la Paloma de la Paz */}
        <g transform="translate(150, 135) scale(0.9)">
          <path 
            d="M0 10 C-10 0 -25 -5 -40 -2 C-30 10 -15 15 0 25 C15 15 30 10 40 -2 C25 -5 10 0 0 10 Z" 
            fill="#ffffff" 
          />
          <circle cx="-2" cy="2" r="3" fill="#ffffff" />
        </g>

        {/* Libro Abierto */}
        <g transform="translate(150, 185)">
          {/* Páginas del libro */}
          <path d="M-55 -15 C-25 -25 0 -20 0 -30 C0 -20 25 -25 55 -15 L55 25 C25 15 0 20 0 10 C0 20 -25 15 -55 25 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
          {/* Línea central del lomo */}
          <line x1="0" y1="-30" x2="0" y2="10" stroke="#94a3b8" strokeWidth="2" />
        </g>

        {/* Ramas de olivo / laurel laterales */}
        <g fill="#15803d">
          {/* Rama izquierda */}
          <path d="M70 260 C60 230 75 190 95 160 C90 180 85 210 95 240 Z" />
          <circle cx="85" cy="180" r="4" fill="#15803d" />
          <circle cx="75" cy="210" r="4" fill="#15803d" />
          <circle cx="80" cy="240" r="4" fill="#15803d" />

          {/* Rama derecha */}
          <path d="M230 260 C240 230 225 190 205 160 C210 180 215 210 205 240 Z" />
          <circle cx="215" cy="180" r="4" fill="#15803d" />
          <circle cx="225" cy="210" r="4" fill="#15803d" />
          <circle cx="220" cy="240" r="4" fill="#15803d" />
        </g>

        {/* Texto inferior: CHINCHA */}
        <text 
          x="150" 
          y="315" 
          fill="#1e1b4b" 
          fontFamily="Arial, sans-serif" 
          fontWeight="bold" 
          fontSize="24" 
          textAnchor="middle"
          letterSpacing="5"
        >
          CHINCHA
        </text>
      </svg>
    </div>
  );
}