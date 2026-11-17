// frontend/app/boletin/loading.tsx
export default function BoletinLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 animate-pulse select-none">
      
      {/* Navbar simulado */}
      <div className="w-full h-20 bg-white border-b border-gray-200 shadow-sm" />

      <main className="flex-grow py-12 sm:py-20 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-12">
          
          {/* Botón Volver simulado */}
          <div className="w-28 h-6 bg-slate-200 rounded-md" />

          {/* Encabezado Principal Simulado */}
          <div className="text-center max-w-3xl mx-auto space-y-4 flex flex-col items-center">
            <div className="w-48 h-5 bg-slate-200 rounded-full" />
            <div className="w-80 sm:w-96 h-12 bg-slate-200 rounded-xl" />
            <div className="w-full h-16 bg-slate-200 rounded-lg max-w-2xl" />
          </div>

          {/* Tarjeta de Información Detallada Simulada */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-200 shrink-0" />
              <div className="space-y-2">
                <div className="w-32 h-4 bg-slate-200 rounded" />
                <div className="w-64 h-6 bg-slate-200 rounded-md" />
              </div>
            </div>
            <div className="border-t border-gray-100 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="w-full h-20 bg-slate-100 rounded-2xl" />
              <div className="w-full h-20 bg-slate-100 rounded-2xl" />
              <div className="w-full h-20 bg-slate-100 rounded-2xl" />
              <div className="w-full h-20 bg-slate-100 rounded-2xl" />
            </div>
          </div>

          {/* Tarjeta de Edición Vigente y Descarga Simulada */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 w-full">
              <div className="w-12 h-12 rounded-2xl bg-slate-200 shrink-0" />
              <div className="space-y-2 w-full max-w-md">
                <div className="w-28 h-4 bg-slate-200 rounded" />
                <div className="w-full h-5 bg-slate-200 rounded" />
              </div>
            </div>
            <div className="w-36 h-11 bg-slate-200 rounded-xl shrink-0" />
          </div>

          {/* Sección de Vista Previa Simulada */}
          <div className="bg-white border border-gray-200 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="w-56 h-4 bg-slate-200 rounded" />
              <div className="w-24 h-3 bg-slate-200 rounded" />
            </div>
            <div className="w-full h-[650px] sm:h-[750px] bg-slate-100 rounded-2xl" />
          </div>

        </div>
      </main>

      {/* Footer simulado */}
      <div className="w-full h-40 bg-slate-200 mt-auto" />
    </div>
  );
}