// frontend/app/legal/loading.tsx
export default function LegalLoading() {
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

          {/* Tarjeta de Documento de Texto Simulada */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
            <div className="space-y-3">
              <div className="w-64 h-6 bg-slate-200 rounded" />
              <div className="w-full h-16 bg-slate-100 rounded-xl" />
            </div>
            <div className="space-y-3">
              <div className="w-72 h-6 bg-slate-200 rounded" />
              <div className="w-full h-20 bg-slate-100 rounded-xl" />
            </div>
            <div className="space-y-3">
              <div className="w-56 h-6 bg-slate-200 rounded" />
              <div className="w-full h-16 bg-slate-100 rounded-xl" />
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