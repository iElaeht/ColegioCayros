import React from 'react';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="Footer" className="w-full relative overflow-hidden select-none border-t border-blue-950/40">
      
      {/* Contenedor principal de fondo partido responsivo (65% azul oscuro / 35% celeste) */}
      <div className="grid grid-cols-1 lg:grid-cols-[65fr_35fr] w-full min-h-[360px]">
        
        {/* Lado Izquierdo: Fondo azul marino con padding responsivo fluido y centrado flexible */}
        <div className="bg-[#16275d] text-white py-16 px-6 sm:px-12 lg:px-16 xl:px-24 flex justify-end lg:justify-center items-center">
          <div className="w-full max-w-md flex flex-col items-center lg:items-start text-center lg:text-left space-y-5">
            
            {/* Logotipo limpio sin fondo */}
            <div className="flex items-center justify-center">
              <Image 
                src="/images/ui/Cayros-logo.png" 
                alt="logo cayros" 
                width={52} 
                height={52} 
                className="object-contain"
              />
            </div>

            {/* Datos de contacto oficiales */}
            <div className="space-y-1.5 text-sm text-gray-300 font-['Open_Sans',sans-serif]">
              <p className="font-medium text-white">(+51) 956 411 538</p>
              <p>promotoria@colegiocayros.edu.pe</p>
              <p className="max-w-xs">Av. José Carlos Mariátegui Lt 01 Grocio Prado</p>
            </div>

            {/* Copyright dinámico y Redes Sociales con iconos */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-xs text-gray-400 pt-3 border-t border-white/10 w-full max-w-md">
              <span>©Cayros School {currentYear}</span>
              <div className="flex items-center space-x-4">
                <a 
                  href="https://www.facebook.com/ColegioCayrosChincha" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1.5 hover:text-yellow-400 transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </a>
                <a 
                  href="https://api.whatsapp.com/send?phone=51956411538&text=Hola,%20Quiero%20informacion%20sobre%20Cayros%20School" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1.5 hover:text-yellow-400 transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.198-.198.347-.764.967-.937 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span>Whatsapp</span>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Lado Derecho: Fondo celeste claro */}
        <div className="bg-[#6eb5ec] text-[#111c38] py-16 px-6 hidden lg:flex justify-start">
          {/* Espacio reservado para mantener la proporción de la rejilla */}
        </div>

      </div>

      {/* Tarjeta flotante interactiva enlazada a Google Maps, centrada exactamente en la línea divisoria (65%) */}
      <div className="hidden lg:flex absolute inset-0 items-center pointer-events-none" style={{ left: '65%' }}>
        <a 
          href="https://goo.gl/maps/ahsmdcemEqraWJQE6" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="pointer-events-auto -translate-x-1/2 w-[220px] aspect-square relative overflow-hidden group block shadow-xl"
        >
          {/* Imagen de fondo */}
          <Image 
            src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop" 
            alt="presentacion" 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Filtro azul transparente institucional */}
          <div className="absolute inset-0 bg-[#111c38]/75 mix-blend-multiply" />
          <div className="absolute inset-0 bg-black/30" />

          {/* Esquinas amarillas decorativas */}
          <div className="absolute top-0 left-0 w-3 h-3 bg-yellow-400 z-10" />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-400 z-10" />

          {/* Contenido centrado: Icono de ubicación y texto */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-5 z-20">
            <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-2.5">
              <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <h3 className="text-white font-bold tracking-[0.15em] text-xs uppercase drop-shadow-md">
              CHINCHA, ICA
            </h3>
          </div>
        </a>
      </div>

      {/* Versión móvil de la tarjeta enlazada */}
      <div className="flex lg:hidden bg-[#6eb5ec] py-10 px-6 justify-center">
        <a 
          href="https://goo.gl/maps/ahsmdcemEqraWJQE6" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-full max-w-[220px] aspect-square relative overflow-hidden group block shadow-lg"
        >
          <Image 
            src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop" 
            alt="presentacion" 
            fill 
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#111c38]/75 mix-blend-multiply" />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute top-0 left-0 w-3 h-3 bg-yellow-400 z-10" />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-400 z-10" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-5 z-20">
            <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-2.5">
              <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <h3 className="text-white font-bold tracking-[0.15em] text-xs uppercase">
              CHINCHA, ICA
            </h3>
          </div>
        </a>
      </div>

    </footer>
  );
}