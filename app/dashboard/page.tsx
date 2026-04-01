"use client";

import { useEffect } from "react";
import { RegistroTable } from "@/components/dashboard/RegistroTable";
import { RegistroFilters } from "@/components/dashboard/RegistroFilters";
import { useRegistro } from "@/lib/contexts/RegistroContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle,
  CircleX,
  Plus,
  UsersRound,
  UserCheck,
  Cable,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegistroDashboard() {
  const router = useRouter();
  const { registros } = useRegistro();

  // Estadísticas
  const totalExitosos = registros.filter(
    (r) => r.resultado === "Exitoso",
  ).length;

  const totalConIncidencias = registros.filter((r) => r.incidencias).length;

  const totalFallidos = registros.filter(
    (r) => r.resultado === "Fallido",
  ).length;

  // ✅ CORREGIDO: Contar dispositivos dentro de procedimientos
  const totalDispositivos = registros.reduce((total, record) => {
    const dispositivosEnRegistro =
      record.procedimientos?.filter((proc) => proc.tieneDispositivo === true)
        .length || 0;
    return total + dispositivosEnRegistro;
  }, 0);

  // Filtrar por "Activo"
  const totalPacientesActivos = registros.filter(
    (r) => r.estadoPaciente === "Activo",
  ).length;

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-6">
        <div className="mb-2">
          <h1 className="text-2xl 2xl:text-3xl font-bold text-foreground">
            Pacientes
          </h1>
          <p className="text-muted-foreground text-xs 2xl:text-sm">
            Gestione todos los registros y procedimientos de los pacientes
          </p>
        </div>

        {/* Botón para ir al formulario */}
        <Button
          onClick={() => router.push("/dashboard/registrar-paciente")}
          className="bg-blue-600 hover:bg-blue-800 transition-colors px-4 py-5 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Nuevo Paciente
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total de Registros */}
        <Card className="p-4 bg-indigo-100 border-indigo-200">
          <div className="flex items-center justify-between">
            <p className="text-indigo-600 font-bold text-xs 2xl:text-sm">
              Total Registros
            </p>
            <UsersRound className="w-6 h-6 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-indigo-600 mt-1">
            {registros.length}
          </p>
        </Card>

        {/* Pacientes Activos */}
        <Card className="p-4 bg-emerald-100 border-emerald-200">
          <div className="flex items-center justify-between">
            <p className="text-emerald-600 font-bold text-xs 2xl:text-sm">
              Pacientes Activos
            </p>
            <UserCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {totalPacientesActivos}
          </p>
        </Card>

        {/* ✅ Tienen Dispositivo - CORREGIDO */}
        <Card className="p-4 bg-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <p className="text-purple-600 font-bold text-xs 2xl:text-sm">
              Total Dispositivos
            </p>
            <Cable className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {totalDispositivos}
          </p>
        </Card>

        {/* Procedimientos Exitosos */}
        <Card className="p-4 bg-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <p className="text-green-600 font-bold text-xs 2xl:text-sm">
              Resultados Exitosos
            </p>
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {totalExitosos}
          </p>
        </Card>

        {/* Con Incidencias */}
        <Card className="p-4 bg-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <p className="text-yellow-600 font-bold text-xs 2xl:text-sm">
              Con Incidencias
            </p>
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {totalConIncidencias}
          </p>
        </Card>

        {/* Fallidos */}
        <Card className="p-4 bg-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <p className="text-red-600 font-bold text-xs 2xl:text-sm">
              Fallidos
            </p>
            <CircleX className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {totalFallidos}
          </p>
        </Card>
      </div>

      {/* Filters + Table */}
      <div className="space-y-4">
        <RegistroFilters />
        <RegistroTable />
      </div>
    </div>
  );
}
