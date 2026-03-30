"use client";

import { useMemo } from "react";
import { useRegistro } from "@/lib/contexts/RegistroContext";
import { Card } from "@/components/ui/card";
import {
  Users,
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

interface IndicatorProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  color: "blue" | "green" | "orange" | "red" | "purple";
}

function Indicator({ label, value, icon, trend, color }: IndicatorProps) {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300",
    green:
      "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300",
    orange:
      "bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300",
    red: "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300",
    purple:
      "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300",
  };

  const iconClasses = {
    blue: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400",
    green:
      "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400",
    orange:
      "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400",
    red: "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400",
    purple:
      "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400",
  };

  return (
    <Card className={`p-6 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-90">{label}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-3xl font-bold">{value}</h3>
            {trend !== undefined && (
              <span
                className={`text-sm font-semibold ${trend > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
              >
                {trend > 0 ? "+" : ""}
                {trend}%
              </span>
            )}
          </div>
        </div>
        <div className={`p-3 rounded-lg ${iconClasses[color]}`}>{icon}</div>
      </div>
    </Card>
  );
}

export function IndicatorCards() {
  const { filteredRegistros } = useRegistro();

  const indicators = useMemo(() => {
    if (filteredRegistros.length === 0) {
      return {
        totalPacientes: 0,
        totalProcedimientos: 0,
        exitosos: 0,
        parciales: 0,
        fallidos: 0,
        conIncidencias: 0,
        checklistCumplido: 0,
        duracionPromedio: 0,
        tasaExito: 0,
        tasaIncidencias: 0,
        checklistRate: 0,
      };
    }

    // Contar pacientes únicos
    const pacientesUnicos = new Set(filteredRegistros.map((r) => r.dni)).size;

    // Contar procedimientos por resultado
    const exitosos = filteredRegistros.filter(
      (r) => r.resultado === "Exitoso",
    ).length;
    const parciales = filteredRegistros.filter(
      (r) => r.resultado === "Requiere seguimiento",
    ).length;
    const fallidos = filteredRegistros.filter(
      (r) => r.resultado === "Fallido",
    ).length;

    // Contar incidencias
    const conIncidencias = filteredRegistros.filter(
      (r) => r.incidencias,
    ).length;

    // Contar checklist cumplido
    const checklistCumplido = filteredRegistros.filter(
      (r) => r.checklistCumplido,
    ).length;

    // Calcular duración promedio
    const duracionPromedio = Math.round(
      filteredRegistros.reduce((sum, r) => sum + r.duracion, 0) /
        filteredRegistros.length,
    );

    // Tasas
    const tasaExito = Math.round((exitosos / filteredRegistros.length) * 100);
    const tasaIncidencias = Math.round(
      (conIncidencias / filteredRegistros.length) * 100,
    );
    const checklistRate = Math.round(
      (checklistCumplido / filteredRegistros.length) * 100,
    );

    return {
      totalPacientes: pacientesUnicos,
      totalProcedimientos: filteredRegistros.length,
      exitosos,
      parciales,
      fallidos,
      conIncidencias,
      checklistCumplido,
      duracionPromedio,
      tasaExito,
      tasaIncidencias,
      checklistRate,
    };
  }, [filteredRegistros]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Indicator
        label="Total de Pacientes"
        value={indicators.totalPacientes}
        icon={<Users className="w-6 h-6" />}
        color="blue"
      />

      <Indicator
        label="Total de Procedimientos"
        value={indicators.totalProcedimientos}
        icon={<Zap className="w-6 h-6" />}
        color="purple"
      />

      <Indicator
        label="Tasa de Éxito"
        value={`${indicators.tasaExito}%`}
        icon={<CheckCircle className="w-6 h-6" />}
        color="green"
      />

      <Indicator
        label="Procedimientos Exitosos"
        value={indicators.exitosos}
        icon={<TrendingUp className="w-6 h-6" />}
        color="green"
      />

      <Indicator
        label="Con Incidencias"
        value={indicators.conIncidencias}
        icon={<AlertCircle className="w-6 h-6" />}
        color="red"
      />

      <Indicator
        label="Tasa de Incidencias"
        value={`${indicators.tasaIncidencias}%`}
        icon={<AlertCircle className="w-6 h-6" />}
        color="orange"
      />

      <Indicator
        label="Checklist Cumplido"
        value={`${indicators.checklistRate}%`}
        icon={<CheckCircle className="w-6 h-6" />}
        color="green"
      />

      <Indicator
        label="Duración Promedio"
        value={`${indicators.duracionPromedio} min`}
        icon={<Clock className="w-6 h-6" />}
        color="blue"
      />

      <Indicator
        label="Requieren Seguimiento"
        value={indicators.parciales}
        icon={<TrendingUp className="w-6 h-6" />}
        color="orange"
      />
    </div>
  );
}
