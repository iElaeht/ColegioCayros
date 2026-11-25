"use client";

import React, { useState, useEffect, useCallback } from "react";
import MatriculaConfigForm, { MatriculaConfig } from "./components/MatriculaConfigForm";
import MatriculaGalleryConfig, { MatriculaGaleriaItem } from "./components/MatriculaGalleryConfig";
import ToastAlert from "../components/ToastAlert";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const defaultConfig: MatriculaConfig = {
  year: "2026",
  badgeText: "MATRÍCULAS",
  title: "MATRÍCULAS ABIERTAS",
  description: "Quiero empezar la matrícula y conocer los requisitos del proceso.",
  buttonText: "Ver pasos y requisitos",
  linkUrl: "/matricula",
  isActive: true,
};

export default function CartelMatriculaPage() {
  const [form, setForm] = useState<MatriculaConfig>(defaultConfig);
  const [initialForm, setInitialForm] = useState<MatriculaConfig>(defaultConfig);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);

  const [slides, setSlides] = useState<MatriculaGaleriaItem[]>([]);
  const [loadingSlides, setLoadingSlides] = useState(true);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    document.title = "Cartel de Matrícula | Colegio Cayros";
  }, []);

  const fetchConfig = useCallback(async () => {
    setLoadingConfig(true);
    try {
      const res = await fetch(`${API_URL}/api/admision-config?t=${Date.now()}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        const loadedConfig: MatriculaConfig = {
          year: data.year || "2026",
          badgeText: data.badgeText || "MATRÍCULAS",
          title: data.title || "MATRÍCULAS ABIERTAS",
          description: data.description || "",
          buttonText: data.buttonText || "Ver pasos y requisitos",
          linkUrl: data.linkUrl || "/matricula",
          isActive: data.isActive ?? true,
        };
        setForm(loadedConfig);
        setInitialForm(loadedConfig);
      }
    } catch (error) {
      console.error("Error al cargar configuración de matrícula:", error);
      setToast({ message: "Error al cargar la configuración del cartel.", type: "error" });
    } finally {
      setLoadingConfig(false);
    }
  }, []);

  const fetchGaleria = useCallback(async () => {
    setLoadingSlides(true);
    try {
      const res = await fetch(`${API_URL}/api/matricula-galeria/admin?t=${Date.now()}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setSlides(data);
      }
    } catch (err) {
      console.error("Error al cargar galería de matrículas:", err);
      setToast({ message: "Error al conectar con el servidor.", type: "error" });
    } finally {
      setLoadingSlides(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
    fetchGaleria();
  }, [fetchConfig, fetchGaleria]);

  const hasChanges = JSON.stringify(form) !== JSON.stringify(initialForm);

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUndoConfig = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    setForm(initialForm);
    setToast(null);
  };

  const handleSubmitConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    setToast(null);

    try {
      const res = await fetch(`${API_URL}/api/admision-config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error al guardar la configuración");

      setInitialForm(form);
      setToast({ message: "¡Configuración actualizada con éxito!", type: "success" });
    } catch (error) {
      console.error(error);
      setToast({ message: "Hubo un error al guardar los cambios.", type: "error" });
    } finally {
      setSavingConfig(false);
    }
  };

  const handleSaveSlot = async ({
    order,
    title,
    file,
    existingId,
  }: {
    order: number;
    title: string;
    file: File | null;
    existingId?: number;
  }): Promise<boolean> => {
    const formData = new FormData();
    if (file) {
      formData.append("imageFile", file);
    }
    formData.append("title", title);
    formData.append("order", String(order));

    try {
      const url = existingId
        ? `${API_URL}/api/matricula-galeria/${existingId}`
        : `${API_URL}/api/matricula-galeria`;
      const method = existingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        setToast({ message: "Imagen guardada correctamente en el carrusel.", type: "success" });
        await fetchGaleria();
        return true;
      }

      const errorData = await res.json().catch(() => ({}));
      setToast({ message: errorData.error || "Error al guardar la imagen.", type: "error" });
      return false;
    } catch (err) {
      console.error("Error de red:", err);
      setToast({ message: "Error de red al procesar la solicitud.", type: "error" });
      return false;
    }
  };

  const handleToggleActive = async (id: number, currentActive: boolean) => {
    try {
      const res = await fetch(`${API_URL}/api/matricula-galeria/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentActive }),
      });
      if (res.ok) {
        setSlides((prev) =>
          prev.map((s) => (s.id === id ? { ...s, isActive: !currentActive } : s))
        );
        setToast({ message: "Estado de la imagen actualizado.", type: "success" });
      }
    } catch (err) {
      console.error("Error al alternar estado:", err);
      setToast({ message: "Error al actualizar el estado de la imagen.", type: "error" });
    }
  };

  const handleDeleteSlot = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/matricula-galeria/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSlides((prev) => prev.filter((s) => s.id !== id));
        setToast({ message: "Espacio vaciado con éxito.", type: "success" });
      }
    } catch (err) {
      console.error("Error al eliminar:", err);
      setToast({ message: "Error al intentar eliminar la imagen.", type: "error" });
    }
  };

  return (
    <div className="p-4 sm:p-8 lg:p-10 space-y-8 sm:space-y-10 max-w-7xl mx-auto select-none">
      <div className="border-b border-slate-200/80 pb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#16275d] tracking-tight">
          Cartel de Matrícula
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
          Configura el banner informativo y las imágenes del carrusel en tiempo real.
        </p>
      </div>

      {loadingConfig ? (
        <div className="text-slate-600 text-sm p-6">Cargando configuración...</div>
      ) : (
        <MatriculaConfigForm
          form={form}
          hasChanges={hasChanges}
          saving={savingConfig}
          onChange={handleConfigChange}
          onUndo={handleUndoConfig}
          onSubmit={handleSubmitConfig}
        />
      )}

      <div className="pt-6 border-t border-slate-200/80">
        <MatriculaGalleryConfig
          slides={slides}
          loading={loadingSlides}
          onSaveSlot={handleSaveSlot}
          onToggleActive={handleToggleActive}
          onDeleteSlot={handleDeleteSlot}
        />
      </div>

      {toast && (
        <ToastAlert
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}