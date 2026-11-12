// frontend/app/matricula/loading.tsx
export default function MatriculaLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 animate-pulse select-none">
      
      {/* Simulación del Navbar superior */}
      <div className="w-full h-20 bg-white border-b border-gray-200 shadow-sm" />

      <main className="flex-grow pt-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Encabezado Principal Simulado */}
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3 flex flex-col items-center">
            <div className="w-80 sm:w-96 h-10 bg-slate-200 rounded-xl" />
            <div className="w-full h-5 bg-slate-200 rounded-lg max-w-xl" />
          </div>

          {/* Grid Principal (Carrusel + Formulario) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Simulación del Carrusel / Galería Izquierda */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-[16/10] w-full rounded-[2rem] bg-slate-200 shadow-sm overflow-hidden" />
              <div className="flex justify-center items-center gap-2.5 mt-4">
                <div className="w-10 h-2 bg-slate-200 rounded-full" />
                <div className="w-2 h-2 bg-slate-200 rounded-full" />
                <div className="w-2 h-2 bg-slate-200 rounded-full" />
              </div>
            </div>

            {/* Simulación del Formulario de Pre-Inscripción Derecho */}
            <div className="lg:col-span-6 bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6 sm:p-8 space-y-6">
              <div className="space-y-2">
                <div className="w-64 h-6 bg-slate-200 rounded-lg" />
                <div className="w-48 h-4 bg-slate-100 rounded-md" />
              </div>

              {/* Campos del formulario simulados */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="w-32 h-3 bg-slate-200 rounded" />
                    <div className="w-full h-10 bg-slate-100 rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="w-32 h-3 bg-slate-200 rounded" />
                    <div className="w-full h-10 bg-slate-100 rounded-xl" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="w-32 h-3 bg-slate-200 rounded" />
                    <div className="w-full h-10 bg-slate-100 rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="w-32 h-3 bg-slate-200 rounded" />
                    <div className="w-full h-10 bg-slate-100 rounded-xl" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="w-32 h-3 bg-slate-200 rounded" />
                    <div className="w-full h-10 bg-slate-100 rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="w-32 h-3 bg-slate-200 rounded" />
                    <div className="w-full h-10 bg-slate-100 rounded-xl" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="w-44 h-3 bg-slate-200 rounded" />
                  <div className="w-full h-10 bg-slate-100 rounded-xl" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="w-32 h-3 bg-slate-200 rounded" />
                    <div className="w-full h-10 bg-slate-100 rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="w-32 h-3 bg-slate-200 rounded" />
                    <div className="w-full h-10 bg-slate-100 rounded-xl" />
                  </div>
                </div>

                <div className="w-full h-11 bg-slate-200 rounded-xl mt-6" />
              </div>
            </div>

          </div>

          {/* Simulación de la Sección Inferior Institucional (Misión, Visión, Propósito, Valores) */}
          <div className="mt-20">
            <div className="bg-[#16275D]/90 rounded-[2.5xl] shadow-xl p-8 sm:p-12 border border-slate-700/30">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
                
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex flex-col items-start space-y-3">
                    <div className="w-12 h-12 bg-white/10 rounded-xl" />
                    <div className="w-24 h-6 bg-white/20 rounded-md" />
                    <div className="w-full h-4 bg-white/10 rounded-md" />
                    <div className="w-3/4 h-4 bg-white/10 rounded-md" />
                  </div>
                ))}

              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer simulado */}
      <div className="w-full h-40 bg-slate-200 mt-auto" />
    </div>
  );
}