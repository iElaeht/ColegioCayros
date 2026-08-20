"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    dni: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Evitar que el login se quede guardado en el BFCache del navegador al retroceder
  useEffect(() => {
    window.onpageshow = function (event) {
      if (event.persisted) {
        window.location.reload();
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dni: formData.dni.trim(),
          password: formData.password,
        }),
      });

      // Validar que la respuesta sea JSON para prevenir fallos de parseo
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("El servidor no respondió con un formato válido.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Credenciales incorrectas');
      }

      // Guardamos la sesión en el navegador y creamos la cookie para el Middleware
      localStorage.setItem('sys_token', 'active_session');
      localStorage.setItem('admin_user', JSON.stringify(data.usuario));
      document.cookie = "sys_token=active_session; path=/; max-age=86400; SameSite=Lax";

      // Redirigimos al dashboard y actualizamos el router
      router.push('/dashboard');
      router.refresh();

    } catch (err: any) {
      console.error("Error en autenticación:", err);
      setError(err.message || 'No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 font-['Poppins',sans-serif]">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
        
        <div className="text-center mb-8">
          <span className="w-3 h-3 bg-yellow-400 inline-block mb-2 rounded-full"></span>
          <h1 className="text-2xl font-extrabold text-white tracking-wide">SYS-PANEL</h1>
          <p className="text-slate-400 text-xs mt-1">Acceso de Gestión Interna - Colegio Cayros</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border-l-4 border-red-500 text-red-200 text-xs rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-2">DNI de Administrador</label>
            <input 
              type="text" 
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              placeholder="Ingresa tu DNI"
              required
              disabled={loading}
              className="w-full bg-slate-900 text-white text-sm px-4 py-3 rounded-lg border border-slate-700 outline-none focus:border-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-2">Contraseña</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              disabled={loading}
              className="w-full bg-slate-900 text-white text-sm px-4 py-3 rounded-lg border border-slate-700 outline-none focus:border-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-slate-950 text-sm font-bold rounded-lg shadow-md transition-all cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Autenticando...' : 'Acceder al Sistema'}
          </button>
        </form>

      </div>
    </div>
  );
}