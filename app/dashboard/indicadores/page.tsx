"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IndicatorCards } from "@/components/dashboard/IndicatorCards";
import { RegistroFilters } from "@/components/dashboard/RegistroFilters";
import { MonthlyGoalsSection } from "@/components/dashboard/MonthlyGoalsSection";
import { useRegistro } from "@/lib/contexts/RegistroContext";
import { useMemo } from "react";
import { Card } from "@/components/ui/card";

export default function IndicadoresPage() {
  const { filteredRegistros } = useRegistro();

  const procedimientoPorZona = useMemo(() => {
    const map = new Map<string, number>();
    filteredRegistros.forEach((r) => {
      map.set(r.zona, (map.get(r.zona) || 0) + 1);
    });
    return Array.from(map.entries());
  }, [filteredRegistros]);

  const procedimientoPorProfesional = useMemo(() => {
    const map = new Map<string, number>();
    filteredRegistros.forEach((r) => {
      map.set(r.profesionalACargo, (map.get(r.profesionalACargo) || 0) + 1);
    });
    return Array.from(map.entries());
  }, [filteredRegistros]);

  const resultadoDistribucion = useMemo(() => {
    return {
      exitosos: filteredRegistros.filter((r) => r.resultado === "Exitoso")
        .length,
      parciales: filteredRegistros.filter(
        (r) => r.resultado === "Requiere seguimiento",
      ).length,
      fallidos: filteredRegistros.filter((r) => r.resultado === "Fallido")
        .length,
    };
  }, [filteredRegistros]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Indicadores</h1>
        <p className="text-muted-foreground mt-2">
          Métricas y metas del desempeño clínico
        </p>
      </div>

      {/* Filters */}
      <RegistroFilters />

      {/* Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="general">Generales</TabsTrigger>
          <TabsTrigger value="metas">Metas</TabsTrigger>
          <TabsTrigger value="detalles">Análisis</TabsTrigger>
        </TabsList>

        {/* General Indicators */}
        <TabsContent value="general">
          <IndicatorCards />
        </TabsContent>

        {/* Monthly Goals */}
        <TabsContent value="metas" className="space-y-4">
          <MonthlyGoalsSection />
        </TabsContent>

        {/* Detailed Analysis */}
        <TabsContent value="detalles" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Procedimientos por Zona */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Procedimientos por Zona
              </h3>
              <div className="space-y-3">
                {procedimientoPorZona.length > 0 ? (
                  procedimientoPorZona.map(([zona, count]) => (
                    <div
                      key={zona}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-foreground">{zona}</span>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 bg-linear-to-r from-primary to-accent rounded-full"
                          style={{ width: `${Math.min(count * 20, 100)}px` }}
                        />
                        <span className="text-sm font-semibold text-foreground min-w-8 text-right">
                          {count}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">Sin datos</p>
                )}
              </div>
            </Card>

            {/* Procedimientos por Profesional */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Procedimientos por Profesional
              </h3>
              <div className="space-y-3">
                {procedimientoPorProfesional.length > 0 ? (
                  procedimientoPorProfesional.map(([profesional, count]) => (
                    <div
                      key={profesional}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-foreground truncate">
                        {profesional}
                      </span>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 bg-linear-to-r from-primary to-accent rounded-full"
                          style={{ width: `${Math.min(count * 20, 100)}px` }}
                        />
                        <span className="text-sm font-semibold text-foreground min-w-8 text-right">
                          {count}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">Sin datos</p>
                )}
              </div>
            </Card>

            {/* Distribución de Resultados */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Distribución de Resultados
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm text-foreground">Exitosos</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {resultadoDistribucion.exitosos}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-sm text-foreground">
                      Requieren Seguimiento
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {resultadoDistribucion.parciales}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm text-foreground">Fallidos</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {resultadoDistribucion.fallidos}
                  </span>
                </div>
              </div>
            </Card>

            {/* Resumen */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Resumen Rápido
              </h3>
              <div className="space-y-3 text-sm">
                <p className="flex justify-between">
                  <span className="text-muted-foreground">
                    Total de Registros:
                  </span>
                  <span className="font-semibold">
                    {filteredRegistros.length}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-muted-foreground">
                    Pacientes Únicos:
                  </span>
                  <span className="font-semibold">
                    {new Set(filteredRegistros.map((r) => r.dni)).size}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-muted-foreground">
                    Procedimientos Únicos:
                  </span>
                  <span className="font-semibold">
                    {
                      new Set(filteredRegistros.map((r) => r.procedimiento))
                        .size
                    }
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Profesionales:</span>
                  <span className="font-semibold">
                    {
                      new Set(filteredRegistros.map((r) => r.profesionalACargo))
                        .size
                    }
                  </span>
                </p>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
