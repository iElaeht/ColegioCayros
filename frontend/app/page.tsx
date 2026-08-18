import Navbar from "@/app/components/layout/Navbar";
import HeroSection from "@/app/components/home/HeroSection";
import EducationalLevels from "@/app/components/sections/EducationalLevels"
import SchoolGallery from "./components/sections/SchoolGallery";
import SchoolVideos from './components/sections/SchoolVideos';
import ObjetivosSection from "./components/sections/ObjetivosSchool";
import EventsSection from "./components/sections/EventosSchool";
import ContactSchool from "./components/sections/ContactSchool";
import Ubicanos from "./components/sections/Ubicacion";
import Footer from "./components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* 1. Barra de navegación superior */}
      <Navbar />

      {/* 2. Sección Principal / Portada */}
      <HeroSection />
    
    <EducationalLevels />
    <SchoolGallery />
    <SchoolVideos />
    <ObjetivosSection />
    <EventsSection />
    <Ubicanos />
    <ContactSchool />
    <Footer />
      {/* Aquí seguiremos integrando las demás secciones (Objetivos, Galería, Eventos, etc.) */}
    </main>
  );
}