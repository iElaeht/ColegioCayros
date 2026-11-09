// frontend/app/page.tsx
import type { Metadata } from "next";
import Navbar from "@/app/components/layout/Navbar";
import HeroSection from "@/app/components/home/HeroSection";
import EducationalLevels from "@/app/components/sections/EducationalLevels";
import SchoolGallery from "./components/sections/SchoolGallery";
import SchoolVideos from "./components/sections/SchoolVideos";
import ObjetivosSection from "./components/sections/ObjetivosSchool";
import EventsSection from "./components/sections/EventosSchool";
import Ubicanos from "./components/sections/Ubicacion";
import ContactSchool from "./components/sections/ContactSchool";
import Footer from "./components/layout/Footer";
import ScrollToTopButton from "@/app/components/common/ScrollToTopButton";


export const metadata: Metadata = {
  title: "I.E.P | Colegio Cayros",
  description: "Página oficial de la I.E.P. Colegio Cayros. Educación de calidad, inicial, primaria y secundaria en Chincha Alta.",
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* El Navbar unificado se mantiene fijo arriba */}
      <Navbar />

      <main className="flex-grow">
        <HeroSection />
        
        <div id="niveles">
          <EducationalLevels />
        </div>

        <div id="galeria">
          <SchoolGallery />
        </div>

        <div id="videos">
          <SchoolVideos />
        </div>

        <div id="eventos">
          <EventsSection />
        </div>

        <div id="ubicacion">
          <Ubicanos />
        </div>

        <div id="contacto">
          <ContactSchool />
        </div>
      </main>

      <Footer />

      {/* Botón flotante para volver arriba */}
      <ScrollToTopButton />
    </div>
  );
}