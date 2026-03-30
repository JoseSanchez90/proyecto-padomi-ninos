"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";
import { Card } from "@/components/ui/card";
import { useRegistro } from "@/lib/contexts/RegistroContext";

const COLORS = [
  "#0066CC",
  "#00A86B",
  "#FF9500",
  "#E63946",
  "#8A3FFC",
  "#00D084",
  "#FFB627",
  "#6B6B6B",
];

export function ChartsGrid() {
  const { filteredRegistros } = useRegistro();

  // Chart 1: Procedimientos por zona
  const procedimientosPorZona = useMemo(() => {
    const map = new Map<string, number>();
    filteredRegistros.forEach((r) => {
      map.set(r.zona || "Sin zona", (map.get(r.zona || "Sin zona") || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name: name.split(" - ")[0], value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredRegistros]);

  // Chart 2: Procedimientos en el tiempo
  const procedimientosEnTiempo = useMemo(() => {
    const map = new Map<string, number>();
    filteredRegistros.forEach((r) => {
      map.set(r.fecha, (map.get(r.fecha) || 0) + 1);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({
        date: date.split("-").slice(1).join("-"),
        count,
      }))
      .slice(-14); // Últimos 14 días
  }, [filteredRegistros]);

  // Chart 3: Distribución por profesional
  const distribucionPorProfesional = useMemo(() => {
    const map = new Map<string, number>();
    filteredRegistros.forEach((r) => {
      const prof = r.profesionalACargo || "Sin asignar";
      map.set(prof, (map.get(prof) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({
      name: name.split(" ")[0],
      value,
    }));
  }, [filteredRegistros]);

  // Chart 4: Resultados de procedimientos
  const resultadosProcedimientos = useMemo(() => {
    const exitosos = filteredRegistros.filter(
      (r) => r.resultado === "Exitoso",
    ).length;
    const seguimiento = filteredRegistros.filter(
      (r) => r.resultado === "Requiere seguimiento",
    ).length;
    const fallidos = filteredRegistros.filter(
      (r) => r.resultado === "Fallido",
    ).length;
    const rechazados = filteredRegistros.filter(
      (r) => r.resultado === "Rechazado",
    ).length;
    return [
      { name: "Exitosos", value: exitosos },
      { name: "Seguimiento", value: seguimiento },
      { name: "Fallidos", value: fallidos },
      { name: "Rechazados", value: rechazados },
    ];
  }, [filteredRegistros]);

  // Chart 5: Incidencias por tipo
  const incidenciasPorTipo = useMemo(() => {
    const conIncidencias = filteredRegistros.filter(
      (r) => r.incidencias,
    ).length;
    const sinIncidencias = filteredRegistros.filter(
      (r) => !r.incidencias,
    ).length;
    return [
      { name: "Con Incidencias", value: conIncidencias },
      { name: "Sin Incidencias", value: sinIncidencias },
    ];
  }, [filteredRegistros]);

  // Chart 6: Cumplimiento de checklist
  const checklistCumplimiento = useMemo(() => {
    const cumplido = filteredRegistros.filter(
      (r) => r.checklistCumplido,
    ).length;
    const noCumplido = filteredRegistros.filter(
      (r) => !r.checklistCumplido,
    ).length;
    const percentage =
      Math.round((cumplido / (cumplido + noCumplido)) * 100) || 0;
    return [
      { name: "Cumplido", value: cumplido },
      { name: "No Cumplido", value: noCumplido },
      { percentage },
    ];
  }, [filteredRegistros]);

  // Chart 7: Pacientes por zona
  const pacientesPorZona = useMemo(() => {
    const map = new Map<string, number>();
    filteredRegistros.forEach((r) => {
      map.set(r.zona || "Sin zona", (map.get(r.zona || "Sin zona") || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name: name.split(" - ")[0], value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredRegistros]);

  // Chart 8: Promedio de duración por procedimiento
  const duracionPromedioPorProcedimiento = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();
    filteredRegistros.forEach((r) => {
      const proc = r.procedimiento || "Sin procedimiento";
      const current = map.get(proc) || { total: 0, count: 0 };
      map.set(proc, {
        total: current.total + r.duracion,
        count: current.count + 1,
      });
    });
    return Array.from(map.entries())
      .map(([name, { total, count }]) => ({
        name: name.substring(0, 12),
        duracion: Math.round(total / count),
      }))
      .sort((a, b) => b.duracion - a.duracion)
      .slice(0, 8);
  }, [filteredRegistros]);

  if (filteredRegistros.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">
          No hay datos para mostrar gráficos
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Procedimientos por zona */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Procedimientos por Zona
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={procedimientosPorZona}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="name"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
              }}
              cursor={{ fill: "rgba(0, 102, 204, 0.1)" }}
            />
            <Bar dataKey="value" fill="#0066CC" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Chart 2: Procedimientos en el tiempo */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Procedimientos en el Tiempo
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={procedimientosEnTiempo}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="date"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
              }}
              cursor={{ fill: "rgba(0, 168, 107, 0.1)" }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#00A86B"
              strokeWidth={3}
              dot={{ fill: "#00A86B", r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Chart 3: Distribución por profesional */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Distribución por Profesional
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={distribucionPorProfesional}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {distribucionPorProfesional.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Chart 4: Resultados de procedimientos */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Resultados de Procedimientos
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={resultadosProcedimientos}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="name"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
              }}
              cursor={{ fill: "rgba(0, 102, 204, 0.1)" }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              <Cell fill="#00A86B" />
              <Cell fill="#FF9500" />
              <Cell fill="#E63946" />
              <Cell fill="#6B6B6B" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Chart 5: Incidencias */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Incidencias Reportadas
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={incidenciasPorTipo}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {incidenciasPorTipo.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % 2]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Chart 6: Cumplimiento de checklist */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Cumplimiento de Checklist
        </h3>
        <div className="flex items-center justify-center h-75">
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="transform -rotate-90" width="128" height="128">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="var(--color-border)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#00A86B"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${((checklistCumplimiento[2] as any)?.percentage || 0) * 3.5} 350`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground">
                    {(checklistCumplimiento[2] as any)?.percentage || 0}%
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Cumplido: {(checklistCumplimiento[0] as any)?.value || 0}
            </p>
          </div>
        </div>
      </Card>

      {/* Chart 7: Pacientes por zona (Area Chart) */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Pacientes por Zona
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={pacientesPorZona}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="name"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
              }}
              cursor={{ fill: "rgba(0, 208, 132, 0.1)" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#00D084"
              fill="#00D084"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Chart 8: Promedio de duración por procedimiento */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Duración Promedio por Procedimiento
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            layout="vertical"
            data={duracionPromedioPorProcedimiento}
            margin={{ top: 5, right: 30, left: 150 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              type="number"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis
              dataKey="name"
              type="category"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              width={140}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
              }}
              cursor={{ fill: "rgba(138, 63, 252, 0.1)" }}
            />
            <Bar dataKey="duracion" fill="#8A3FFC" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
