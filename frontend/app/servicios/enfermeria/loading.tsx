// frontend/app/servicios/enfermeria/loading.tsx
export default function EnfermeriaLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 animate-pulse select-none">
      
      {/* Navbar simulado */}
      <div className="w-full h-20 bg-white border-b border-gray-200 shadow-sm" />

      <main className="flex-grow py-12 sm:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-12">
          
          {/* Botón Volver simulado */}
          <div className="w-28 h-6 bg-slate-200 rounded-md" />

          {/* Encabezado Principal Simulado */}
          <div className="text-center max-w-3xl mx-auto space-y-4 flex flex-col items-center">
            <div className="w-48 h-5 bg-slate-200 rounded-full" />
            <div className="w-80 sm:w-96 h-12 bg-slate-200 rounded-xl" />
            <div className="w-full h-16 bg-slate-200 rounded-lg max-w-2xl" />
          </div>

          {/* Tarjeta 1 Simulada */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-200 shrink-0" />
              <div className="space-y-2">
                <div className="w-32 h-4 bg-slate-200 rounded" />
                <div className="w-64 h-6 bg-slate-200 rounded-md" />
              </div>
            </div>
            <div className="border-t border-gray-100 pt-6 space-y-4">
              <div className="w-full h-16 bg-slate-100 rounded-xl" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="w-full h-20 bg-slate-100 rounded-2xl" />
                <div className="w-full h-20 bg-slate-100 rounded-2xl" />
              </div>
            </div>
          </div>

          {/* Tarjeta 2 Simulada */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-200 shrink-0" />
              <div className="space-y-2">
                <div className="w-32 h-4 bg-slate-200 rounded" />
                <div className="w-64 h-6 bg-slate-200 rounded-md" />
              </div>
            </div>
            <div className="border-t border-gray-100 pt-6 space-y-3">
              <div className="w-full h-12 bg-slate-100 rounded-xl" />
              <div className="w-3/4 h-4 bg-slate-100 rounded" />
              <div className="w-1/2 h-4 bg-slate-100 rounded" />
            </div>
          </div>

          {/* Tarjeta 3 Simulada */}
          <div className="bg-[#111c38]/90 rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 shrink-0" />
              <div className="space-y-2">
                <div className="w-32 h-4 bg-white/20 rounded" />
                <div className="w-72 h-6 bg-white/20 rounded-md" />
              </div>
            </div>
            <div className="border-t border-white/10 pt-6 space-y-4">
              <div className="w-full h-12 bg-white/10 rounded-xl" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="w-full h-24 bg-white/5 rounded-2xl" />
                <div className="w-full h-24 bg-white/5 rounded-2xl" />
              </div>
            </div>
          </div>

          {/* Navegador Inferior Simulado */}
          <div className="pt-8 space-y-6">
            <div className="w-48 h-3 bg-slate-200 rounded mx-auto" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="w-full h-24 bg-white border border-gray-200 rounded-2xl" />
              <div className="w-full h-24 bg-white border border-gray-200 rounded-2xl" />
            </div>
          </div>

        </div>
      </main>

      {/* Footer simulado */}
      <div className="w-full h-40 bg-slate-200 mt-auto" />
    </div>
  );
}