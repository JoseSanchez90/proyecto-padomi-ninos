"use client";

import { useEffect } from "react";
import { RegistroTable } from "@/components/dashboard/RegistroTable";
import { RegistroFilters } from "@/components/dashboard/RegistroFilters";
import { useRegistro } from "@/lib/contexts/RegistroContext";
import { Card } from "@/components/ui/card";
import { initializeMockData } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Check,
  CheckCircle,
  CircleX,
  Filter,
  Plus,
  UsersRound,
  ClipboardCheck, // ← Nuevo icono para Checklist
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

  // Contar registros con checklist cumplido
  const totalChecklistCumplido = registros.filter(
    (r) => r.checklistCumplido === true,
  ).length;

  useEffect(() => {
    initializeMockData();
  }, []);

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pacientes</h1>
          <p className="text-muted-foreground">
            Gestione todos los registros y procedimientos de los pacientes
          </p>
        </div>

        {/* Botón para ir al formulario */}
        <Button
          onClick={() => router.push("/dashboard/registrar-paciente")}
          className="bg-blue-600 hover:bg-blue-800 transition-colors px-4 py-5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Nuevo Paciente
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total de Registros */}
        <Card className="p-4 bg-indigo-200 border-indigo-200">
          <div className="flex items-center justify-between">
            <p className="text-indigo-600 font-bold">Total de Registros</p>
            <UsersRound className="w-6 h-6 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-indigo-600 mt-1">
            {registros.length}
          </p>
        </Card>

        <Card className="p-4 bg-teal-200 border-teal-200">
          <div className="flex items-center justify-between">
            <p className="text-teal-600 font-bold">Checklist Cumplido</p>
            <ClipboardCheck className="w-6 h-6 text-teal-600" />
          </div>
          <p className="text-2xl font-bold text-teal-600 mt-1">
            {totalChecklistCumplido}
          </p>
        </Card>

        {/* Procedimientos Exitosos */}
        <Card className="p-4 bg-green-200 border-green-200">
          <div className="flex items-center justify-between">
            <p className="text-green-600 font-bold">Procedimientos Exitosos</p>
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {totalExitosos}
          </p>
        </Card>

        {/* Con Incidencias */}
        <Card className="p-4 bg-yellow-200 border-yellow-200">
          <div className="flex items-center justify-between">
            <p className="text-yellow-600 font-bold">Con Incidencias</p>
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {totalConIncidencias}
          </p>
        </Card>

        {/* Fallidos */}
        <Card className="p-4 bg-red-200 border-red-200">
          <div className="flex items-center justify-between">
            <p className="text-red-600 font-bold">Fallidos</p>
            <CircleX className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {totalFallidos}
          </p>
        </Card>
      </div>

      {/* Filters + Table (sin tabs) */}
      <div className="space-y-4">
        <RegistroFilters />
        <RegistroTable />
      </div>
    </div>
  );
}
