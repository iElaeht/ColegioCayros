"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  CreditCard,
  KeyRound,
  Lock,
  Info,
  RotateCcw,
} from "lucide-react";

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

interface CredencialesPagoGeneradas {
  codigoPago: string;
  passwordPago: string;
  estado?: string;
}

interface MatriculaFormStepsProps {
  onIrAPagos?: (credenciales: CredencialesPagoGeneradas | null) => void;
  onIrAConsultarCredenciales?: () => void;
}

const GRADOS_POR_NIVEL: Record<string, string[]> = {
  Inicial: ["3 Años", "4 Años", "5 Años"],
  Primaria: ["1er Grado", "2do Grado", "3er Grado", "4to Grado", "5to Grado", "6to Grado"],
  Secundaria: ["1er Año", "2do Año", "3er Año", "4to Año", "5to Año"],
};

const CAMPOS_MAYUSCULAS = new Set([
  "nombresEstudiante",
  "apellidosEstudiante",
  "nombresApoderado",
  "detalleOpcion",
  "mensaje",
]);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function MatriculaFormSteps({
  onIrAPagos,
  onIrAConsultarCredenciales,
}: MatriculaFormStepsProps) {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 5;

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

  const [credencialesPago, setCredencialesPago] = useState<CredencialesPagoGeneradas | null>(null);
  const [copiadoCampo, setCopiadoCampo] = useState<"codigo" | "password" | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [verificandoDni, setVerificandoDni] = useState<boolean>(false);
  const [dniDuplicadoDetectado, setDniDuplicadoDetectado] = useState<boolean>(false);

  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [toastProgress, setToastProgress] = useState<number>(100);
  const [toastDuration, setToastDuration] = useState<number>(7000);

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
          return 100;
        }
        return prev - decrement;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [toast, toastDuration]);

  const verificarDniRegistrado = async (dni: string): Promise<boolean> => {
    if (!/^\d{8}$/.test(dni)) return false;
    try {
      const res = await fetch(
        `${API_URL}/api/matricula-inscripcion/verificar-dni?dni=${encodeURIComponent(dni)}&t=${Date.now()}`,
        { cache: "no-store" }
      );
      if (!res.ok) return false;
      const data = await res.json();
      return Boolean(data?.existe);
    } catch {
      return false;
    }
  };

  // Verificación en vivo mientras se escribe un DNI de 8 dígitos (sin recargar)
  useEffect(() => {
    if (currentStep !== 1 || !/^\d{8}$/.test(formData.dniEstudiante)) {
      setDniDuplicadoDetectado(false);
      return;
    }

    let cancelado = false;
    const timeout = setTimeout(async () => {
      const yaExiste = await verificarDniRegistrado(formData.dniEstudiante);
      if (cancelado) return;
      if (yaExiste) {
        setDniDuplicadoDetectado(true);
        setToastDuration(9000);
        setToast({
          type: "error",
          message:
            "Este DNI ya está registrado en el sistema. Si olvidaste tus datos, puedes ir a Consultar Credenciales.",
        });
      }
    }, 350);

    return () => {
      cancelado = true;
      clearTimeout(timeout);
    };
  }, [formData.dniEstudiante, currentStep]);

  const reiniciarRegistro = () => {
    setCredencialesPago(null);
    setCopiadoCampo(null);
    setDniDuplicadoDetectado(false);
    setToast(null);
    setCurrentStep(1);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    const valorNormalizado = CAMPOS_MAYUSCULAS.has(name) ? value.toUpperCase() : value;

    if (name === "sede") {
      setFormData({ ...formData, sede: valorNormalizado, nivel: "", grado: "" });
    } else if (name === "nivel") {
      setFormData({ ...formData, nivel: valorNormalizado, grado: "" });
    } else if (name === "tieneOpcion") {
      setFormData({
        ...formData,
        tieneOpcion: valorNormalizado,
        detalleOpcion: valorNormalizado === "Si" ? formData.detalleOpcion : "",
      });
    } else {
      setFormData({ ...formData, [name]: valorNormalizado });
    }
  };

  const handleNumberInput = (e: React.FormEvent<HTMLInputElement>, maxLength: number): void => {
    const input = e.currentTarget;
    const numericValue = input.value.replace(/\D/g, "").slice(0, maxLength);
    if (input.name === "dniEstudiante") {
      setDniDuplicadoDetectado(false);
    }
    setFormData({ ...formData, [input.name]: numericValue });
  };

  const handleNextStep = async () => {
    setToast(null);
    setDniDuplicadoDetectado(false);

    if (currentStep === 1) {
      const emptyAll =
        !formData.nombresEstudiante.trim() &&
        !formData.apellidosEstudiante.trim() &&
        !formData.dniEstudiante.trim();
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
        setToast({
          type: "error",
          message: "El campo 'DNI del Estudiante' debe contener exactamente 8 dígitos numéricos.",
        });
        return;
      }

      setVerificandoDni(true);
      try {
        const yaExiste = await verificarDniRegistrado(formData.dniEstudiante);
        if (yaExiste) {
          setDniDuplicadoDetectado(true);
          setToastDuration(9000);
          setToast({
            type: "error",
            message:
              "Este DNI ya se encuentra registrado en el sistema. Si olvidaste tus datos de acceso, puedes consultar tus credenciales.",
          });
          return;
        }
      } finally {
        setVerificandoDni(false);
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
        setToast({
          type: "error",
          message: "Por favor, completa los datos del apoderado y la procedencia escolar.",
        });
        return;
      }
      if (!formData.nombresApoderado.trim()) {
        setToastDuration(7000);
        setToast({
          type: "error",
          message: "Falta rellenar el campo 'Datos Completos del Apoderado'.",
        });
        return;
      }
      if (!formData.tieneOpcion) {
        setToastDuration(7000);
        setToast({
          type: "error",
          message: "Falta indicar si vienes de otro colegio (Selecciona Sí o No).",
        });
        return;
      }
      if (formData.tieneOpcion === "Si" && !formData.detalleOpcion.trim()) {
        setToastDuration(7000);
        setToast({
          type: "error",
          message: "Falta rellenar el campo 'De qué Institución Vienes'.",
        });
        return;
      }
    }

    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setToast(null);
    if (currentStep > 1 && currentStep <= 4) {
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
      setToast({
        type: "error",
        message: "El campo 'Teléfono / Celular' debe ser un número peruano válido de 9 dígitos.",
      });
      return;
    }

    if (!isFormComplete) {
      setToastDuration(7000);
      setToast({
        type: "error",
        message: "Hay campos obligatorios pendientes por completar en los pasos anteriores.",
      });
      return;
    }

    setLoading(true);
    setToast(null);

    const yaExisteAlEnviar = await verificarDniRegistrado(formData.dniEstudiante);
    if (yaExisteAlEnviar) {
      setLoading(false);
      setCurrentStep(1);
      setDniDuplicadoDetectado(true);
      setToastDuration(9000);
      setToast({
        type: "error",
        message:
          "Este DNI ya fue registrado en el sistema. Si olvidaste tus datos, ve a Consultar Credenciales.",
      });
      return;
    }

    const finalEmail = emailUser.trim() ? `${emailUser.trim().toLowerCase()}${emailDomain}` : "";
    const payload = {
      ...formData,
      nombresEstudiante: formData.nombresEstudiante.trim().toUpperCase(),
      apellidosEstudiante: formData.apellidosEstudiante.trim().toUpperCase(),
      nombresApoderado: formData.nombresApoderado.trim().toUpperCase(),
      detalleOpcion: formData.detalleOpcion.trim().toUpperCase(),
      mensaje: formData.mensaje.trim().toUpperCase(),
      email: finalEmail,
    };

    try {
      const res = await fetch(`${API_URL}/api/matricula-inscripcion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        setCredencialesPago(result.credencialesPago || null);
        setCurrentStep(5);

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
      } else if (res.status === 409) {
        setCurrentStep(1);
        setDniDuplicadoDetectado(true);
        setToastDuration(9000);
        setToast({
          type: "error",
          message:
            result.error ||
            "Este DNI ya se encuentra registrado en el sistema. Si olvidaste tus datos, usa Consultar Credenciales.",
        });
      } else {
        setToastDuration(7000);
        setToast({
          type: "error",
          message: result.error || "Ocurrió un error al enviar el formulario.",
        });
      }
    } catch {
      setToastDuration(7000);
      setToast({ type: "error", message: "Error de red al conectar con el servidor." });
    } finally {
      setLoading(false);
    }
  };

  const copiarAlPortapapeles = async (texto: string, tipo: "codigo" | "password") => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiadoCampo(tipo);
      setTimeout(() => {
        setCopiadoCampo((prev) => (prev === tipo ? null : prev));
      }, 2000);
    } catch {
      setToastDuration(5000);
      setToast({
        type: "error",
        message: "No se pudo copiar automáticamente. Cópialo de forma manual.",
      });
    }
  };

  const handleIrAPagosClick = () => {
    if (onIrAPagos) {
      onIrAPagos(credencialesPago);
    }
    router.push("/pagos-institucional");
  };

  const nivelesDisponibles =
    formData.sede === "Cayros School"
      ? ["Inicial"]
      : formData.sede === "Colegio Cayros"
      ? ["Inicial", "Primaria", "Secundaria"]
      : [];
  const gradosActuales = formData.nivel ? GRADOS_POR_NIVEL[formData.nivel] || [] : [];

  const stepLabels = ["Estudiante", "Académico", "Apoderado", "Contacto", "Pagos"];

  return (
    <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6 sm:p-8 relative overflow-hidden">
      <div className="mb-8 px-2">
        <div className="flex items-center justify-between relative max-w-md mx-auto">
          <div className="absolute left-5 right-5 top-1/2 -translate-y-1/2 h-1 bg-slate-200 -z-0" />
          <div
            className="absolute left-5 top-1/2 -translate-y-1/2 h-1 bg-blue-600 transition-all duration-300 -z-0"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />

          {[1, 2, 3, 4, 5].map((step) => {
            const isCompleted = currentStep > step || (step === 5 && currentStep === 5);
            const isCurrent = currentStep === step;

            return (
              <div
                key={step}
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs relative z-10 transition-all duration-300 ${
                  isCurrent
                    ? "bg-emerald-600 text-white ring-4 ring-emerald-600/20 shadow-lg shadow-emerald-600/30"
                    : isCompleted
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {step === 5 ? (
                  <CreditCard className="w-4 h-4" />
                ) : currentStep > step ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  step
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-3 max-w-md mx-auto text-center">
          {stepLabels.map((label, idx) => (
            <span
              key={idx}
              className={
                currentStep === idx + 1
                  ? idx + 1 === 5
                    ? "text-emerald-600 font-extrabold"
                    : "text-blue-600 font-extrabold"
                  : currentStep > idx + 1
                  ? "text-blue-600"
                  : ""
              }
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 mb-1">
        <div
          className={`w-1.5 h-6 rounded-full ${
            currentStep === 5 ? "bg-emerald-500" : "bg-amber-500"
          }`}
        />
        <h2 className="text-xl font-bold text-slate-900">
          {currentStep === 1 && "Paso 1: Datos del Estudiante"}
          {currentStep === 2 && "Paso 2: Sede - Académico"}
          {currentStep === 3 && "Paso 3: Datos del Apoderado"}
          {currentStep === 4 && "Paso 4: Contactos - Consulta"}
          {currentStep === 5 && "Paso 5: Pagos y Credenciales"}
        </h2>
      </div>
      <p className="text-xs text-slate-500 mb-6 pl-4">
        {currentStep === 1 && "Ingresa los nombres, apellidos y DNI del alumno a matricular."}
        {currentStep === 2 && "Selecciona la sede institucional, el nivel de estudio y el grado."}
        {currentStep === 3 && "Completa la información del apoderado responsable y procedencia."}
        {currentStep === 4 && "Indica el teléfono de contacto, correo y comentarios finales."}
        {currentStep === 5 &&
          "Guarda tus credenciales exclusivas para continuar el proceso de pago."}
      </p>

      {currentStep < 5 ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Nombres del Estudiante
                </label>
                <input
                  type="text"
                  name="nombresEstudiante"
                  value={formData.nombresEstudiante}
                  onChange={handleChange}
                  required
                  placeholder="JESUS SMITH"
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none font-medium uppercase"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Apellidos del Estudiante
                </label>
                <input
                  type="text"
                  name="apellidosEstudiante"
                  value={formData.apellidosEstudiante}
                  onChange={handleChange}
                  required
                  placeholder="PÉREZ GÓMEZ"
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none font-medium uppercase"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  DNI del Estudiante (8 dígitos)
                </label>
                <input
                  type="text"
                  name="dniEstudiante"
                  maxLength={8}
                  value={formData.dniEstudiante}
                  onChange={(e) => handleNumberInput(e, 8)}
                  required
                  placeholder="XXXXXXXX"
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none font-medium"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Sede de Postulación
                </label>
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
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Nivel de Estudio
                </label>
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
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Grado al que postula
                </label>
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
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Datos Completos del Apoderado
                </label>
                <input
                  type="text"
                  name="nombresApoderado"
                  value={formData.nombresApoderado}
                  onChange={handleChange}
                  required
                  placeholder="JUAN CARLOS MARTINEZ"
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none font-medium uppercase"
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
                    ¿De qué Institución Vienes?{" "}
                    {formData.tieneOpcion === "Si" && <span className="text-rose-500">*Obligatorio</span>}
                  </label>
                  <input
                    type="text"
                    name="detalleOpcion"
                    value={formData.detalleOpcion}
                    onChange={handleChange}
                    disabled={formData.tieneOpcion !== "Si"}
                    required={formData.tieneOpcion === "Si"}
                    placeholder={
                      formData.tieneOpcion === "Si"
                        ? "COLEGIO JOSÉ PARDO Y BARREDA"
                        : "DESHABILITADO (SELECCIONA 'SÍ' SI PROVIENES DE OTRO COLEGIO)"
                    }
                    className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none font-medium transition-all ${
                      formData.tieneOpcion !== "Si"
                        ? "bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed opacity-60"
                        : "bg-white text-slate-800 border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 uppercase"
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Teléfono / Celular (9 dígitos)
                </label>
                <input
                  type="text"
                  name="telefono"
                  maxLength={9}
                  value={formData.telefono}
                  onChange={(e) => handleNumberInput(e, 9)}
                  required
                  placeholder="XXXXXXXXX"
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Correo Electrónico (Opcional)
                </label>
                <div className="flex rounded-xl border border-slate-200 bg-slate-50 focus-within:border-amber-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-500/10 overflow-hidden">
                  <input
                    type="text"
                    value={emailUser}
                    onChange={(e) => setEmailUser(e.target.value.toUpperCase())}
                    placeholder="JUAN.PEREZ"
                    className="w-1/2 bg-transparent text-slate-800 text-xs px-3.5 py-2.5 outline-none font-medium uppercase"
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
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Mensaje o Comentarios (Opcional)
                </label>
                <textarea
                  name="mensaje"
                  rows={3}
                  value={formData.mensaje}
                  onChange={handleChange}
                  placeholder="DESEO INFORMACIÓN SOBRE LAS VACANTES DE LA MATRÍCULA Y HORARIOS..."
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none font-medium resize-none uppercase"
                />
              </div>
            </div>
          )}

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

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                disabled={verificandoDni || (currentStep === 1 && dniDuplicadoDetectado)}
                className="py-2.5 px-6 rounded-xl text-xs font-bold bg-[#16275D] hover:bg-blue-900 disabled:opacity-60 text-white transition-all shadow-md cursor-pointer flex items-center gap-2 ml-auto"
              >
                {verificandoDni ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verificando DNI...</span>
                  </>
                ) : (
                  <>
                    <span>Siguiente</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
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
                title={
                  !isFormComplete
                    ? "Completa todos los campos requeridos para habilitar el envío"
                    : "Enviar solicitud de matrícula"
                }
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
        </form>
      ) : (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-bold text-emerald-950">
                Tu Matrícula se ha completado, y Brevemente sera revisado por Coordinación
              </p>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Aquí tienes tu ID único exclusivo para Pagos y tu contraseña de acceso para continuar el proceso.
              </p>
            </div>
          </div>

          {credencialesPago ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3.5">
              <div className="flex items-center justify-between gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <KeyRound className="w-3 h-3 text-[#16275D]" /> ID Único para Pagos
                  </span>
                  <p className="font-mono font-bold text-xs sm:text-sm text-[#111c38] truncate">
                    {credencialesPago.codigoPago}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => copiarAlPortapapeles(credencialesPago.codigoPago, "codigo")}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#16275D] hover:text-white text-slate-700 text-[11px] font-bold transition-colors cursor-pointer shrink-0"
                >
                  {copiadoCampo === "codigo" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-[#16275D]" /> Contraseña del Trámite
                  </span>
                  <p className="font-mono font-bold text-xs sm:text-sm text-[#111c38] truncate">
                    {credencialesPago.passwordPago}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => copiarAlPortapapeles(credencialesPago.passwordPago, "password")}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#16275D] hover:text-white text-slate-700 text-[11px] font-bold transition-colors cursor-pointer shrink-0"
                >
                  {copiadoCampo === "password" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
              La inscripción se registró correctamente. Si necesitas consultar tus credenciales, comunícate con administración.
            </div>
          )}

          <div className="bg-amber-50 border border-amber-300/90 rounded-2xl p-4 space-y-1 text-xs text-amber-950">
            <p className="font-bold text-amber-900">Nota importante</p>
            <p className="leading-relaxed">
              Es necesario que recuerdes y guardes tus <strong>Datos para Pagos</strong> (ID Único y
              Contraseña), ya que los necesitarás para ingresar a{" "}
              <strong>Pagos Institucional</strong>, subir tu comprobante y hacer seguimiento de tu
              matrícula.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-1.5 text-xs text-slate-600">
            <p className="font-bold text-[#111c38] flex items-center gap-1.5">
              <Info className="w-4 h-4 text-[#16275D] shrink-0" />
              <span>¿Qué sigue en tu proceso?</span>
            </p>
            <p className="leading-relaxed pl-5">
              Entra al menú <strong className="text-slate-800">Inscripciones &gt; Pagos Institucional</strong> con tu ID y contraseña para
              ver las cuentas, subir tu voucher y hacer seguimiento (en revisión, observado por 48h o confirmado).
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={reiniciarRegistro}
              className="py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Nueva matrícula</span>
            </button>

            <button
              type="button"
              onClick={handleIrAPagosClick}
              className="py-2.5 px-5 rounded-xl text-xs font-bold bg-[#16275D] hover:bg-blue-900 text-white transition-all shadow-sm cursor-pointer flex items-center gap-2 ml-auto"
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              <span>Ir a Pagos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div
          className={`mt-4 rounded-xl overflow-hidden transition-all duration-300 border ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          <div className="p-4 flex items-start justify-between gap-3 text-xs font-semibold">
            <div className="flex items-start gap-3">
              {toast.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              )}
              <div className="space-y-2">
                <span>{toast.message}</span>
                {dniDuplicadoDetectado && onIrAConsultarCredenciales && (
                  <div>
                    <button
                      type="button"
                      onClick={onIrAConsultarCredenciales}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16275D] hover:bg-blue-900 text-white text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                      <span>Consultar Credenciales</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            className={`w-full h-1.5 ${
              toast.type === "success" ? "bg-emerald-200" : "bg-rose-200"
            }`}
          >
            <div
              className={`h-full transition-all duration-100 ease-linear ${
                toast.type === "success" ? "bg-emerald-600" : "bg-rose-600"
              }`}
              style={{ width: `${toastProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}