// components/dashboard/MonthlyGoalsSection.tsx
"use client";

import { useState, useMemo } from "react";
import { useRegistro } from "@/lib/contexts/RegistroContext";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { getLicenciadosActivos } from "@/lib/helpers";

export function MonthlyGoalsSection() {
  const { filteredRegistros } = useRegistro();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState<"monthly" | "yearly">("monthly");

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const years = Array.from(
    { length: 3 },
    (_, i) => new Date().getFullYear() - 2 + i,
  );

  // ✅ Filtrar registros del mes/año seleccionado
  const monthlyRegistros = useMemo(() => {
    return filteredRegistros.filter((r) => {
      const [year, month] = r.fecha.split("-").map(Number);
      return month === selectedMonth && year === selectedYear;
    });
  }, [filteredRegistros, selectedMonth, selectedYear]);

  // ✅ Calcular métricas AUTOMÁTICAS por profesional
  const metricsByProfessional = useMemo(() => {
    const metrics: Record<
      string,
      {
        total: number;
        exitosos: number;
        fallidos: number;
        pacientesUnicos: number;
        tasaExito: number;
        checklistCumplido: number;
        incidencias: number;
      }
    > = {};

    // Inicializar con todos los profesionales
    getLicenciadosActivos().forEach((prof) => {
      metrics[prof] = {
        total: 0,
        exitosos: 0,
        fallidos: 0,
        pacientesUnicos: 0,
        tasaExito: 0,
        checklistCumplido: 0,
        incidencias: 0,
      };
    });

    // Calcular métricas desde los registros
    monthlyRegistros.forEach((registro) => {
      const prof = registro.profesionalACargo;
      if (!prof || !metrics[prof]) return;

      metrics[prof].total++;

      if (registro.resultado === "Exitoso") {
        metrics[prof].exitosos++;
      }
      if (registro.resultado === "Fallido") {
        metrics[prof].fallidos++;
      }
      if (registro.checklistCumplido) {
        metrics[prof].checklistCumplido++;
      }
      if (registro.incidencias) {
        metrics[prof].incidencias++;
      }
    });

    // Calcular pacientes únicos y tasas
    getLicenciadosActivos().forEach((prof) => {
      const registrosProf = monthlyRegistros.filter(
        (r) => r.profesionalACargo === prof,
      );
      metrics[prof].pacientesUnicos = new Set(
        registrosProf.map((r) => r.dni),
      ).size;

      // ✅ FÓRMULA AUTOMÁTICA: (Exitosos / Total) × 100
      metrics[prof].tasaExito =
        metrics[prof].total > 0
          ? Math.round((metrics[prof].exitosos / metrics[prof].total) * 100)
          : 0;

      metrics[prof].checklistCumplido =
        metrics[prof].total > 0
          ? Math.round(
              (metrics[prof].checklistCumplido / metrics[prof].total) * 100,
            )
          : 0;
    });

    return metrics;
  }, [monthlyRegistros]);

  // ✅ Métricas anuales (sin depender de monthlyGoals)
  const yearlyRegistros = useMemo(() => {
    return filteredRegistros.filter((r) => {
      const [year] = r.fecha.split("-").map(Number);
      return year === selectedYear;
    });
  }, [filteredRegistros, selectedYear]);

  const yearlyResults = {
    total: yearlyRegistros.length,
    exitosos: yearlyRegistros.filter((r) => r.resultado === "Exitoso").length,
    fallidos: yearlyRegistros.filter((r) => r.resultado === "Fallido").length,
    pacientesUnicos: new Set(yearlyRegistros.map((r) => r.dni)).size,
    conIncidencias: yearlyRegistros.filter((r) => r.incidencias).length,
    checklistCumplimiento:
      yearlyRegistros.length > 0
        ? Math.round(
            (yearlyRegistros.filter((r) => r.checklistCumplido).length /
              yearlyRegistros.length) *
              100,
          )
        : 0,
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      {/* View Mode Toggle & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={viewMode === "monthly" ? "default" : "outline"}
            onClick={() => setViewMode("monthly")}
            className="h-9 text-sm px-3"
          >
            Por Mes
          </Button>
          <Button
            variant={viewMode === "yearly" ? "default" : "outline"}
            onClick={() => setViewMode("yearly")}
            className="h-9 text-sm px-3"
          >
            Por Año
          </Button>
        </div>

        {viewMode === "monthly" && (
          <div className="flex gap-2">
            <Select
              value={selectedMonth.toString()}
              onValueChange={(v) => setSelectedMonth(parseInt(v))}
            >
              <SelectTrigger className="w-28 h-9 text-xs">
                <SelectValue placeholder="Mes" />
              </SelectTrigger>
              <SelectContent className="text-xs">
                {months.map((month, idx) => (
                  <SelectItem key={idx} value={(idx + 1).toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedYear.toString()}
              onValueChange={(v) => setSelectedYear(parseInt(v))}
            >
              <SelectTrigger className="w-20 h-9 text-xs">
                <SelectValue placeholder="Año" />
              </SelectTrigger>
              <SelectContent className="text-xs">
                {years.map((year, idx) => (
                  <SelectItem
                    key={`year-monthly-${idx}`}
                    value={year.toString()}
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {viewMode === "yearly" && (
          <Select
            value={selectedYear.toString()}
            onValueChange={(v) => setSelectedYear(parseInt(v))}
          >
            <SelectTrigger className="w-20 h-9 text-xs">
              <SelectValue placeholder="Año" />
            </SelectTrigger>
            <SelectContent className="text-xs">
              {years.map((year, idx) => (
                <SelectItem key={`year-yearly-${idx}`} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Monthly View - CÁLCULO AUTOMÁTICO */}
      {viewMode === "monthly" && (
        <div className="space-y-4">
          <div className="text-xs text-muted-foreground">
            {months[selectedMonth - 1]} {selectedYear} •{" "}
            {monthlyRegistros.length} registros
          </div>

          {monthlyRegistros.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-xs text-muted-foreground">
                No hay registros para este mes
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {getLicenciadosActivos().map((prof) => {
                const metrics = metricsByProfessional[prof];

                // Solo mostrar si tiene registros
                if (metrics.total === 0) return null;

                return (
                  <Card key={prof} className="p-4 space-y-3">
                    <h3 className="font-semibold text-sm text-foreground">
                      {prof}
                    </h3>

                    {/* ✅ TASA DE ÉXITO (CÁLCULO AUTOMÁTICO) */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-muted-foreground">
                          Tasa de Éxito
                        </p>
                        <p className="text-xs font-semibold">
                          {metrics.tasaExito}%
                        </p>
                      </div>
                      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getProgressColor(metrics.tasaExito)} transition-all`}
                          style={{ width: `${metrics.tasaExito}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {metrics.exitosos} exitosos de {metrics.total}{" "}
                        procedimientos
                      </p>
                    </div>

                    {/* Pacientes Atendidos */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-muted-foreground">
                          Pacientes
                        </p>
                        <p className="text-xs font-semibold">
                          {metrics.pacientesUnicos}
                        </p>
                      </div>
                    </div>

                    {/* Checklist Cumplido */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-muted-foreground">
                          Checklist
                        </p>
                        <p className="text-xs font-semibold">
                          {metrics.checklistCumplido}%
                        </p>
                      </div>
                      <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getProgressColor(metrics.checklistCumplido)} transition-all`}
                          style={{ width: `${metrics.checklistCumplido}%` }}
                        />
                      </div>
                    </div>

                    {/* Fallidos e Incidencias */}
                    {(metrics.fallidos > 0 || metrics.incidencias > 0) && (
                      <div className="flex gap-3 text-[10px]">
                        {metrics.fallidos > 0 && (
                          <span className="text-red-600">
                            <AlertTriangle className="w-3 h-3 inline mr-1" />
                            {metrics.fallidos} fallidos
                          </span>
                        )}
                        {metrics.incidencias > 0 && (
                          <span className="text-yellow-600">
                            {metrics.incidencias} incidencias
                          </span>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Yearly View */}
      {viewMode === "yearly" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Card className="p-3 bg-primary/5 border-primary/20">
            <p className="text-[10px] text-muted-foreground mb-1">
              Total Proc.
            </p>
            <p className="text-lg font-bold text-foreground">
              {yearlyResults.total}
            </p>
          </Card>

          <Card className="p-3 bg-blue-500/5 border-blue-500/20">
            <p className="text-[10px] text-muted-foreground mb-1">Pacientes</p>
            <p className="text-lg font-bold text-foreground">
              {yearlyResults.pacientesUnicos}
            </p>
          </Card>

          <Card className="p-3 bg-green-500/5 border-green-500/20">
            <p className="text-[10px] text-muted-foreground mb-1">Exitosos</p>
            <p className="text-lg font-bold text-foreground">
              {yearlyResults.exitosos}
            </p>
          </Card>

          <Card className="p-3 bg-yellow-500/5 border-yellow-500/20">
            <p className="text-[10px] text-muted-foreground mb-1">
              Incidencias
            </p>
            <p className="text-lg font-bold text-foreground">
              {yearlyResults.conIncidencias}
            </p>
          </Card>

          <Card className="p-3 bg-red-500/5 border-red-500/20">
            <p className="text-[10px] text-muted-foreground mb-1">Fallidos</p>
            <p className="text-lg font-bold text-foreground">
              {yearlyResults.fallidos}
            </p>
          </Card>

          <Card className="p-3 bg-teal-500/5 border-teal-500/20">
            <p className="text-[10px] text-muted-foreground mb-1">Checklist</p>
            <p className="text-lg font-bold text-foreground">
              {yearlyResults.checklistCumplimiento}%
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
