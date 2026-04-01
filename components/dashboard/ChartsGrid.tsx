// components/dashboard/ChartsGrid.tsx
"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
} from "recharts";
import { Card } from "@/components/ui/card";
import { useRegistro } from "@/lib/contexts/RegistroContext";
import { getLicenciadosActivos } from "@/lib/helpers";

export function ChartsGrid() {
  const { filteredRegistros } = useRegistro();

  // 📊 Chart 1: Tasa de Éxito por Profesional (Radar Chart - MÁS IMPORTANTE)
  const tasaExitoPorProfesional = useMemo(() => {
    return getLicenciadosActivos().map((prof) => {
      const registros = filteredRegistros.filter(
        (r) => r.profesionalACargo === prof,
      );
      const total = registros.length;
      const exitosos = registros.filter(
        (r) => r.resultado === "Exitoso",
      ).length;
      const tasaExito = total > 0 ? Math.round((exitosos / total) * 100) : 0;

      return {
        profesional: prof.split(" ")[1] || prof, // Solo apellido
        tasaExito,
        total,
        exitosos,
      };
    });
  }, [filteredRegistros]);

  // 📊 Chart 2: Evolución Mensual de Procedimientos (Area Chart con tendencia)
  const evolucionMensual = useMemo(() => {
    const meses = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    const currentYear = new Date().getFullYear();

    const data = meses.map((mes, index) => {
      const monthNum = index + 1;
      const registros = filteredRegistros.filter((r) => {
        const [year, month] = r.fecha.split("-").map(Number);
        return year === currentYear && month === monthNum;
      });

      const total = registros.length;
      const exitosos = registros.filter(
        (r) => r.resultado === "Exitoso",
      ).length;
      const tasaExito = total > 0 ? Math.round((exitosos / total) * 100) : 0;

      return {
        mes,
        total,
        exitosos,
        tasaExito,
      };
    });

    return data;
  }, [filteredRegistros]);

  // 📊 Chart 3: Top 5 Procedimientos Más Realizados (Horizontal Bar)
  const topProcedimientos = useMemo(() => {
    const map = new Map<string, number>();
    filteredRegistros.forEach((r) => {
      if (r.procedimientos && r.procedimientos.length > 0) {
        r.procedimientos.forEach((p) => {
          const proc = p.procedimiento || "Sin procedimiento";
          map.set(proc, (map.get(proc) || 0) + 1);
        });
      } else {
        map.set("Sin procedimiento", (map.get("Sin procedimiento") || 0) + 1);
      }
    });

    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [filteredRegistros]);

  // 📊 Chart 4: Resultados de Procedimientos (Pie Chart mejorado)
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
      { name: "Exitosos", value: exitosos, color: "#00A86B" },
      { name: "Seguimiento", value: seguimiento, color: "#FF9500" },
      { name: "Fallidos", value: fallidos, color: "#E63946" },
      { name: "Rechazados", value: rechazados, color: "#6B6B6B" },
    ].filter((item) => item.value > 0);
  }, [filteredRegistros]);

  // 📊 Chart 5: Distribución por Edad (Histograma)
  const distribucionPorEdad = useMemo(() => {
    const ranges = {
      "0-2 años": 0,
      "3-5 años": 0,
      "6-9 años": 0,
      "10-12 años": 0,
      "13-15 años": 0,
    };

    filteredRegistros.forEach((r) => {
      const edad = r.edad || 0;
      if (edad <= 2) ranges["0-2 años"]++;
      else if (edad <= 5) ranges["3-5 años"]++;
      else if (edad <= 9) ranges["6-9 años"]++;
      else if (edad <= 12) ranges["10-12 años"]++;
      else if (edad <= 15) ranges["13-15 años"]++;
    });

    return Object.entries(ranges).map(([name, value]) => ({ name, value }));
  }, [filteredRegistros]);

  // 📊 Chart 6: Checklist Compliance por Profesional (Composed Chart)
  const checklistPorProfesional = useMemo(() => {
    return getLicenciadosActivos()
      .slice(0, 6)
      .map((prof) => {
        const registros = filteredRegistros.filter(
          (r) => r.profesionalACargo === prof,
        );
        const total = registros.length;
        const cumplido = registros.filter((r) => r.checklistCumplido).length;
        const percentage = total > 0 ? Math.round((cumplido / total) * 100) : 0;

        return {
          profesional: prof.split(" ")[1] || prof,
          checklist: percentage,
          total,
        };
      });
  }, [filteredRegistros]);

  // 📊 Chart 7: Incidencias por Tipo (Bar Chart)
  const incidenciasPorTipo = useMemo(() => {
    const map = new Map<string, number>();
    filteredRegistros
      .filter((r) => r.incidencias && r.tipoIncidencia)
      .forEach((r) => {
        const tipo = r.tipoIncidencia || "Sin especificar";
        map.set(tipo, (map.get(tipo) || 0) + 1);
      });

    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [filteredRegistros]);

  // 📊 Chart 8: Rendimiento por Zona (Radar Chart)
  const rendimientoPorZona = useMemo(() => {
    const zonas = ["Norte", "Sur", "Este", "Centro", "Oeste"];

    return zonas.map((zona) => {
      const registros = filteredRegistros.filter((r) => r.zona === zona);
      const total = registros.length;
      const exitosos = registros.filter(
        (r) => r.resultado === "Exitoso",
      ).length;
      const tasaExito = total > 0 ? Math.round((exitosos / total) * 100) : 0;
      const conIncidencias = registros.filter((r) => r.incidencias).length;
      const tasaIncidencias =
        total > 0 ? Math.round((conIncidencias / total) * 100) : 0;

      return {
        zona,
        procedimientos: total,
        tasaExito,
        tasaIncidencias: 100 - tasaIncidencias, // Invertir para que más alto sea mejor
      };
    });
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
      {/* 📊 Chart 1: Tasa de Éxito por Profesional (Radar - KPI Principal) */}
      <Card className="p-6">
        <h3 className="text-base 2xl:text-lg font-semibold text-foreground mb-2">
          Tasa de Éxito por Profesional
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Comparativa de efectividad por licenciado
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={tasaExitoPorProfesional}>
            <PolarGrid stroke="var(--color-border)" />
            <PolarAngleAxis
              dataKey="profesional"
              tick={{ fill: "var(--color-foreground)", fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }}
            />
            <Radar
              name="Tasa de Éxito %"
              dataKey="tasaExito"
              stroke="#00A86B"
              fill="#00A86B"
              fillOpacity={0.6}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </Card>

      {/* 📊 Chart 2: Evolución Mensual (Area Chart con 2 métricas) */}
      <Card className="p-6">
        <h3 className="text-base 2xl:text-lg font-semibold text-foreground mb-2">
          Evolución Mensual {new Date().getFullYear()}
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Procedimientos totales y tasa de éxito
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={evolucionMensual}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="mes"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis
              yAxisId="left"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="total"
              name="Total Procedimientos"
              stroke="#0066CC"
              fill="#0066CC"
              fillOpacity={0.2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="tasaExito"
              name="Tasa de Éxito %"
              stroke="#00A86B"
              strokeWidth={2}
              dot={{ fill: "#00A86B", r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* 📊 Chart 3: Top Procedimientos (Horizontal Bar) */}
      <Card className="p-6">
        <h3 className="text-base 2xl:text-lg font-semibold text-foreground mb-2">
          Top 5 Procedimientos
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Más realizados del período
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            layout="vertical"
            data={topProcedimientos}
            margin={{ top: 5, right: 30, left: 100 }}
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
              fontSize={11}
              width={95}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="value" fill="#8A3FFC" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* 📊 Chart 4: Resultados (Pie Chart mejorado) */}
      <Card className="p-6">
        <h3 className="text-base 2xl:text-lg font-semibold text-foreground mb-2">
          Distribución de Resultados
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Clasificación por tipo de resultado
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={resultadosProcedimientos}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
              }
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
            >
              {resultadosProcedimientos.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* 📊 Chart 5: Distribución por Edad (Histograma) */}
      <Card className="p-6">
        <h3 className="text-base 2xl:text-lg font-semibold text-foreground mb-2">
          Distribución por Edad
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Pacientes por rango etario
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={distribucionPorEdad}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="name"
              stroke="var(--color-muted-foreground)"
              fontSize={11}
            />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="value" fill="#FF9500" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* 📊 Chart 6: Checklist por Profesional (Composed) */}
      <Card className="p-6">
        <h3 className="text-base 2xl:text-lg font-semibold text-foreground mb-2">
          Checklist Compliance
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Cumplimiento por licenciado
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={checklistPorProfesional}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="profesional"
              stroke="var(--color-muted-foreground)"
              fontSize={11}
            />
            <YAxis
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
              }}
            />
            <Bar
              dataKey="checklist"
              fill="#00D084"
              radius={[8, 8, 0, 0]}
              name="Checklist %"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      {/* 📊 Chart 7: Incidencias por Tipo (Bar) */}
      <Card className="p-6">
        <h3 className="text-base 2xl:text-lg font-semibold text-foreground mb-2">
          Incidencias por Tipo
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Top 5 tipos de incidencias
        </p>
        {incidenciasPorTipo.length === 0 ? (
          <div className="flex items-center justify-center h-75 text-muted-foreground text-sm">
            No hay incidencias registradas
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incidenciasPorTipo}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
              />
              <XAxis
                dataKey="name"
                stroke="var(--color-muted-foreground)"
                fontSize={10}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" fill="#E63946" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* 📊 Chart 8: Rendimiento por Zona (Radar Multidimensional) */}
      <Card className="p-6">
        <h3 className="text-base 2xl:text-lg font-semibold text-foreground mb-2">
          Rendimiento por Zona
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Comparativa multidimensional
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={rendimientoPorZona}>
            <PolarGrid stroke="var(--color-border)" />
            <PolarAngleAxis
              dataKey="zona"
              tick={{ fill: "var(--color-foreground)", fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }}
            />
            <Radar
              name="Procedimientos"
              dataKey="procedimientos"
              stroke="#0066CC"
              fill="#0066CC"
              fillOpacity={0.3}
            />
            <Radar
              name="Tasa Éxito %"
              dataKey="tasaExito"
              stroke="#00A86B"
              fill="#00A86B"
              fillOpacity={0.3}
            />
            <Radar
              name="Sin Incidencias %"
              dataKey="tasaIncidencias"
              stroke="#FF9500"
              fill="#FF9500"
              fillOpacity={0.3}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
