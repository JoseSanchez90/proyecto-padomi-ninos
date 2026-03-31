// components/dashboard/IndicatorCards.tsx
"use client";

import { useMemo, useState } from "react";
import { useRegistro } from "@/lib/contexts/RegistroContext";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  UserCheck,
  Target,
  Award,
} from "lucide-react";
import { getLicenciadosActivos } from "@/lib/helpers";

interface IndicatorProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  color: "blue" | "green" | "orange" | "red" | "purple" | "teal" | "amber";
  subtext?: string;
  progress?: number; // Para barra de progreso visual
}

function Indicator({
  label,
  value,
  icon,
  trend,
  color,
  subtext,
  progress,
}: IndicatorProps) {
  const colorClasses = {
    blue: "text-blue-700 dark:text-blue-300",
    green: "text-green-700 dark:text-green-300",
    orange: "text-orange-700 dark:text-orange-300",
    red: "text-red-700 dark:text-red-300",
    purple: "text-purple-700 dark:text-purple-300",
    teal: "text-teal-700 dark:text-teal-300",
    amber: "text-amber-700 dark:text-amber-300",
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
    teal: "bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400",
    amber:
      "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400",
  };

  // Color de la barra de progreso según el porcentaje
  const getProgressColor = (p: number) => {
    if (p >= 80) return "bg-green-500";
    if (p >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <Card className={`p-5 ${colorClasses[color]} relative overflow-hidden`}>
      {/* Barra de progreso visual (si aplica) */}
      {progress !== undefined && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10">
          <div
            className={`h-full transition-all ${getProgressColor(progress)}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-90">{label}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-2xl font-bold">{value}</h3>
            {trend !== undefined && (
              <span
                className={`text-xs font-semibold ${trend > 0 ? "text-green-600" : "text-red-600"}`}
              >
                {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
              </span>
            )}
          </div>
          {subtext && <p className="text-xs mt-1 opacity-80">{subtext}</p>}
        </div>
        <div className={`p-2.5 rounded-lg ${iconClasses[color]}`}>{icon}</div>
      </div>
    </Card>
  );
}

export function IndicatorCards() {
  const { filteredRegistros } = useRegistro();
  const [selectedProfessional, setSelectedProfessional] =
    useState<string>("Todos");

  // Filtrar registros por profesional seleccionado
  const registrosFiltrados = useMemo(() => {
    if (selectedProfessional === "Todos") return filteredRegistros;
    return filteredRegistros.filter(
      (r) => r.profesionalACargo === selectedProfessional,
    );
  }, [filteredRegistros, selectedProfessional]);

  // Calcular indicadores generales
  const indicators = useMemo(() => {
    if (registrosFiltrados.length === 0) {
      return {
        totalPacientes: 0,
        totalProcedimientos: 0,
        exitosos: 0,
        tasaExito: 0,
        conIncidencias: 0,
        checklistCumplido: 0,
        duracionPromedio: 0,
      };
    }

    const pacientesUnicos = new Set(registrosFiltrados.map((r) => r.dni)).size;
    const exitosos = registrosFiltrados.filter(
      (r) => r.resultado === "Exitoso",
    ).length;
    const conIncidencias = registrosFiltrados.filter(
      (r) => r.incidencias,
    ).length;
    const checklistCumplido = registrosFiltrados.filter(
      (r) => r.checklistCumplido,
    ).length;

    const duracionPromedio = Math.round(
      registrosFiltrados.reduce((sum, r) => sum + r.duracion, 0) /
        registrosFiltrados.length,
    );

    const tasaExito = Math.round((exitosos / registrosFiltrados.length) * 100);

    return {
      totalPacientes: pacientesUnicos,
      totalProcedimientos: registrosFiltrados.length,
      exitosos,
      tasaExito,
      conIncidencias,
      checklistCumplido,
      duracionPromedio,
    };
  }, [registrosFiltrados]);

  // CALCULAR METAS POR PROFESIONAL (basado en Resultado="Exitoso")
  // Fórmula: (procedimientos Exitosos / total procedimientos) * 100
  const metaProfesional = useMemo(() => {
    if (selectedProfessional === "Todos") return null;

    // Filtrar SOLO los registros del profesional seleccionado
    const registrosProf = filteredRegistros.filter(
      (r) => r.profesionalACargo === selectedProfessional,
    );

    if (registrosProf.length === 0) {
      return {
        profesional: selectedProfessional,
        total: 0,
        exitosos: 0,
        porcentaje: 0,
        sinDatos: true,
      };
    }

    const total = registrosProf.length;
    const exitosos = registrosProf.filter(
      (r) => r.resultado === "Exitoso",
    ).length;
    const porcentaje = Math.round((exitosos / total) * 100);

    return {
      profesional: selectedProfessional,
      total,
      exitosos,
      porcentaje,
      sinDatos: false,
    };
  }, [filteredRegistros, selectedProfessional]);

  return (
    <div className="space-y-4">
      {/* Header con filtro de profesional */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-semibold text-base 2xl:text-lg flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-600" />
          Indicadores de Desempeño
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Filtrar por:
          </span>
          <Select
            value={selectedProfessional}
            onValueChange={setSelectedProfessional}
          >
            <SelectTrigger className="w-52 h-9 text-sm">
              <SelectValue placeholder="Todos los profesionales" />
            </SelectTrigger>
            <SelectContent className="max-h-48">
              {/* ✅ OPCIÓN "TODOS" - Siempre al inicio */}
              <SelectItem value="Todos">Todos los profesionales</SelectItem>

              {/* Separador visual opcional */}
              <div className="h-px bg-border my-1" />

              {/* Lista de licenciados activos */}
              {getLicenciadosActivos().length > 0 ? (
                getLicenciadosActivos().map((prof, index) => (
                  <SelectItem key={`${prof}-${index}`} value={prof}>
                    {prof}
                  </SelectItem>
                ))
              ) : (
                <SelectItem
                  value="none"
                  disabled
                  className="text-muted-foreground"
                >
                  No hay licenciados registrados
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cards de indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total de Pacientes */}
        <Indicator
          label="Total de Pacientes"
          value={indicators.totalPacientes}
          icon={<Users className="w-5 h-5" />}
          color="blue"
        />

        {/* Total de Procedimientos */}
        <Indicator
          label="Total de Procedimientos"
          value={indicators.totalProcedimientos}
          icon={<Zap className="w-5 h-5" />}
          color="purple"
        />

        {/* ✅ Tasa de Éxito (META PRINCIPAL) */}
        <Indicator
          label="Tasa de Éxito"
          value={`${indicators.tasaExito}%`}
          icon={<CheckCircle className="w-5 h-5" />}
          color="green"
          trend={
            indicators.tasaExito >= 80 ? 5 : indicators.tasaExito >= 60 ? 0 : -5
          }
          subtext={
            selectedProfessional !== "Todos"
              ? `${indicators.exitosos} exitosos de ${indicators.totalProcedimientos} procedimientos`
              : undefined
          }
          progress={indicators.tasaExito}
        />

        {/* Procedimientos Exitosos */}
        <Indicator
          label="Proced. Exitosos"
          value={indicators.exitosos}
          icon={<TrendingUp className="w-5 h-5" />}
          color="green"
          subtext={
            selectedProfessional !== "Todos"
              ? `${Math.round((indicators.exitosos / indicators.totalProcedimientos) * 100) || 0}% de efectividad`
              : undefined
          }
        />

        {/* Con Incidencias */}
        <Indicator
          label="Con Incidencias"
          value={indicators.conIncidencias}
          icon={<AlertCircle className="w-5 h-5" />}
          color="red"
          subtext={
            indicators.totalProcedimientos > 0
              ? `${Math.round((indicators.conIncidencias / indicators.totalProcedimientos) * 100)}% del total`
              : undefined
          }
        />

        {/* Checklist Cumplido */}
        <Indicator
          label="Checklist Cumplido"
          value={indicators.checklistCumplido}
          icon={<CheckCircle className="w-5 h-5" />}
          color="teal"
          subtext={
            indicators.totalProcedimientos > 0
              ? `${Math.round((indicators.checklistCumplido / indicators.totalProcedimientos) * 100)}% cumplimiento`
              : undefined
          }
        />

        {/* Duración Promedio */}
        <Indicator
          label="Duración Promedio"
          value={`${indicators.duracionPromedio} min`}
          icon={<Clock className="w-5 h-5" />}
          color="blue"
        />

        {/* ✅ CARD PRINCIPAL: Meta Cumplida por Profesional */}
        {selectedProfessional !== "Todos" && metaProfesional && (
          <Indicator
            label={`Meta: ${metaProfesional.profesional}`}
            value={
              metaProfesional.sinDatos
                ? "Sin datos"
                : `${metaProfesional.porcentaje}%`
            }
            icon={<Target className="w-5 h-5" />}
            color={
              metaProfesional.sinDatos
                ? "amber"
                : metaProfesional.porcentaje >= 80
                  ? "green"
                  : metaProfesional.porcentaje >= 60
                    ? "amber"
                    : "red"
            }
            subtext={
              metaProfesional.sinDatos
                ? "No hay registros este período"
                : `${metaProfesional.exitosos} exitosos de ${metaProfesional.total} procedimientos`
            }
            progress={metaProfesional.sinDatos ? 0 : metaProfesional.porcentaje}
          />
        )}

        {/* Requieren Seguimiento */}
        <Indicator
          label="Requieren Seguimiento"
          value={
            registrosFiltrados.filter(
              (r) => r.resultado === "Requiere seguimiento",
            ).length
          }
          icon={<UserCheck className="w-5 h-5" />}
          color="orange"
        />
      </div>

      {/* Leyenda de colores */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
          ≥80% éxito (Meta cumplida)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          60-79% éxito (En progreso)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          &lt;60% éxito (Requiere atención)
        </span>
      </div>

      {/* Nota informativa */}
      {selectedProfessional !== "Todos" && (
        <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
          💡 <strong>Cálculo de meta:</strong> (Procedimientos con
          Resultado="Exitoso" ÷ Total de procedimientos) × 100
        </div>
      )}
    </div>
  );
}
