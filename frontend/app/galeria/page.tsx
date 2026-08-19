import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";

export default function GaleriaPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow pt-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-[#16275d] mb-6">
          Galería Institucional
        </h1>
        <p className="text-gray-600 mb-8">
          Explora los momentos más destacados de nuestra comunidad educativa Cayros.
        </p>

        {/* Aquí puedes agregar tus componentes de fotos o la cuadrícula de la galería */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Ejemplo de tarjetas de galería */}
          <div className="bg-gray-200 h-64 rounded-xl animate-pulse"></div>
          <div className="bg-gray-200 h-64 rounded-xl animate-pulse"></div>
          <div className="bg-gray-200 h-64 rounded-xl animate-pulse"></div>
        </div>
      </main>

      <Footer />
    </div>
  );
}