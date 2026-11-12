// frontend/app/nosotros/vision/loading.tsx
export default function VisionLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 animate-pulse select-none">
      
      {/* Simulación del Navbar superior */}
      <div className="w-full h-20 bg-white border-b border-gray-200 shadow-sm" />

      <main className="flex-grow py-12 sm:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-12">
          
          {/* Encabezado Principal Simulado */}
          <div className="text-center max-w-3xl mx-auto space-y-4 flex flex-col items-center">
            <div className="w-44 h-6 bg-gray-200 rounded-xl" />
            <div className="w-64 sm:w-80 h-10 bg-gray-200 rounded-xl" />
            <div className="w-full h-12 bg-gray-200 rounded-xl max-w-xl" />
          </div>

          {/* Tarjeta de Contenido Principal Simulada */}
          <div className="bg-white border border-gray-200/80 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-2xl shrink-0" />
              <div className="space-y-2">
                <div className="w-36 h-4 bg-gray-200 rounded-md" />
                <div className="w-64 h-6 bg-gray-200 rounded-lg" />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 space-y-3">
              <div className="w-full h-5 bg-gray-200 rounded-md" />
              <div className="w-full h-5 bg-gray-200 rounded-md" />
              <div className="w-2/3 h-5 bg-gray-200 rounded-md" />
            </div>

            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex items-center gap-3.5">
              <div className="w-5 h-5 bg-gray-200 rounded-full shrink-0" />
              <div className="w-full h-4 bg-gray-200 rounded-md max-w-md" />
            </div>
          </div>

        </div>
      </main>

      {/* Footer simulado */}
      <div className="w-full h-40 bg-gray-100 mt-auto" />
    </div>
  );
}