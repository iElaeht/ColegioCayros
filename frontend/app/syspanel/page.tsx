"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, User, HelpCircle, X, Phone, Mail, MapPin, Eye, EyeOff } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    dni: "",
    password: "",
  });

  const [errorDni, setErrorDni] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    try {
      const token = sessionStorage.getItem("sys_token");
      if (token) {
        router.replace("/syspanel/dashboard");
      }
    } catch {
      // Ignorar errores de almacenamiento en contextos restringidos
    }
  }, [router]);

  useEffect(() => {
    document.title = "Login | Colegio Cayros";
  }, []);

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload();
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "dni") setErrorDni("");
    if (name === "password") setErrorPassword("");
    setGeneralError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorDni("");
    setErrorPassword("");
    setGeneralError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dni: formData.dni.trim(),
          password: formData.password,
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        setGeneralError("El servidor no respondió en el formato esperado.");
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setErrorPassword(data.error || "Credenciales incorrectas.");
        setLoading(false);
        return;
      }

      try {
        sessionStorage.clear();
        sessionStorage.setItem("sys_token", "active_session");
        sessionStorage.setItem("admin_user", JSON.stringify(data.usuario));
        document.cookie = "sys_token=active_session; path=/; max-age=86400; SameSite=Lax";
      } catch {
        // Continuar con la redirección aunque el almacenamiento local falle
      }

      window.location.href = "/syspanel/dashboard";
    } catch {
      setGeneralError("No se pudo establecer conexión con el servidor.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-['Poppins',sans-serif] relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-sm w-full bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-7 border border-slate-700/80 relative z-10">
        <div className="text-center flex flex-col items-center mb-5">
          <div className="relative w-14 h-14 mb-2 flex items-center justify-center drop-shadow-md">
            <Image
              src="/images/ui/Cayros-logo.png"
              alt="Colegio Cayros Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="w-2.5 h-2.5 bg-yellow-400 inline-block mb-1 rounded-full animate-pulse" />
          <h1 className="text-xl font-extrabold text-white tracking-wide">
            INTRANET CAYROS
          </h1>
          <p className="text-slate-400 text-[11px] mt-0.5 font-medium">
            Acceso autorizado - Colegio Cayros
          </p>
        </div>

        {generalError && (
          <div className="mb-3.5 p-2.5 bg-red-900/40 border border-red-500/50 text-red-200 text-xs rounded-xl text-center font-medium">
            {generalError}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              DNI de Administrador
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                placeholder="Ingresa tu DNI"
                required
                disabled={loading}
                className={`w-full bg-slate-900 text-white text-xs pl-10 pr-3.5 py-3 rounded-xl border outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  errorDni
                    ? "border-red-500"
                    : "border-slate-700 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20"
                }`}
              />
            </div>
            {errorDni && (
              <p className="text-red-400 text-[11px] mt-1 font-medium pl-1">{errorDni}</p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Contraseña
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                disabled={loading}
                className={`w-full bg-slate-900 text-white text-xs pl-10 pr-10 py-3 rounded-xl border outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  errorPassword
                    ? "border-red-500"
                    : "border-slate-700 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errorPassword && (
              <p className="text-red-400 text-[11px] mt-1 font-medium pl-1">{errorPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-yellow-400/10 transition-all cursor-pointer mt-2 flex items-center justify-center gap-2 outline-none ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Acceder al Sistema</span>
            )}
          </button>
        </form>

        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="text-xs text-slate-400 hover:text-yellow-400 transition-colors inline-flex items-center gap-1.5 font-medium cursor-pointer outline-none"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>¿Olvidaste tus credenciales?</span>
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[99999] overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-700 w-full max-w-md overflow-hidden my-auto flex flex-col p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-yellow-400/10 flex items-center justify-center text-yellow-400">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white tracking-tight">
                    Soporte Administrativo
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Recuperación de acceso institucional
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors cursor-pointer outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-300">
              <p className="leading-relaxed font-medium">
                Si no recuerdas tus credenciales de acceso o presentas inconvenientes con tu cuenta,
                comunícate con el área administrativa acercándote a la institución o a través de los
                siguientes canales oficiales:
              </p>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-slate-500">
                      Ubicación
                    </span>
                    <span className="font-semibold text-slate-200 text-xs">
                      Chincha Alta, Ica - Perú
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-slate-500">
                      Teléfono / Celular de Soporte
                    </span>
                    <span className="font-semibold text-slate-200 text-xs">
                      (+51) 956 411 538 (Datos de prueba)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-slate-500">
                      Correo Electrónico
                    </span>
                    <span className="font-semibold text-slate-200 text-xs">
                      soporte@colegiocayros.edu.pe
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 italic text-center">
                Nota: Estos datos son de prueba/testeo y serán actualizados próximamente.
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer outline-none border border-slate-700"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}