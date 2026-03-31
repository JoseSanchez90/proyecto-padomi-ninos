"use client";

import { ChartsGrid } from "@/components/dashboard/ChartsGrid";
import { RegistroFilters } from "@/components/dashboard/RegistroFilters";
import { useRegistro } from "@/lib/contexts/RegistroContext";

export default function GraficosPage() {
  const { filteredRegistros } = useRegistro();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl 2xl:text-3xl font-bold text-foreground">
          Gráficos y Análisis
        </h1>
        <p className="text-xs 2xl:text-sm text-muted-foreground">
          Visualice datos y tendencias de procedimientos
        </p>
      </div>

      {/* Filters */}
      <RegistroFilters />

      {/* Info Card */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <p className="text-sm text-foreground">
          Mostrando <strong>{filteredRegistros.length}</strong> registro
          {filteredRegistros.length !== 1 ? "s" : ""} con los filtros aplicados
        </p>
      </div>

      {/* Charts */}
      <ChartsGrid />
    </div>
  );
}
