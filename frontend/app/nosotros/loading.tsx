// frontend/app/nosotros/loading.tsx
export default function NosotrosIndexLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 animate-pulse select-none">
      
      {/* Simulación del Navbar superior */}
      <div className="w-full h-20 bg-white border-b border-gray-200 shadow-sm" />

      <main className="flex-grow py-12 sm:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-12">
          
          {/* Botón Volver al Inicio Simulado */}
          <div>
            <div className="w-32 h-6 bg-gray-200 rounded-lg" />
          </div>

          {/* Encabezado Principal Simulado */}
          <div className="text-center max-w-3xl mx-auto space-y-4 flex flex-col items-center">
            <div className="w-36 h-6 bg-gray-200 rounded-xl" />
            <div className="w-72 sm:w-96 h-10 bg-gray-200 rounded-xl" />
            <div className="w-full h-12 bg-gray-200 rounded-xl max-w-xl" />
            <div className="w-12 h-12 bg-gray-200 rounded-full mt-6" />
          </div>

          {/* Tarjetas de Navegación Simuladas (Misión, Visión, Objetivos) */}
          <div className="grid grid-cols-1 gap-5 pt-4">
            
            <div className="bg-white border border-gray-200/80 p-6 sm:p-7 rounded-3xl shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 sm:gap-6 w-full">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-200 rounded-2xl shrink-0" />
                <div className="space-y-2 flex-grow">
                  <div className="w-40 h-5 bg-gray-200 rounded-md" />
                  <div className="w-full h-4 bg-gray-100 rounded-md max-w-md" />
                </div>
              </div>
              <div className="w-9 h-9 bg-gray-200 rounded-xl shrink-0" />
            </div>

            <div className="bg-white border border-gray-200/80 p-6 sm:p-7 rounded-3xl shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 sm:gap-6 w-full">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-200 rounded-2xl shrink-0" />
                <div className="space-y-2 flex-grow">
                  <div className="w-40 h-5 bg-gray-200 rounded-md" />
                  <div className="w-full h-4 bg-gray-100 rounded-md max-w-md" />
                </div>
              </div>
              <div className="w-9 h-9 bg-gray-200 rounded-xl shrink-0" />
            </div>

            <div className="bg-white border border-gray-200/80 p-6 sm:p-7 rounded-3xl shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 sm:gap-6 w-full">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-200 rounded-2xl shrink-0" />
                <div className="space-y-2 flex-grow">
                  <div className="w-40 h-5 bg-gray-200 rounded-md" />
                  <div className="w-full h-4 bg-gray-100 rounded-md max-w-md" />
                </div>
              </div>
              <div className="w-9 h-9 bg-gray-200 rounded-xl shrink-0" />
            </div>

          </div>

        </div>
      </main>

      {/* Footer simulado */}
      <div className="w-full h-40 bg-gray-100 mt-auto" />
    </div>
  );
}