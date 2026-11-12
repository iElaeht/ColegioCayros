// frontend/app/eventos/loading.tsx
export default function EventosLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 animate-pulse select-none">
      
      {/* Simulación del Navbar superior */}
      <div className="w-full h-20 bg-white border-b border-gray-200 shadow-sm" />

      <main className="flex-grow py-12 sm:py-20 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-12">
          
          {/* Encabezado Principal y Botón Volver Simulados */}
          <div className="flex flex-col items-start max-w-3xl mx-auto w-full space-y-4">
            <div className="w-32 h-6 bg-gray-200 rounded-lg" />

            <div className="w-full text-center space-y-4 flex flex-col items-center">
              <div className="w-36 h-6 bg-gray-200 rounded-xl" />
              <div className="w-72 sm:w-96 h-10 bg-gray-200 rounded-xl" />
              <div className="w-full h-12 bg-gray-200 rounded-xl max-w-xl" />
              <div className="w-12 h-12 bg-gray-200 rounded-full mt-6" />
            </div>
          </div>

          {/* Simulación de la Barra de Filtros de Eventos */}
          <div className="w-full h-20 bg-white border border-gray-200/80 rounded-3xl shadow-xs" />

          {/* Grid de Tarjetas de Eventos Simuladas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="bg-white border border-gray-200/80 rounded-3xl overflow-hidden shadow-xs p-6 space-y-4">
              <div className="w-full h-52 bg-gray-200 rounded-2xl" />
              <div className="w-28 h-4 bg-gray-200 rounded-md" />
              <div className="w-full h-6 bg-gray-200 rounded-lg" />
              <div className="w-4/5 h-4 bg-gray-100 rounded-md" />
            </div>

            <div className="bg-white border border-gray-200/80 rounded-3xl overflow-hidden shadow-xs p-6 space-y-4">
              <div className="w-full h-52 bg-gray-200 rounded-2xl" />
              <div className="w-28 h-4 bg-gray-200 rounded-md" />
              <div className="w-full h-6 bg-gray-200 rounded-lg" />
              <div className="w-4/5 h-4 bg-gray-100 rounded-md" />
            </div>

            <div className="bg-white border border-gray-200/80 rounded-3xl overflow-hidden shadow-xs p-6 space-y-4">
              <div className="w-full h-52 bg-gray-200 rounded-2xl" />
              <div className="w-28 h-4 bg-gray-200 rounded-md" />
              <div className="w-full h-6 bg-gray-200 rounded-lg" />
              <div className="w-4/5 h-4 bg-gray-100 rounded-md" />
            </div>

          </div>

        </div>
      </main>

      {/* Footer simulado */}
      <div className="w-full h-40 bg-gray-100 mt-auto" />
    </div>
  );
}