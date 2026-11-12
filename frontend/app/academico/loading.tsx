// frontend/app/academico/loading.tsx
export default function AcademicoLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50 animate-pulse">
      
      {/* Simulación del Navbar superior */}
      <div className="w-full h-20 bg-white border-b border-gray-200 shadow-sm" />

      <main className="flex-grow py-12 sm:py-20 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-10">
          
          {/* Botón Volver simulado */}
          <div className="w-32 h-6 bg-gray-200 rounded-lg" />

          {/* Header Skeleton (Simula el título y descripción principal) */}
          <div className="bg-white border border-gray-200/80 rounded-3xl p-8 sm:p-12 space-y-5 shadow-sm">
            <div className="w-48 h-6 bg-gray-200 rounded-xl" />
            <div className="w-3/4 h-10 bg-gray-200 rounded-xl" />
            <div className="w-full h-16 bg-gray-200 rounded-xl" />
          </div>

          {/* Details Skeleton (Grid 6-6: Texto izquierda e imagen derecha) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Lado Izquierdo: Bloques de texto simulados */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-white border border-gray-200/80 p-8 rounded-3xl h-64 bg-gray-100 shadow-sm" />
              <div className="bg-white border border-gray-200/80 p-8 rounded-3xl h-40 bg-gray-100 shadow-sm" />
            </div>

            {/* Lado Derecho: Imagen y puntos simulados */}
            <div className="lg:col-span-6 space-y-4">
              <div className="w-full h-[340px] sm:h-[390px] bg-gray-200 rounded-3xl shadow-md" />
              <div className="flex justify-center gap-2.5 pt-1">
                <div className="w-10 h-2 bg-gray-200 rounded-full" />
                <div className="w-2.5 h-2 bg-gray-200 rounded-full" />
                <div className="w-2.5 h-2 bg-gray-200 rounded-full" />
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}