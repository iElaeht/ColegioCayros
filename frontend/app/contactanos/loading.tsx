// frontend/app/contactanos/loading.tsx
export default function ContactanosLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 animate-pulse">
      
      {/* Simulación del Navbar */}
      <div className="w-full h-20 bg-white border-b border-gray-200 shadow-sm" />

      <main className="flex-grow py-12 sm:py-20 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-16">
          
          {/* Encabezado Principal Simulado */}
          <div className="text-center max-w-3xl mx-auto space-y-4 flex flex-col items-center">
            <div className="w-44 h-6 bg-gray-200 rounded-xl" />
            <div className="w-72 h-10 bg-gray-200 rounded-xl" />
            <div className="w-full h-12 bg-gray-200 rounded-xl max-w-xl" />
          </div>

          {/* Sección Grid Principal (Info izquierda y Formulario derecha) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Columna de Info Institucional Simulada */}
            <div className="lg:col-span-5 bg-white border border-gray-200/80 p-8 rounded-3xl h-[450px] space-y-6 shadow-sm">
              <div className="w-36 h-6 bg-gray-200 rounded-lg" />
              <div className="w-3/4 h-8 bg-gray-200 rounded-lg" />
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="w-full h-12 bg-gray-100 rounded-xl" />
                <div className="w-full h-12 bg-gray-100 rounded-xl" />
                <div className="w-full h-12 bg-gray-100 rounded-xl" />
              </div>
            </div>

            {/* Columna del Formulario Simulada */}
            <div className="lg:col-span-7 bg-white border border-gray-200/80 p-8 sm:p-10 rounded-3xl h-[450px] space-y-6 shadow-sm">
              <div className="w-full h-12 bg-gray-100 rounded-xl" />
              <div className="w-full h-12 bg-gray-100 rounded-xl" />
              <div className="w-full h-12 bg-gray-100 rounded-xl" />
              <div className="w-full h-24 bg-gray-100 rounded-xl" />
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}