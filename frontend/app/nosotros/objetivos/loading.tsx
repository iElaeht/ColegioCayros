// frontend/app/nosotros/objetivos/loading.tsx
export default function ObjetivosLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 animate-pulse select-none">
      
      {/* Simulación del Navbar superior */}
      <div className="w-full h-20 bg-white border-b border-gray-200 shadow-sm" />

      <main className="flex-grow py-12 sm:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-12">
          
          {/* Encabezado Principal Simulado */}
          <div className="text-center max-w-3xl mx-auto space-y-4 flex flex-col items-center">
            <div className="w-44 h-6 bg-gray-200 rounded-xl" />
            <div className="w-72 sm:w-96 h-10 bg-gray-200 rounded-xl" />
            <div className="w-full h-12 bg-gray-200 rounded-xl max-w-xl" />
          </div>

          {/* Parrilla de Objetivos Simulada (Grid de 2 columnas con 6 tarjetas) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div 
                key={item} 
                className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4 flex flex-col justify-between h-48"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 bg-gray-200 rounded-xl" />
                  <div className="w-16 h-5 bg-gray-100 rounded-md" />
                </div>
                <div className="space-y-2">
                  <div className="w-full h-4 bg-gray-200 rounded-md" />
                  <div className="w-full h-4 bg-gray-200 rounded-md" />
                  <div className="w-3/4 h-4 bg-gray-100 rounded-md" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      {/* Footer simulado */}
      <div className="w-full h-40 bg-gray-100 mt-auto" />
    </div>
  );
}