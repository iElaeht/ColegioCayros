// frontend/app/syspanel/(protected)/eventos/components/grid/EventGrid.tsx
import { CalendarDays, Plus } from "lucide-react";
import EventCard from "./EventCard";
import EventFilters, { SortOption } from "./EventFilters";
import EventPagination from "./EventPagination";

interface EventItem {
  id: number;
  src: string;
  alt: string;
  isActive: boolean;
  createdAt?: string;
}

interface EventGridProps {
  images: EventItem[];
  onToggleStatus: (id: number) => void;
  onOpenEdit: (item: EventItem) => void;
  onDelete: (id: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  onOpenCreate: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export default function EventGrid({
  images,
  onToggleStatus,
  onOpenEdit,
  searchQuery,
  onSearchChange,
  selectedDate,
  onDateChange,
  sortOption,
  onSortChange,
  onOpenCreate,
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: EventGridProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-6 w-full">
      {/* Barra superior unificada: Filtros + Botón Nuevo Evento */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 w-full">
        <div className="flex-1 w-full">
          <EventFilters
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            selectedDate={selectedDate}
            onDateChange={onDateChange}
            sortOption={sortOption}
            onSortChange={onSortChange}
          />
        </div>

        {/* Botón de Nuevo Evento */}
        <button
          type="button"
          onClick={onOpenCreate}
          style={{ borderColor: "#F8DE32" }}
          className="w-full xl:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#F8DE32] text-slate-900 text-xs font-bold px-5 py-3 rounded-xl border-2 shadow-xs transition-all cursor-pointer shrink-0 group truncate"
        >
          <Plus className="w-4 h-4 text-slate-900 stroke-[2.5] shrink-0" />
          <span className="truncate">Nuevo Evento</span>
        </button>
      </div>

      {/* Contenido del Grid o Estado Vacío */}
      {images.length === 0 ? (
        <div className="text-center py-16 sm:py-20 px-4 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <CalendarDays className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div className="space-y-1">
            <p className="text-slate-800 text-sm font-bold">
              No hay eventos registrados todavía
            </p>
            <p className="text-slate-400 text-xs font-medium">
              Sube un nuevo evento usando el botón superior.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 items-start">
          {images.map((item) => (
            <div key={item.id} className="w-full">
              <EventCard
                item={item}
                onToggleStatus={onToggleStatus}
                onOpenEdit={onOpenEdit}
              />
            </div>
          ))}
        </div>
      )}

      {/* Componente de Paginación */}
      <div className="w-full pt-2">
        <EventPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
}