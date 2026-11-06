"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

  // Título dinámico de la pestaña para mayor discreción y profesionalismo
  useEffect(() => {
    document.title = "Login | Colegio Cayros";
  }, []);

  // Control seguro para evitar problemas de caché al retroceder en el navegador
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
      const response = await fetch("http://localhost:4000/api/auth/login", {
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
        localStorage.setItem("sys_token", "active_session");
        localStorage.setItem("admin_user", JSON.stringify(data.usuario));
        document.cookie =
          "sys_token=active_session; path=/; max-age=86400; SameSite=Lax";
      } catch (storageErr) {
        // Ignora silenciosamente
      }

      router.push("/syspanel/dashboard");
      router.refresh();
    } catch (err) {
      setGeneralError("No se pudo establecer conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-['Poppins',sans-serif]">
      {/* Reducido a max-w-sm para que la tarjeta sea más compacta y centrada */}
      <div className="max-w-sm w-full bg-slate-800 rounded-2xl shadow-2xl p-6 border border-slate-700">
        <div className="text-center flex flex-col items-center mb-5">
          <div className="mb-2 flex items-center justify-center drop-shadow-md">
            <Image
              src="/images/ui/Cayros-logo.png"
              alt="Colegio Cayros Logo"
              width={60}
              height={60}
              className="object-contain"
              priority
            />
          </div>
          <span className="w-2.5 h-2.5 bg-yellow-400 inline-block mb-1 rounded-full"></span>
          <h1 className="text-xl font-extrabold text-white tracking-wide">
            INTRANET CAYROS
          </h1>
          <p className="text-slate-400 text-[11px] mt-0.5">
            Acceso autorizado - Colegio Cayros
          </p>
        </div>

        {generalError && (
          <div className="mb-3 p-2.5 bg-red-900/40 border border-red-500/50 text-red-200 text-xs rounded-lg text-center">
            {generalError}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Input DNI */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              DNI de Administrador
            </label>
            <input
              type="text"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              placeholder="Ingresa tu DNI"
              required
              disabled={loading}
              className={`w-full bg-slate-900 text-white text-xs px-3.5 py-2.5 rounded-lg border outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                errorDni
                  ? "border-red-500"
                  : "border-slate-700 focus:border-yellow-400"
              }`}
            />
            {errorDni && (
              <p className="text-red-400 text-[11px] mt-1 font-medium">
                {errorDni}
              </p>
            )}
          </div>

          {/* Input Contraseña */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              disabled={loading}
              className={`w-full bg-slate-900 text-white text-xs px-3.5 py-2.5 rounded-lg border outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                errorPassword
                  ? "border-red-500"
                  : "border-slate-700 focus:border-yellow-400"
              }`}
            />
            {errorPassword && (
              <p className="text-red-400 text-[11px] mt-1 font-medium">
                {errorPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-950 text-xs font-bold rounded-lg shadow-md transition-all cursor-pointer mt-1 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Autenticando..." : "Acceder al Sistema"}
          </button>
        </form>
      </div>
    </div>
  );
}