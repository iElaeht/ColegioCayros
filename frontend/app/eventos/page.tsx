import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ArrowLeft } from "lucide-react";

// Datos de ejemplo para los eventos institucionales
const eventsList = [
  {
    id: 1,
    title: "Aniversario Institucional y Feria de Talentos",
    date: "15 de Octubre, 2026",
    location: "Patio Central - Sede Principal",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    description: "Celebramos un año más de historia con presentaciones artísticas, exposiciones científicas y proyectos desarrollados por nuestros estudiantes.",
  },
  {
    id: 2,
    title: "Juegos Deportivos Interescolares Cayros",
    date: "22 de Noviembre, 2026",
    location: "Complejo Deportivo Municipal",
    image: "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?q=80&w=1200&auto=format&fit=crop",
    description: "Un encuentro lleno de energía, compañerismo y sana competencia en disciplinas como fútbol, vóley y atletismo.",
  },
  {
    id: 3,
    title: "Clausura del Año Escolar y Exposición de Logros",
    date: "18 de Diciembre, 2026",
    location: "Auditorio Principal",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop",
    description: "Ceremonia especial para reconocer el esfuerzo, la dedicación y el crecimiento académico de toda nuestra comunidad estudiantil.",
  },
];

export default function EventosPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto w-full">
        
        {/* Cabecera de la página */}
        <div className="mb-12 flex flex-col items-start">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#16275d] hover:text-[#f8de32] transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Volver al inicio</span>
          </Link>

          <div className="flex items-center gap-3 mb-3">
            <span aria-hidden="true" className="h-3.5 w-3.5 flex-shrink-0 rounded-[2px] bg-[#f8de32]" />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#16275d]">
              Próximos Eventos y Actividades
            </h1>
          </div>
          <p className="text-gray-600 text-base max-w-2xl leading-relaxed">
            Mantente al día con las actividades académicas, culturales y deportivas que forman parte de la experiencia integral en nuestra comunidad educativa.
          </p>
        </div>

        {/* Cuadrícula de Eventos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventsList.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col"
            >
              <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#16275d] bg-[#f8de32]/20 px-3 py-1 rounded-full w-fit mb-4">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{event.date}</span>
                </div>

                <h3 className="text-xl font-bold text-[#16275d] mb-2 leading-snug">
                  {event.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>{event.location}</span>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                  {event.description}
                </p>

                <button className="w-full bg-[#16275d] hover:bg-[#111f4a] text-white py-2.5 px-4 rounded-xl font-medium text-sm transition-colors duration-200 cursor-pointer shadow-sm">
                  Más información
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}