"use client";

import { useState } from "react";
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
import { TrendingUp } from "lucide-react";

export function MonthlyGoalsSection() {
  const { filteredRegistros, monthlyGoals } = useRegistro();
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

  // Obtener metas para el mes/año seleccionado
  const currentGoals = monthlyGoals.filter(
    (g) => g.mes === selectedMonth && g.ano === selectedYear,
  );

  // Calcular resultados actuales para el mes/año
  const monthlyRegistros = filteredRegistros.filter((r) => {
    const [year, month] = r.fecha.split("-").map(Number);
    return month === selectedMonth && year === selectedYear;
  });

  const actualResults = {
    pacientesAtendidos: new Set(monthlyRegistros.map((r) => r.dni)).size,
    procedimientosExitosos: monthlyRegistros.filter(
      (r) => r.resultado === "Exitoso",
    ).length,
    procedimientosFallidos: monthlyRegistros.filter(
      (r) => r.resultado === "Fallido",
    ).length,
    checklistCumplimiento:
      monthlyRegistros.length > 0
        ? Math.round(
            (monthlyRegistros.filter((r) => r.checklistCumplido).length /
              monthlyRegistros.length) *
              100,
          )
        : 0,
    incidenciasCount: monthlyRegistros.filter((r) => r.incidencias).length,
  };

  // Calcular resultados anuales
  const yearlyRegistros = filteredRegistros.filter((r) => {
    const [year] = r.fecha.split("-").map(Number);
    return year === selectedYear;
  });

  const yearlyResults = {
    totalProcedimientos: yearlyRegistros.length,
    pacientesUnicos: new Set(yearlyRegistros.map((r) => r.dni)).size,
    exitosos: yearlyRegistros.filter((r) => r.resultado === "Exitoso").length,
    fallidos: yearlyRegistros.filter((r) => r.resultado === "Fallido").length,
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

  const getProgressPercentage = (actual: number, goal: number) => {
    if (goal === 0) return 0;
    return Math.min(100, Math.round((actual / goal) * 100));
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "bg-accent";
    if (percentage >= 75) return "bg-blue-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-destructive";
  };

  return (
    <div className="space-y-6">
      {/* View Mode Toggle & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={viewMode === "monthly" ? "default" : "outline"}
            onClick={() => setViewMode("monthly")}
            className="h-9"
          >
            Por Mes
          </Button>
          <Button
            variant={viewMode === "yearly" ? "default" : "outline"}
            onClick={() => setViewMode("yearly")}
            className="h-9"
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
              <SelectTrigger className="w-32 h-9">
                <SelectValue placeholder="Mes" />
              </SelectTrigger>
              <SelectContent>
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
              <SelectTrigger className="w-24 h-9">
                <SelectValue placeholder="Año" />
              </SelectTrigger>
              <SelectContent>
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
            <SelectTrigger className="w-24 h-9">
              <SelectValue placeholder="Año" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year, idx) => (
                <SelectItem key={`year-yearly-${idx}`} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Monthly View */}
      {viewMode === "monthly" && (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Mostrando metas para {months[selectedMonth - 1]} {selectedYear}
          </div>

          {currentGoals.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">
                No hay metas establecidas para este mes
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentGoals.map((goal) => {
                const metaLabel = goal.profesional
                  ? `${goal.profesional}`
                  : "Equipo General";
                const pacAtual =
                  monthlyRegistros.filter((r) =>
                    goal.profesional
                      ? r.profesionalACargo === goal.profesional
                      : true,
                  ).length > 0
                    ? new Set(
                        monthlyRegistros
                          .filter((r) =>
                            goal.profesional
                              ? r.profesionalACargo === goal.profesional
                              : true,
                          )
                          .map((r) => r.dni),
                      ).size
                    : 0;
                const exitAtual = monthlyRegistros.filter(
                  (r) =>
                    (goal.profesional
                      ? r.profesionalACargo === goal.profesional
                      : true) && r.resultado === "Exitoso",
                ).length;
                const failAtual = monthlyRegistros.filter(
                  (r) =>
                    (goal.profesional
                      ? r.profesionalACargo === goal.profesional
                      : true) && r.resultado === "Fallido",
                ).length;

                return (
                  <Card key={goal.id} className="p-4 space-y-4">
                    <h3 className="font-semibold text-foreground">
                      {metaLabel}
                    </h3>

                    {/* Pacientes Atendidos */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm text-muted-foreground">
                          Pacientes Atendidos
                        </p>
                        <p className="text-sm font-semibold">
                          {pacAtual} / {goal.pacientesAtendidos}
                        </p>
                      </div>
                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getProgressColor(getProgressPercentage(pacAtual, goal.pacientesAtendidos))} transition-all`}
                          style={{
                            width: `${getProgressPercentage(pacAtual, goal.pacientesAtendidos)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Procedimientos Exitosos */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm text-muted-foreground">
                          Procedimientos Exitosos
                        </p>
                        <p className="text-sm font-semibold">
                          {exitAtual} / {goal.procedimientosExitosos}
                        </p>
                      </div>
                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getProgressColor(getProgressPercentage(exitAtual, goal.procedimientosExitosos))} transition-all`}
                          style={{
                            width: `${getProgressPercentage(exitAtual, goal.procedimientosExitosos)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Procedimientos Fallidos */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm text-muted-foreground">
                          Procedimientos Fallidos (máx)
                        </p>
                        <p className="text-sm font-semibold">
                          {failAtual} / {goal.procedimientosFallidos}
                        </p>
                      </div>
                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full ${failAtual <= goal.procedimientosFallidos ? "bg-accent" : "bg-destructive"} transition-all`}
                          style={{
                            width: `${Math.min(100, (failAtual / goal.procedimientosFallidos) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Yearly View */}
      {viewMode === "yearly" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-4 bg-primary/5 border-primary/20">
            <p className="text-xs text-muted-foreground mb-2">
              Total de Procedimientos
            </p>
            <p className="text-3xl font-bold text-foreground">
              {yearlyResults.totalProcedimientos}
            </p>
          </Card>

          <Card className="p-4 bg-blue-500/5 border-blue-500/20">
            <p className="text-xs text-muted-foreground mb-2">
              Pacientes Únicos
            </p>
            <p className="text-3xl font-bold text-foreground">
              {yearlyResults.pacientesUnicos}
            </p>
          </Card>

          <Card className="p-4 bg-accent/5 border-accent/20">
            <p className="text-xs text-muted-foreground mb-2">
              Procedimientos Exitosos
            </p>
            <p className="text-3xl font-bold text-foreground">
              {yearlyResults.exitosos}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {yearlyResults.totalProcedimientos > 0
                ? Math.round(
                    (yearlyResults.exitosos /
                      yearlyResults.totalProcedimientos) *
                      100,
                  )
                : 0}
              %
            </p>
          </Card>

          <Card className="p-4 bg-yellow-500/5 border-yellow-500/20">
            <p className="text-xs text-muted-foreground mb-2">
              Con Incidencias
            </p>
            <p className="text-3xl font-bold text-foreground">
              {yearlyResults.conIncidencias}
            </p>
          </Card>

          <Card className="p-4 bg-destructive/5 border-destructive/20">
            <p className="text-xs text-muted-foreground mb-2">
              Procedimientos Fallidos
            </p>
            <p className="text-3xl font-bold text-foreground">
              {yearlyResults.fallidos}
            </p>
          </Card>

          <Card className="p-4 bg-blue-600/5 border-blue-600/20">
            <p className="text-xs text-muted-foreground mb-2">
              Checklist Cumplimiento
            </p>
            <p className="text-3xl font-bold text-foreground">
              {yearlyResults.checklistCumplimiento}%
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
