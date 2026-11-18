// frontend/app/contactanos/components/ContactFormSteps.tsx
"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Send } from "lucide-react";

interface ContactFormData {
  dni: string;
  nombre: string;
  telefono: string;
  asunto: string;
}

export default function ContactFormSteps() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 2;

  const [formData, setFormData] = useState<ContactFormData>({
    dni: "",
    nombre: "",
    telefono: "",
    asunto: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Barra de progreso y temporizador (7s errores, 10s éxito)
  const [toastProgress, setToastProgress] = useState<number>(100);
  const [toastDuration, setToastDuration] = useState<number>(7000);
  const [isSuccessState, setIsSuccessState] = useState<boolean>(false);

  useEffect(() => {
    if (status === "idle") return;

    const intervalTime = 100;
    const decrement = (intervalTime / toastDuration) * 100;
    setToastProgress(100);

    const timer = setInterval(() => {
      setToastProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          setStatus("idle");
          setToastMessage("");
          if (isSuccessState) {
            setIsSuccessState(false);
            setCurrentStep(1); // Regresa al paso 1 al terminar el éxito
          }
          return 100;
        }
        return prev - decrement;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [status, toastDuration, isSuccessState]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Filtro numérico instantáneo para DNI y Teléfono
    if ((name === "dni" || name === "telefono") && !/^\d*$/.test(value)) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    setStatus("idle");
    setToastMessage("");

    if (currentStep === 1) {
      const emptyAll = !formData.dni.trim() && !formData.nombre.trim() && !formData.telefono.trim();
      if (emptyAll) {
        setToastDuration(7000);
        setToastType("error");
        setToastMessage("Por favor, completa todos los campos obligatorios.");
        setStatus("error");
        return;
      }
      if (!formData.dni.trim()) {
        setToastDuration(7000);
        setToastType("error");
        setToastMessage("Falta rellenar el campo 'DNI'.");
        setStatus("error");
        return;
      }
      if (formData.dni.length !== 8) {
        setToastDuration(7000);
        setToastType("error");
        setToastMessage("El campo 'DNI' debe contener exactamente 8 dígitos numéricos.");
        setStatus("error");
        return;
      }
      if (!formData.nombre.trim()) {
        setToastDuration(7000);
        setToastType("error");
        setToastMessage("Falta rellenar el campo 'Nombres y Apellidos'.");
        setStatus("error");
        return;
      }
      if (!formData.telefono.trim()) {
        setToastDuration(7000);
        setToastType("error");
        setToastMessage("Falta rellenar el campo 'Teléfono / Celular'.");
        setStatus("error");
        return;
      }
      if (formData.telefono.length !== 9 || !formData.telefono.startsWith("9")) {
        setToastDuration(7000);
        setToastType("error");
        setToastMessage("El campo 'Teléfono / Celular' debe ser un número celular peruano válido de 9 dígitos.");
        setStatus("error");
        return;
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setStatus("idle");
    setToastMessage("");
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const isFormComplete =
    formData.dni.length === 8 &&
    formData.nombre.trim() !== "" &&
    formData.telefono.length === 9 &&
    formData.asunto.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.asunto.trim()) {
      setToastDuration(7000);
      setToastType("error");
      setToastMessage("Falta rellenar el campo 'Asunto / Mensaje'.");
      setStatus("error");
      return;
    }

    if (!isFormComplete) {
      setToastDuration(7000);
      setToastType("error");
      setToastMessage("Hay campos obligatorios pendientes por completar en los pasos anteriores.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/mensajes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error();

      setToastDuration(10000); // 10 segundos para éxito
      setIsSuccessState(true);
      setToastType("success");
      setToastMessage("¡Mensaje enviado con éxito! Este formulario se reiniciará en unos segundos.");
      setStatus("success");
      setFormData({ dni: "", nombre: "", telefono: "", asunto: "" });
    } catch {
      setToastDuration(7000);
      setIsSuccessState(false);
      setToastType("error");
      setToastMessage("Error de red al conectar con el servidor.");
      setStatus("error");
    }
  };

  const stepLabels = ["Tus Datos", "Mensaje"];

  return (
    <div className="bg-white border border-gray-200/80 p-8 sm:p-10 rounded-3xl shadow-sm relative overflow-hidden">
      
      {/* --- PROGRESS STEPS BAR (2 PASOS) --- */}
      <div className="mb-8 px-2">
        <div className="flex items-center justify-between relative max-w-[200px] mx-auto">
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-200 -z-0" />
          <div 
            className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-blue-600 transition-all duration-300 -z-0"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />

          {[1, 2].map((step) => {
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

        <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-3 max-w-[220px] mx-auto text-center">
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
          {currentStep === 1 && "Paso 1: Datos de Contacto"}
          {currentStep === 2 && "Paso 2: Asunto y Mensaje"}
        </h2>
      </div>
      <p className="text-xs text-slate-500 mb-6 pl-4">
        {currentStep === 1 && "Ingresa tu DNI, nombres completos y teléfono celular de contacto."}
        {currentStep === 2 && "Escribe el motivo de tu consulta o mensaje para comunicarnos contigo."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* ================= STEP 1: DATOS ================= */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">DNI (8 dígitos)</label>
              <input 
                type="text" 
                name="dni" 
                inputMode="numeric" 
                maxLength={8} 
                value={formData.dni} 
                onChange={handleChange} 
                required 
                placeholder="77733344" 
                className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none font-medium" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">Nombres y Apellidos</label>
              <input 
                type="text" 
                name="nombre" 
                value={formData.nombre} 
                onChange={handleChange} 
                required 
                placeholder="Juan Carlos Martinez" 
                className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none font-medium" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">Teléfono / Celular (9 dígitos)</label>
              <input 
                type="tel" 
                name="telefono" 
                inputMode="numeric" 
                maxLength={9} 
                value={formData.telefono} 
                onChange={handleChange} 
                required 
                placeholder="999999999" 
                className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 outline-none font-medium" 
              />
            </div>
          </div>
        )}

        {/* ================= STEP 2: MENSAJE ================= */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">Asunto / Mensaje</label>
              <textarea 
                name="asunto" 
                rows={5} 
                value={formData.asunto} 
                onChange={handleChange} 
                required 
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
              disabled={status === "loading" || !isFormComplete}
              className={`py-3 px-6 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 ml-auto ${
                isFormComplete && status !== "loading"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 cursor-pointer"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed opacity-70 shadow-none"
              }`}
            >
              {status === "loading" ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Enviar Mensaje</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>

        {/* --- TOAST DINÁMICO CON BARRA DE PROGRESO --- */}
        {status !== "idle" && status !== "loading" && (
          <div
            className={`mt-4 rounded-xl overflow-hidden transition-all duration-300 border ${
              toastType === "success" 
                ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
          >
            <div className="p-4 flex items-center gap-3 text-xs font-semibold">
              {toastType === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
              )}
              <span>{toastMessage}</span>
            </div>

            <div className={`w-full h-1.5 ${toastType === "success" ? "bg-emerald-200" : "bg-rose-200"}`}>
              <div 
                className={`h-full transition-all duration-100 ease-linear ${toastType === "success" ? "bg-emerald-600" : "bg-rose-600"}`}
                style={{ width: `${toastProgress}%` }}
              />
            </div>
          </div>
        )}

      </form>
    </div>
  );
}