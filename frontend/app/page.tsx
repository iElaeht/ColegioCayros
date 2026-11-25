import type { Metadata } from "next";
import Navbar from "@/app/components/layout/Navbar";
import HeroSection from "@/app/components/home/HeroSection";
import EducationalLevels from "@/app/components/sections/EducationalLevels";
import SchoolGallery from "./components/sections/SchoolGallery";
import SchoolVideos from "./components/sections/SchoolVideos";
import EventsSection from "./components/sections/EventosSchool";
import Ubicanos from "./components/sections/Ubicacion";
import Footer from "./components/layout/Footer";
import ScrollToTopButton from "@/app/components/common/ScrollToTopButton";

export const metadata: Metadata = {
  title: "I.E.P | Colegio Cayros",
  description:
    "Página oficial de la I.E.P. Colegio Cayros. Educación de calidad, inicial, primaria y secundaria en Chincha Alta.",
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative">
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
      </main>

      <Footer />

      <ScrollToTopButton />
    </div>
  );
}