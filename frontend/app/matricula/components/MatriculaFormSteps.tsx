// frontend/app/matricula/components/MatriculaFormSteps.tsx
"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

interface FormData {
  sede: string;
  nombresEstudiante: string;
  apellidosEstudiante: string;
  dniEstudiante: string;
  nivel: string;
  grado: string;
  nombresApoderado: string;
  telefono: string;
  email: string;
  mensaje: string;
  tieneOpcion: string;
  detalleOpcion: string;
}

const GRADOS_POR_NIVEL: Record<string, string[]> = {
  Inicial: ["3 Años", "4 Años", "5 Años"],
  Primaria: ["1er Grado", "2do Grado", "3er Grado", "4to Grado", "5to Grado", "6to Grado"],
  Secundaria: ["1er Año", "2do Año", "3er Año", "4to Año", "5to Año"],
};

export default function MatriculaFormSteps() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState<FormData>({
    sede: "",
    nombresEstudiante: "",
    apellidosEstudiante: "",
    dniEstudiante: "",
    nivel: "",
    grado: "",
    nombresApoderado: "",
    telefono: "",
    email: "",
    mensaje: "",
    tieneOpcion: "",
    detalleOpcion: "",
  });

  const [emailUser, setEmailUser] = useState<string>("");
  const [emailDomain, setEmailDomain] = useState<string>("@gmail.com");

  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [toastProgress, setToastProgress] = useState<number>(100);
  const [toastDuration, setToastDuration] = useState<number>(7000);
  const [isSuccessState, setIsSuccessState] = useState<boolean>(false);

  useEffect(() => {
    if (!toast) return;

    const intervalTime = 100;
    const decrement = (intervalTime / toastDuration) * 100;
    setToastProgress(100);

    const timer = setInterval(() => {
      setToastProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          setToast(null);
          if (isSuccessState) {
            setIsSuccessState(false);
            setCurrentStep(1);
          }
          return 100;
        }
        return prev - decrement;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [toast, toastDuration, isSuccessState]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;

    if (name === "sede") {
      setFormData({ ...formData, sede: value, nivel: "", grado: "" });
    } else if (name === "nivel") {
      setFormData({ ...formData, nivel: value, grado: "" });
    } else if (name === "tieneOpcion") {
      setFormData({
        ...formData,
        tieneOpcion: value,
        detalleOpcion: value === "Si" ? formData.detalleOpcion : "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleNumberInput = (e: React.FormEvent<HTMLInputElement>, maxLength: number): void => {
    const input = e.currentTarget;
    const numericValue = input.value.replace(/\D/g, "").slice(0, maxLength);
    setFormData({ ...formData, [input.name]: numericValue });
  };

  // Validaciones duales: Generales (si falta todo) o Específicas (si falta un campo)
  const handleNextStep = () => {
    setToast(null);

    if (currentStep === 1) {
      const emptyAll = !formData.nombresEstudiante.trim() && !formData.apellidosEstudiante.trim() && !formData.dniEstudiante.trim();
      if (emptyAll) {
        setToastDuration(7000);
        setToast({ type: "error", message: "Por favor, completa todos los campos obligatorios" });
        return;
      }
      if (!formData.nombresEstudiante.trim()) {
        setToastDuration(7000);
        setToast({ type: "error", message: "Falta rellenar el campo 'Nombres del Estudiante'." });
        return;
      }
      if (!formData.apellidosEstudiante.trim()) {
        setToastDuration(7000);
        setToast({ type: "error", message: "Falta rellenar el campo 'Apellidos del Estudiante'." });
        return;
      }
      if (!formData.dniEstudiante.trim()) {
        setToastDuration(7000);
        setToast({ type: "error", message: "Falta rellenar el campo 'DNI del Estudiante'." });
        return;
      }
      if (!/^\d{8}$/.test(formData.dniEstudiante)) {
        setToastDuration(7000);
        setToast({ type: "error", message: "El campo 'DNI del Estudiante' debe contener exactamente 8 dígitos numéricos." });
        return;
      }
    }

    if (currentStep === 2) {
      const emptyAll = !formData.sede && !formData.nivel && !formData.grado;
      if (emptyAll) {
        setToastDuration(7000);
        setToast({ type: "error", message: "Por favor, selecciona la Sede, Nivel y Grado académico." });
        return;
      }
      if (!formData.sede) {
        setToastDuration(7000);
        setToast({ type: "error", message: "Falta seleccionar el campo 'Sede de Postulación'." });
        return;
      }
      if (!formData.nivel) {
        setToastDuration(7000);
        setToast({ type: "error", message: "Falta seleccionar el campo 'Nivel de Estudio'." });
        return;
      }
      if (!formData.grado) {
        setToastDuration(7000);
        setToast({ type: "error", message: "Falta seleccionar el campo 'Grado al que postula'." });
        return;
      }
    }

    if (currentStep === 3) {
      const emptyAll = !formData.nombresApoderado.trim() && !formData.tieneOpcion;
      if (emptyAll) {
        setToastDuration(7000);
        setToast({ type: "error", message: "Por favor, completa los datos del apoderado y la procedencia escolar." });
        return;
      }
      if (!formData.nombresApoderado.trim()) {
        setToastDuration(7000);
        setToast({ type: "error", message: "Falta rellenar el campo 'Datos Completos del Apoderado'." });
        return;
      }
      if (!formData.tieneOpcion) {
        setToastDuration(7000);
        setToast({ type: "error", message: "Falta indicar si vienes de otro colegio (Selecciona Sí o No)." });
        return;
      }
      if (formData.tieneOpcion === "Si" && !formData.detalleOpcion.trim()) {
        setToastDuration(7000);
        setToast({ type: "error", message: "Falta rellenar el campo 'De qué Institución Vienes'." });
        return;
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setToast(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const isFormComplete =
    formData.nombresEstudiante.trim() !== "" &&
    formData.apellidosEstudiante.trim() !== "" &&
    /^\d{8}$/.test(formData.dniEstudiante) &&
    formData.sede !== "" &&
    formData.nivel !== "" &&
    formData.grado !== "" &&
    formData.nombresApoderado.trim() !== "" &&
    formData.tieneOpcion !== "" &&
    (formData.tieneOpcion !== "Si" || formData.detalleOpcion.trim() !== "") &&
    /^9\d{8}$/.test(formData.telefono);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!formData.telefono.trim()) {
      setToastDuration(7000);
      setToast({ type: "error", message: "Falta rellenar el campo 'Teléfono / Celular'." });
      return;
    }
    if (!/^9\d{8}$/.test(formData.telefono)) {
      setToastDuration(7000);
      setToast({ type: "error", message: "El campo 'Teléfono / Celular' debe ser un número peruano válido de 9 dígitos." });
      return;
    }

    if (!isFormComplete) {
      setToastDuration(7000);
      setToast({ type: "error", message: "Hay campos obligatorios pendientes por completar en los pasos anteriores." });
      return;
    }

    setLoading(true);
    setToast(null);

    const finalEmail = emailUser.trim() ? `${emailUser.trim()}${emailDomain}` : "";
    const payload = { ...formData, email: finalEmail };

    try {
      const res = await fetch("http://localhost:4000/api/matricula-inscripcion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        setToastDuration(10000);
        setIsSuccessState(true);
        setToast({ type: "success", message: "¡Inscripción enviada con éxito! Nos pondremos en contacto contigo." });
        
        setFormData({
          sede: "",
          nombresEstudiante: "",
          apellidosEstudiante: "",
          dniEstudiante: "",
          nivel: "",
          grado: "",
          nombresApoderado: "",
          telefono: "",
          email: "",
          mensaje: "",
          tieneOpcion: "",
          detalleOpcion: "",
        });
        setEmailUser("");
        setEmailDomain("@gmail.com");
      } else {
        setToastDuration(7000);
        setIsSuccessState(false);
        setToast({ type: "error", message: result.error || "Ocurrió un error al enviar el formulario." });
      }
    } catch {
      setToastDuration(7000);
      setIsSuccessState(false);
      setToast({ type: "error", message: "Error de red al conectar con el servidor." });
    } finally {
      setLoading(false);
    }
  };

  const nivelesDisponibles = formData.sede === "Cayros School" ? ["Inicial"] : formData.sede === "Colegio Cayros" ? ["Inicial", "Primaria", "Secundaria"] : [];
  const gradosActuales = formData.nivel ? GRADOS_POR_NIVEL[formData.nivel] || [] : [];

  const stepLabels = ["Estudiante", "Académico", "Apoderado", "Contacto"];

  return (
    <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6 sm:p-8 relative overflow-hidden">
      
      {/* --- PROGRESS STEPS BAR --- */}
      <div className="mb-8 px-2">
        <div className="flex items-center justify-between relative max-w-sm mx-auto">
          <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-slate-200 -z-0" />
          <div 
            className="absolute left-8 top-1/2 -translate-y-1/2 h-1 bg-blue-600 transition-all duration-300 -z-0"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />

          {[1, 2, 3, 4].map((step) => {
            const isCompleted = currentStep > step;
            const isCurrent = currentStep === step;

            return (
              <div
                key={step}
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs relative z-10 transition-all duration-300 ${
                  isCompleted
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : isCurrent
                    ? "bg-blue-600 text-white ring-4 ring-blue-600/20 shadow-lg shadow-blue-600/30"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-3 max-w-sm mx-auto text-center">
          {stepLabels.map((label, idx) => (
            <span key={idx} className={currentStep >= idx + 1 ? "text-blue-600" : ""}>
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 mb-1">
        <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
        <h2 className="text-xl font-bold text-slate-900">
          {currentStep === 1 && "Paso 1: Datos del Estudiante"}
          {currentStep === 2 && "Paso 2: Sede - Académico"}
          {currentStep === 3 && "Paso 3: Datos del Apoderado"}
          {currentStep === 4 && "Paso 4: Contactos - Consulta"}
        </h2>
      </div>
      <p className="text-xs text-slate-500 mb-6 pl-4">
        {currentStep === 1 && "Ingresa los nombres, apellidos y DNI del alumno a matricular."}
        {currentStep === 2 && "Selecciona la sede institucional, el nivel de estudio y el grado."}
        {currentStep === 3 && "Completa la información del apoderado responsable y procedencia."}
        {currentStep === 4 && "Indica el teléfono de contacto, correo y comentarios finales."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* ================= STEP 1 ================= */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Nombres del Estudiante</label>
              <input
                type="text"
                name="nombresEstudiante"
                value={formData.nombresEstudiante}
                onChange={handleChange}
                required
                placeholder="Jesus Smith"
                className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none font-medium"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Apellidos del Estudiante</label>
              <input
                type="text"
                name="apellidosEstudiante"
                value={formData.apellidosEstudiante}
                onChange={handleChange}
                required
                placeholder="Pérez Gómez"
                className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none font-medium"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">DNI del Estudiante (8 dígitos)</label>
              <input
                type="text"
                name="dniEstudiante"
                maxLength={8}
                value={formData.dniEstudiante}
                onChange={(e) => handleNumberInput(e, 8)}
                required
                placeholder="74839201"
                className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none font-medium"
              />
            </div>
          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Sede de Postulación</label>
              <select
                name="sede"
                value={formData.sede}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none font-medium cursor-pointer"
              >
                <option value="">Seleccionar Sede</option>
                <option value="Colegio Cayros">Colegio Cayros</option>
                <option value="Cayros School">Cayros School</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Nivel de Estudio</label>
              <select
                name="nivel"
                value={formData.nivel}
                onChange={handleChange}
                disabled={!formData.sede}
                required
                className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none font-medium transition-all ${
                  !formData.sede
                    ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
                    : "bg-slate-50 text-slate-800 border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 cursor-pointer"
                }`}
              >
                <option value="">Seleccionar Nivel</option>
                {nivelesDisponibles.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Grado al que postula</label>
              <select
                name="grado"
                value={formData.grado}
                onChange={handleChange}
                disabled={!formData.nivel}
                required
                className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none font-medium transition-all ${
                  !formData.nivel
                    ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
                    : "bg-slate-50 text-slate-800 border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 cursor-pointer"
                }`}
              >
                <option value="">Seleccionar Grado</option>
                {gradosActuales.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* ================= STEP 3 ================= */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Datos Completos del Apoderado</label>
              <input
                type="text"
                name="nombresApoderado"
                value={formData.nombresApoderado}
                onChange={handleChange}
                required
                placeholder="Juan Carlos Martinez"
                className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none font-medium"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  ¿Vienes de Otro Colegio? <span className="text-rose-500">*Obligatorio</span>
                </label>
                <select
                  name="tieneOpcion"
                  value={formData.tieneOpcion}
                  onChange={handleChange}
                  required
                  className="w-full bg-white text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 outline-none font-medium cursor-pointer"
                >
                  <option value="">Seleccionar (Sí / No)</option>
                  <option value="Si">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  ¿De qué Institución Vienes? {formData.tieneOpcion === "Si" && <span className="text-rose-500">*Obligatorio</span>}
                </label>
                <input
                  type="text"
                  name="detalleOpcion"
                  value={formData.detalleOpcion}
                  onChange={handleChange}
                  disabled={formData.tieneOpcion !== "Si"}
                  required={formData.tieneOpcion === "Si"}
                  placeholder={formData.tieneOpcion === "Si" ? "Colegio José Pardo y Barreda" : "Deshabilitado (Selecciona 'Sí' si provienes de otro colegio)"}
                  className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none font-medium transition-all ${
                    formData.tieneOpcion !== "Si"
                      ? "bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed opacity-60"
                      : "bg-white text-slate-800 border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 4 ================= */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Teléfono / Celular (9 dígitos)</label>
              <input
                type="text"
                name="telefono"
                maxLength={9}
                value={formData.telefono}
                onChange={(e) => handleNumberInput(e, 9)}
                required
                placeholder="987654321"
                className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Correo Electrónico (Opcional)</label>
              <div className="flex rounded-xl border border-slate-200 bg-slate-50 focus-within:border-amber-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-500/10 overflow-hidden">
                <input
                  type="text"
                  value={emailUser}
                  onChange={(e) => setEmailUser(e.target.value)}
                  placeholder="juan.perez"
                  className="w-1/2 bg-transparent text-slate-800 text-xs px-3.5 py-2.5 outline-none font-medium"
                />
                <select
                  value={emailDomain}
                  onChange={(e) => setEmailDomain(e.target.value)}
                  className="w-1/2 bg-slate-100 text-slate-700 text-xs px-3 py-2.5 border-l border-slate-200 outline-none font-semibold cursor-pointer"
                >
                  <option value="@gmail.com">@gmail.com</option>
                  <option value="@hotmail.com">@hotmail.com</option>
                  <option value="@outlook.com">@outlook.com</option>
                  <option value="@yahoo.com">@yahoo.com</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Mensaje o Comentarios (Opcional)</label>
              <textarea
                name="mensaje"
                rows={3}
                value={formData.mensaje}
                onChange={handleChange}
                placeholder="Deseo información sobre las vacantes de la matrícula y horarios..."
                className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none font-medium resize-none"
              />
            </div>
          </div>
        )}

        {/* --- BOTONES DE NAVEGACIÓN --- */}
        <div className="flex items-center justify-between pt-4">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="py-2.5 px-5 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 transition-all cursor-pointer flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="py-2.5 px-6 rounded-xl text-xs font-bold bg-[#16275D] hover:bg-blue-900 text-white transition-all shadow-md cursor-pointer flex items-center gap-2 ml-auto"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading || !isFormComplete}
              className={`py-3 px-6 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 ml-auto ${
                isFormComplete && !loading
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 cursor-pointer"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed opacity-70 shadow-none"
              }`}
              title={!isFormComplete ? "Completa todos los campos requeridos para habilitar el envío" : "Enviar pre-inscripción"}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Enviar Solicitud de Matrícula</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>

        {/* --- TOAST DINÁMICO (GENERAL O ESPECÍFICO) CON BARRA DE PROGRESO --- */}
        {toast && (
          <div
            className={`mt-4 rounded-xl overflow-hidden transition-all duration-300 border ${
              toast.type === "success" 
                ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
          >
            <div className="p-4 flex items-center gap-3 text-xs font-semibold">
              {toast.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
              )}
              <span>{toast.message}</span>
            </div>

            <div className={`w-full h-1.5 ${toast.type === "success" ? "bg-emerald-200" : "bg-rose-200"}`}>
              <div 
                className={`h-full transition-all duration-100 ease-linear ${toast.type === "success" ? "bg-emerald-600" : "bg-rose-600"}`}
                style={{ width: `${toastProgress}%` }}
              />
            </div>
          </div>
        )}

      </form>
    </div>
  );
}