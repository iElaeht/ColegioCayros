// frontend/app/syspanel/(protected)/galeria/components/home-config/CustomDatePicker.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, X, ChevronDown } from "lucide-react";

interface CustomDatePickerProps {
  selectedDate: string;
  onChange: (date: string) => void;
}

type ViewMode = "days" | "months" | "years";

export default function CustomDatePicker({ selectedDate, onChange }: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("days");
  const [yearPageStart, setYearPageStart] = useState(2020);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setViewMode("days");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "Filtrar por fecha";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthsNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const handlePrev = () => {
    if (viewMode === "days") {
      setCurrentMonth(new Date(year, month - 1, 1));
    } else if (viewMode === "months") {
      setCurrentMonth(new Date(year - 1, month, 1));
    } else if (viewMode === "years") {
      setYearPageStart(yearPageStart - 12);
    }
  };

  const handleNext = () => {
    if (viewMode === "days") {
      setCurrentMonth(new Date(year, month + 1, 1));
    } else if (viewMode === "months") {
      setCurrentMonth(new Date(year + 1, month, 1));
    } else if (viewMode === "years") {
      setYearPageStart(yearPageStart + 12);
    }
  };

  const handleSelectDay = (day: number) => {
    const formattedMonth = String(month + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const dateString = `${year}-${formattedMonth}-${formattedDay}`;
    onChange(dateString);
    setIsOpen(false);
    setViewMode("days");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setIsOpen(false);
    setViewMode("days");
  };

  const openYearsView = () => {
    setYearPageStart(Math.floor(year / 12) * 12);
    setViewMode("years");
  };

  return (
    <div className="relative w-full sm:w-auto" ref={containerRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setViewMode("days");
        }}
        className={`w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2.5 pl-3.5 pr-3 py-2 border rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[#6eb5ec]/20 ${
          selectedDate
            ? "bg-[#6eb5ec]/10 border-[#6eb5ec]/40 text-[#16275d]"
            : "bg-slate-50/80 hover:bg-slate-50 border-slate-200/90 text-slate-500"
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <Calendar className={`w-4 h-4 shrink-0 ${selectedDate ? "text-[#6eb5ec]" : "text-slate-400"}`} />
          <span className={`font-medium truncate ${selectedDate ? "text-[#16275d]" : "text-slate-500"}`}>
            {formatDisplayDate(selectedDate)}
          </span>
        </div>
        {selectedDate && (
          <span
            onClick={handleClear}
            className="p-0.5 hover:bg-slate-200/60 rounded-full text-[#6eb5ec] hover:text-[#16275d] transition-colors ml-1 shrink-0"
            title="Limpiar fecha"
          >
            <X className="w-3.5 h-3.5" />
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-full sm:w-72 bg-white border-2 border-slate-200 rounded-2xl shadow-2xl z-50 p-4 animate-in fade-in zoom-in-95 duration-150">
          
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1">
              {viewMode === "days" && (
                <>
                  <button
                    type="button"
                    onClick={() => setViewMode("months")}
                    className="text-xs font-bold text-slate-800 hover:text-[#6eb5ec] transition-colors flex items-center gap-1 px-1.5 py-1 rounded-lg hover:bg-slate-100 cursor-pointer uppercase"
                  >
                    {monthsNames[month]} <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={openYearsView}
                    className="text-xs font-bold text-slate-800 hover:text-[#6eb5ec] transition-colors flex items-center gap-1 px-1.5 py-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                  >
                    {year} <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </>
              )}

              {viewMode === "months" && (
                <button
                  type="button"
                  onClick={openYearsView}
                  className="text-xs font-bold text-slate-800 hover:text-[#6eb5ec] transition-colors flex items-center gap-1 px-1.5 py-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  Año: {year} <ChevronDown className="w-3.5 h-3.5" />
                </button>
              )}

              {viewMode === "years" && (
                <span className="text-xs font-bold text-slate-800 px-1.5 py-1 uppercase">
                  Selecciona un año
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrev}
                className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors cursor-pointer border border-slate-200/60"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors cursor-pointer border border-slate-200/60"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {viewMode === "days" && (
            <>
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"].map((d) => (
                  <span key={d} className="text-[11px] font-semibold text-slate-400">
                    {d}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {Array.from({ length: startDayIndex }).map((_, index) => (
                  <div key={`empty-${index}`} />
                ))}

                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1;
                  const formattedMonth = String(month + 1).padStart(2, "0");
                  const formattedDay = String(day).padStart(2, "0");
                  const dateString = `${year}-${formattedMonth}-${formattedDay}`;
                  const isSelected = selectedDate === dateString;

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleSelectDay(day)}
                      className={`h-8 w-8 mx-auto flex items-center justify-center text-xs rounded-xl font-medium transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#6eb5ec] text-white shadow-sm font-bold"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {viewMode === "months" && (
            <div className="grid grid-cols-3 gap-2 py-2">
              {monthsNames.map((mName, idx) => (
                <button
                  key={mName}
                  type="button"
                  onClick={() => {
                    setCurrentMonth(new Date(year, idx, 1));
                    setViewMode("days");
                  }}
                  className={`py-2.5 text-xs rounded-xl font-medium transition-all cursor-pointer ${
                    month === idx
                      ? "bg-[#6eb5ec] text-white font-bold shadow-sm"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {mName.slice(0, 3)}
                </button>
              ))}
            </div>
          )}

          {viewMode === "years" && (
            <div className="grid grid-cols-3 gap-2 py-2">
              {Array.from({ length: 12 }).map((_, i) => {
                const targetYear = yearPageStart + i;
                return (
                  <button
                    key={targetYear}
                    type="button"
                    onClick={() => {
                      setCurrentMonth(new Date(targetYear, month, 1));
                      setViewMode("months");
                    }}
                    className={`py-2.5 text-xs rounded-xl font-medium transition-all cursor-pointer ${
                      year === targetYear
                        ? "bg-[#6eb5ec] text-white font-bold shadow-sm"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {targetYear}
                  </button>
                );
              })}
            </div>
          )}

          {selectedDate && (
            <div className="mt-3 pt-3 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                  setViewMode("days");
                }}
                className="text-xs text-rose-500 hover:text-rose-600 font-semibold transition-colors cursor-pointer"
              >
                Quitar filtro de fecha
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}