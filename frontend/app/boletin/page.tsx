// frontend/app/boletin/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import { FileText, Download, ArrowLeft, Calendar, Sparkles, FileQuestion, CheckCircle, Info } from "lucide-react";

export default function BoletinPage() {
  const [pdfExists, setPdfExists] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  // Cambia por la ruta real de tu archivo en public/
  const pdfUrl = "/pdfs/boletin-informativo.pdf";

  useEffect(() => {
    document.title = "Boletín Informativo | Colegio Cayros";

    // Verificamos si el archivo PDF realmente existe en el servidor para evitar pantallas negras
    fetch(pdfUrl, { method: "HEAD" })
      .then((res) => {
        if (res.ok) {
          setPdfExists(true);
        } else {
          setPdfExists(false);
        }
      })
      .catch(() => {
        setPdfExists(false);
      })
      .finally(() => {
        setChecking(false);
      });
  }, [pdfUrl]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 select-none">
      <Navbar />

      <main className="flex-grow py-12 sm:py-20 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-12">
          
          {/* Botón Volver al inicio */}
          <div className="w-full flex justify-start">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#16275d] hover:text-amber-600 py-1.5 transition-all duration-300 group outline-none"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Volver al inicio</span>
            </Link>
          </div>

          {/* Encabezado Principal */}
          <div className="text-center max-w-3xl mx-auto space-y-4 flex flex-col items-center">
            <div className="inline-flex items-center gap-2.5 text-[#16275d] text-sm sm:text-base font-extrabold uppercase tracking-[0.25em]">
              <FileText className="w-5 h-5 text-amber-500" />
              Comunicación Institucional
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111c38] font-['Poppins',sans-serif]">
              Boletín Informativo
            </h1>
            
            <p className="text-gray-600 text-sm sm:text-base font-['Open_Sans',sans-serif] leading-relaxed max-w-2xl mx-auto">
              Mantente al día con las últimas novedades, circulares, eventos destacados y logros académicos de nuestra comunidad escolar en Chincha.
            </p>
          </div>

          {/* Tarjeta de Información Detallada: Aquí podrás encontrar... */}
          <div className="bg-white border border-gray-200/85 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#111c38] text-amber-400 flex items-center justify-center shadow-md shrink-0">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md mb-1 inline-block">
                  Guía del Comunicado
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#111c38]">
                  ¿Qué podrás encontrar en este boletín?
                </h2>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-gray-600 font-['Open_Sans',sans-serif]">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#111c38] block font-bold mb-0.5">Cronograma de Actividades</strong>
                  <span>Fechas importantes de exámenes, ceremonias y eventos deportivos o culturales.</span>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#111c38] block font-bold mb-0.5">Circulares y Avisos</strong>
                  <span>Indicaciones directas de la dirección y promotoria para los padres de familia.</span>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#111c38] block font-bold mb-0.5">Logros Estudiantiles</strong>
                  <span>Reconocimiento al talento, esfuerzo y participación destacada de nuestros alumnos.</span>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#111c38] block font-bold mb-0.5">Orientación Académica</strong>
                  <span>Consejos y tips pedagógicos para reforzar el aprendizaje desde el hogar.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta de Edición Vigente y Descarga */}
          <div className="bg-white border border-gray-200/85 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#111c38] text-amber-400 flex items-center justify-center shadow-md shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md inline-block">
                  Edición Vigente
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#111c38]">
                  Boletín Escolar - Periodo Académico
                </h3>
                <p className="text-xs text-gray-500 flex items-center gap-1.5 font-['Open_Sans',sans-serif]">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  Actualizado recientemente para padres y estudiantes.
                </p>
              </div>
            </div>

            <div>
              {pdfExists ? (
                <a
                  href={pdfUrl}
                  download="Boletin_Colegio_Cayros.pdf"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#16275D] hover:bg-blue-900 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md shadow-blue-900/10 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Descargar PDF</span>
                </a>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center gap-2 px-5 py-3 bg-gray-200 text-gray-400 text-xs sm:text-sm font-bold rounded-xl cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  <span>No disponible</span>
                </button>
              )}
            </div>
          </div>

          {/* Sección de Vista Previa del PDF con control de estado */}
          <div className="bg-white border border-gray-200/85 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-bold text-[#111c38] uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Boletín Informativo - Vista Previa
              </h3>
              <span className="text-xs text-gray-400 font-medium">Visualización en línea</span>
            </div>

            <div className="w-full h-[650px] sm:h-[750px] rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 relative flex items-center justify-center">
              {checking ? (
                <div className="flex flex-col items-center space-y-2 text-gray-400">
                  <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-semibold">Verificando documento...</span>
                </div>
              ) : pdfExists ? (
                <iframe
                  src={`${pdfUrl}#toolbar=0&view=FitH`}
                  title="Boletín Informativo Colegio Cayros"
                  className="w-full h-full"
                />
              ) : (
                /* Estado elegante tipo "No image" / No disponible */
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shadow-inner">
                    <FileQuestion className="w-8 h-8" />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <h4 className="text-sm font-bold text-[#111c38]">No hay documento disponible</h4>
                    <p className="text-xs text-gray-500 font-['Open_Sans',sans-serif]">
                      El archivo PDF del boletín informativo aún no ha sido cargado en el sistema. Pronto estará disponible para su visualización.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}