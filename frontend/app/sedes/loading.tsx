// frontend/app/sedes/loading.tsx
export default function SedesLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 animate-pulse select-none">
      
      {/* Simulación del Navbar superior */}
      <div className="w-full h-20 bg-white border-b border-gray-200 shadow-sm" />

      <main className="flex-grow py-12 sm:py-20 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-20">
          
          {/* Encabezado Principal Simulado */}
          <div className="text-center max-w-3xl mx-auto space-y-4 flex flex-col items-center">
            <div className="w-36 h-6 bg-gray-200 rounded-xl" />
            <div className="w-72 sm:w-96 h-10 bg-gray-200 rounded-xl" />
            <div className="w-full h-12 bg-gray-200 rounded-xl max-w-xl" />
            <div className="w-12 h-12 bg-gray-200 rounded-full mt-6" />
          </div>

          {/* Sede Principal Simulada (Grid de 3 columnas: Tarjeta + Mapa) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-6 sm:gap-8 items-stretch">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gray-200 rounded-2xl" />
                <div className="w-28 h-5 bg-gray-200 rounded-md" />
                <div className="w-48 h-7 bg-gray-200 rounded-lg" />
                <div className="w-full h-12 bg-gray-100 rounded-lg" />
              </div>
              <div className="w-full h-11 bg-gray-200 rounded-xl" />
            </div>

            <div className="lg:col-span-2 w-full h-[350px] sm:h-[400px] lg:h-auto rounded-3xl bg-gray-200 shadow-sm" />
          </div>

          {/* Sede Autorizada Simulada (Grid de 3 columnas: Tarjeta + Mapa) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-6 sm:gap-8 items-stretch">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gray-200 rounded-2xl" />
                <div className="w-28 h-5 bg-gray-200 rounded-md" />
                <div className="w-48 h-7 bg-gray-200 rounded-lg" />
                <div className="w-full h-12 bg-gray-100 rounded-lg" />
              </div>
              <div className="w-3/4 h-4 bg-gray-100 rounded-md" />
            </div>

            <div className="lg:col-span-2 w-full h-[350px] sm:h-[400px] lg:h-auto rounded-3xl bg-gray-200 shadow-sm" />
          </div>

        </div>
      </main>

      {/* Footer simulado */}
      <div className="w-full h-40 bg-gray-100 mt-auto" />
    </div>
  );
}