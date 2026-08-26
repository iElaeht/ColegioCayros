import Navbar from "@/app/components/layout/Navbar";
import HeroSection from "@/app/components/home/HeroSection";
import EducationalLevels from "@/app/components/sections/EducationalLevels";
import SchoolGallery from "./components/sections/SchoolGallery";
import SchoolVideos from "./components/sections/SchoolVideos";
import ObjetivosSection from "./components/sections/ObjetivosSchool";
import EventsSection from "./components/sections/EventosSchool";
import ContactSchool from "./components/sections/ContactSchool";
import Ubicanos from "./components/sections/Ubicacion";
import Footer from "./components/layout/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Barra de navegación superior */}
      <Navbar />

      {/* 2. Contenido principal con flujo libre para el scroll */}
      <main className="flex-grow">
        <HeroSection />
        <EducationalLevels />
        <SchoolGallery />
        <SchoolVideos />
        <ObjetivosSection />
        <EventsSection />
        <Ubicanos />
        <ContactSchool />
      </main>

      {/* 3. Pie de página institucional */}
      <Footer />
    </div>
  );
}
