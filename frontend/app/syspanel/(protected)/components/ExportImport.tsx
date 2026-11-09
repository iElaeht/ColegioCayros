// frontend/components/syspanel/ExportImportModal.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { Upload, Download, FileSpreadsheet, X, ArrowLeftRight, FileText, CheckCircle2, Loader2 } from "lucide-react";

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, unknown>[];
  filename: string;
  onImportData?: (importedJson: Record<string, unknown>[]) => Promise<void> | void;
}

export default function ExportImportModal({
  isOpen,
  onClose,
  title,
  data,
  filename,
  onImportData,
}: ExportImportModalProps) {
  const [exportFormat, setExportFormat] = useState<"xlsx" | "csv">("xlsx");
  const [customFilename, setCustomFilename] = useState(filename);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState<boolean>(false);

  // Restablecer el estado base del modal cada vez que se abre o cierra
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setCustomFilename(filename);
      setSelectedFile(null);
      setIsImporting(false);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, filename]);

  // Cálculo dinámico estimado del peso y tamaño del archivo a exportar
  const estimatedExportInfo = useMemo(() => {
    if (!data || data.length === 0) return { count: 0, sizeText: "0 KB" };

    const jsonString = JSON.stringify(data);
    let estimatedBytes = jsonString.length * (exportFormat === "xlsx" ? 1.4 : 0.8);
    if (estimatedBytes < 1024) estimatedBytes = 1024;

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(estimatedBytes) / Math.log(k));
    const formattedSize = parseFloat((estimatedBytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];

    return {
      count: data.length,
      sizeText: formattedSize,
    };
  }, [data, exportFormat]);

  if (!isOpen) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Lógica de Exportación Profesional con Estilos para Excel
  const handleExport = () => {
    if (!data || data.length === 0) {
      alert("No hay datos disponibles para exportar.");
      return;
    }

    const finalName = customFilename.trim() || filename;

    if (exportFormat === "xlsx") {
      const formattedData = data.map((item) => {
        const newItem: Record<string, unknown> = {};
        Object.keys(item).forEach((key) => {
          const upperKey = key.toUpperCase();
          newItem[upperKey] = item[key];
        });
        return newItem;
      });

      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();

      const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
      const colWidths: { wch: number }[] = [];
      for (let C = range.s.c; C <= range.e.c; ++C) {
        let maxWidth = 10;
        for (let R = range.s.r; R <= range.e.r; ++R) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          const cell = worksheet[cellAddress];
          if (cell && cell.v) {
            const cellLength = String(cell.v).length;
            if (cellLength > maxWidth) maxWidth = cellLength;
          }
        }
        colWidths.push({ wch: maxWidth + 4 });
      }
      worksheet["!cols"] = colWidths;

      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!worksheet[cellAddress]) continue;

        worksheet[cellAddress].s = {
          font: { bold: true, color: { rgb: "FFFFFF" }, name: "Calibri", sz: 11 },
          fill: { fgColor: { rgb: "16275D" } },
          alignment: { horizontal: "center", vertical: "center" }
        };
      }

      XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
      XLSX.writeFile(workbook, `${finalName}.xlsx`);
    } else {
      const formattedData = data.map((item) => {
        const newItem: Record<string, unknown> = {};
        Object.keys(item).forEach((key) => {
          newItem[key.toUpperCase()] = item[key];
        });
        return newItem;
      });

      const csv = Papa.unparse(formattedData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${finalName}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  };

  // Función auxiliar para normalizar las llaves importadas
  const normalizeImportedData = (rawRows: Record<string, unknown>[]) => {
    return rawRows.map((row) => {
      const normalizedRow: Record<string, unknown> = {};
      Object.keys(row).forEach((key) => {
        const cleanKey = key.trim().toLowerCase();
        normalizedRow[cleanKey] = row[key];
      });
      return normalizedRow;
    });
  };

  // Procesar Importación con barra de carga y manejo asíncrono
  const handleConfirmImport = async () => {
    if (!selectedFile) return;

    setIsImporting(true);
    const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();

    if (fileExtension === "csv") {
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const cleanedData = normalizeImportedData(results.data as Record<string, unknown>[]);
          if (onImportData) {
            await onImportData(cleanedData);
          }
          setIsImporting(false);
          onClose();
        },
        error: (err) => {
          console.error("Error al parsear CSV:", err);
          setIsImporting(false);
          alert("Error al leer el archivo CSV.");
        }
      });
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const bstr = evt.target?.result;
          const wb = XLSX.read(bstr, { type: "binary" });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const dataJson = XLSX.utils.sheet_to_json(ws);
          const cleanedData = normalizeImportedData(dataJson as Record<string, unknown>[]);
          if (onImportData) {
            await onImportData(cleanedData);
          }
          setIsImporting(false);
          onClose();
        } catch (error) {
          console.error("Error al leer Excel:", error);
          setIsImporting(false);
          alert("Error al procesar el archivo Excel.");
        }
      };
      reader.readAsBinaryString(selectedFile);
    } else {
      setIsImporting(false);
      alert("Por favor, selecciona un archivo válido .csv o .xlsx");
    }
  };

  return (
    <div className="fixed inset-0 z-[999999] min-h-screen w-full flex items-center justify-center bg-black/70 backdrop-blur-xs select-none p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in-95 duration-150 my-auto">
        
        {/* Botón Cerrar (Deshabilitado si está cargando) */}
        {!isImporting && (
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer outline-none p-1"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Cabecera del Modal */}
        <div className="flex items-center gap-3 mb-6 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-[#16275d]/10 flex items-center justify-center text-[#16275d] shrink-0">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#111c38] font-['Poppins',sans-serif]">
              {title}
            </h3>
            <p className="text-xs text-gray-500">
              Exporta tus reportes personalizados o importa registros masivamente.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* SECCIÓN EXPORTAR */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#16275d] uppercase tracking-wider">
                <Download className="w-4 h-4 text-amber-500" />
                Exportar Registros
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Nombre del archivo:</label>
                <input
                  type="text"
                  value={customFilename}
                  onChange={(e) => setCustomFilename(e.target.value)}
                  placeholder="Reporte, Registro, etc."
                  disabled={isImporting}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#16275d]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Formato:</label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as "xlsx" | "csv")}
                  disabled={isImporting}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-[#16275d]"
                >
                  <option value="xlsx">Excel (.xlsx)</option>
                  <option value="csv">CSV (.csv)</option>
                </select>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Registros: <strong className="text-slate-800">{estimatedExportInfo.count}</strong></span>
                <span className="text-slate-500 font-medium">Peso Est.: <strong className="text-amber-600 font-bold">{estimatedExportInfo.sizeText}</strong></span>
              </div>
            </div>

            <button
              onClick={handleExport}
              disabled={isImporting}
              className="w-full bg-[#16275d] hover:bg-blue-900 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-sm cursor-pointer outline-none flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-amber-400" />
              Descargar Archivo
            </button>
          </div>

          {/* SECCIÓN IMPORTAR */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#16275d] uppercase tracking-wider">
                <Upload className="w-4 h-4 text-amber-500" />
                Importar Archivo
              </div>

              {/* Si está importando, mostramos barra/spinner de carga interactiva */}
              {isImporting ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center space-y-3">
                  <Loader2 className="w-8 h-8 text-[#16275d] animate-spin" />
                  <div className="text-center">
                    <p className="text-xs font-bold text-slate-800">Procesando datos...</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Guardando registros en la base de datos</p>
                  </div>
                </div>
              ) : !selectedFile ? (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-[#16275d] rounded-2xl p-6 cursor-pointer bg-white transition-colors group">
                  <FileSpreadsheet className="w-8 h-8 text-slate-400 group-hover:text-[#16275d] mb-2 transition-colors" />
                  <span className="text-xs font-semibold text-slate-700 text-center">Seleccionar archivo</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">.xlsx, .xls o .csv</span>
                  <input 
                    type="file" 
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                    onChange={handleFileChange} 
                    className="hidden" 
                  />
                </label>
              ) : (
                <div className="bg-white border border-blue-200 rounded-2xl p-3.5 space-y-2.5 relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="p-2 rounded-xl bg-blue-50 text-[#16275d] shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-800 truncate" title={selectedFile.name}>
                          {selectedFile.name}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium">
                          Peso: <span className="text-amber-600 font-bold">{formatFileSize(selectedFile.size)}</span>
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedFile(null)}
                      className="text-gray-400 hover:text-rose-500 transition-colors shrink-0 cursor-pointer"
                      title="Cambiar archivo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Listo para procesar
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleConfirmImport}
              disabled={!selectedFile || isImporting}
              className={`w-full font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-sm outline-none flex items-center justify-center gap-2 ${
                selectedFile && !isImporting
                  ? "bg-amber-400 hover:bg-amber-500 text-[#111c38] cursor-pointer" 
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              {isImporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Importando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Procesar Importación
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}