// components/dashboard/RegistroFilters.tsx
"use client";

import { useState, useEffect } from "react";
import { useRegistro } from "@/lib/contexts/RegistroContext";
import {
  ZONAS,
  DISTRITOS,
  PROCEDIMIENTOS,
  RESULTADOS,
  DIAGNOSTICOS,
  ESTADO_PACIENTE,
  NOMBRE_DISPOSITIVO,
} from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { ChevronDown, X, SlidersHorizontal } from "lucide-react";
import type { FilterState } from "@/lib/types";
import { getLicenciadosActivos } from "@/lib/helpers";

export function RegistroFilters() {
  const { filters, applyFilters, clearFilters } = useRegistro();
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  // Sincronizar con filtros del contexto cuando cambian
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    applyFilters(localFilters);
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    setLocalFilters({} as FilterState); // Limpia todos los filtros
    clearFilters();
  };

  // "false" SÍ cuenta como filtro activo
  const activeFilterCount = Object.values(localFilters).filter(
    (v) => v !== undefined && v !== "",
  ).length;

  return (
    <div className="bg-white rounded-2xl border border-border p-4">
      {/* Header Compacto */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-semibold text-lg text-foreground">Filtros</h3>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full font-medium">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex gap-4">
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="py-4 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer bg-gray-100 hover:bg-gray-200"
            >
              <X className="w-3 h-3 mr-1" />
              Limpiar
            </Button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors cursor-pointer"
            aria-label={isOpen ? "Contraer filtros" : "Expandir filtros"}
          >
            <ChevronDown
              className={`w-4 h-4 text-white transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Filters Content */}
      {isOpen && (
        <div className="pt-3">
          {/* Grid: 2 cols mobile → 4 cols tablet → 6 cols desktop → 8 cols 2xl */}
          <div className="flex flex-col gap-2">
            {/* ========== FILA 1 ========== */}

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8 gap-2 pb-6">
              {/* Fecha Desde */}
              <FieldGroup className="2xl:col-span-1">
                <FieldLabel className="text-xs text-muted-foreground">
                  Desde
                </FieldLabel>
                <Input
                  type="date"
                  value={localFilters.fechaDesde || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "fechaDesde",
                      e.target.value || undefined,
                    )
                  }
                  className="h-9 text-xs"
                />
              </FieldGroup>

              {/* Fecha Hasta */}
              <FieldGroup className="2xl:col-span-1">
                <FieldLabel className="text-xs text-muted-foreground">
                  Hasta
                </FieldLabel>
                <Input
                  type="date"
                  value={localFilters.fechaHasta || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "fechaHasta",
                      e.target.value || undefined,
                    )
                  }
                  className="h-9 text-xs"
                />
              </FieldGroup>

              {/* Paciente (más ancho) */}
              <FieldGroup className="2xl:col-span-2">
                <FieldLabel className="text-xs text-muted-foreground">
                  Paciente
                </FieldLabel>
                <Input
                  type="text"
                  placeholder="Nombre"
                  value={localFilters.paciente || ""}
                  onChange={(e) =>
                    handleFilterChange("paciente", e.target.value || undefined)
                  }
                  className="h-9 text-xs"
                />
              </FieldGroup>

              {/* DNI */}
              <FieldGroup className="2xl:col-span-1">
                <FieldLabel className="text-xs text-muted-foreground">
                  DNI
                </FieldLabel>
                <Input
                  type="text"
                  placeholder="DNI"
                  value={localFilters.dni || ""}
                  onChange={(e) =>
                    handleFilterChange("dni", e.target.value || undefined)
                  }
                  className="h-9 text-xs"
                />
              </FieldGroup>

              {/* Edad */}
              <FieldGroup className="2xl:col-span-1">
                <FieldLabel className="text-xs text-muted-foreground">
                  Edad
                </FieldLabel>
                <Input
                  type="number"
                  placeholder="Años"
                  value={localFilters.edad || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "edad",
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                  className="h-9 text-xs"
                  min="0"
                  max="120"
                />
              </FieldGroup>

              {/* Zona */}
              <FieldGroup className="2xl:col-span-1">
                <FieldLabel className="text-xs text-muted-foreground">
                  Zona
                </FieldLabel>
                <Select
                  value={localFilters.zona || ""}
                  onValueChange={(v) => {
                    handleFilterChange("zona", v || undefined);
                    handleFilterChange("distrito", undefined);
                  }}
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    {ZONAS.map((zona, index) => (
                      <SelectItem
                        key={`${zona}-${index}`}
                        value={zona}
                        className="text-xs"
                      >
                        {zona}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldGroup>

              {/* Distrito */}
              <FieldGroup className="2xl:col-span-1">
                <FieldLabel className="text-xs text-muted-foreground">
                  Distrito
                </FieldLabel>
                <Select
                  value={localFilters.distrito || ""}
                  onValueChange={(v) =>
                    handleFilterChange("distrito", v || undefined)
                  }
                  disabled={!localFilters.zona}
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    {DISTRITOS.map((distrito, index) => (
                      <SelectItem
                        key={`${distrito}-${index}`}
                        value={distrito}
                        className="text-xs"
                      >
                        {distrito}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldGroup>
            </div>

            {/* ========== FILA 2 ========== */}

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-10 gap-2">
              {/* Diagnóstico (más ancho) */}
              <FieldGroup className="2xl:col-span-2">
                <FieldLabel className="text-xs text-muted-foreground">
                  Diagnóstico
                </FieldLabel>
                <Select
                  value={localFilters.diagnosticoPrincipal || ""}
                  onValueChange={(v) =>
                    handleFilterChange("diagnosticoPrincipal", v || undefined)
                  }
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="text-xs max-h-48">
                    {DIAGNOSTICOS.map((diag, index) => (
                      <SelectItem
                        key={`${diag}-${index}`}
                        value={diag}
                        className="text-xs"
                      >
                        {diag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldGroup>
              {/* Procedimiento (más ancho) */}
              <FieldGroup className="2xl:col-span-2">
                <FieldLabel className="text-xs text-muted-foreground">
                  Procedimiento
                </FieldLabel>
                <Select
                  value={localFilters.procedimiento || ""}
                  onValueChange={(v) =>
                    handleFilterChange("procedimiento", v || undefined)
                  }
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="text-xs max-h-48">
                    {PROCEDIMIENTOS.map((proc, index) => (
                      <SelectItem
                        key={`${proc}-${index}`}
                        value={proc}
                        className="text-xs"
                      >
                        {proc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldGroup>

              {/* ¿Tiene Dispositivo? */}
              <FieldGroup className="2xl:col-span-1">
                <FieldLabel className="text-xs text-muted-foreground">
                  Con Dispositivos
                </FieldLabel>
                <Select
                  value={
                    localFilters.tieneDispositivo === true
                      ? "Si"
                      : localFilters.tieneDispositivo === false
                        ? "No"
                        : ""
                  }
                  onValueChange={(v: "" | "Si" | "No") => {
                    if (v === "") {
                      handleFilterChange("tieneDispositivo", undefined);
                    } else {
                      handleFilterChange("tieneDispositivo", v === "Si");
                    }
                    if (v === "No") {
                      handleFilterChange("nombreDispositivo", undefined);
                      handleFilterChange("numeroDispositivo", undefined);
                    }
                  }}
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Si">Sí</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </FieldGroup>

              {/* Nombre Dispositivo */}
              {localFilters.tieneDispositivo !== false && (
                <FieldGroup className="2xl:col-span-1">
                  <FieldLabel className="text-xs text-muted-foreground">
                    Tipo Dispositivo
                  </FieldLabel>
                  <Select
                    value={localFilters.nombreDispositivo || ""}
                    onValueChange={(v) =>
                      handleFilterChange("nombreDispositivo", v || undefined)
                    }
                  >
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent className="text-xs max-h-48">
                      {NOMBRE_DISPOSITIVO.map((tipo, index) => (
                        <SelectItem
                          key={`${tipo}-${index}`}
                          value={tipo}
                          className="text-xs"
                        >
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldGroup>
              )}

              {/* N° Dispositivo */}
              {localFilters.tieneDispositivo !== false && (
                <FieldGroup className="2xl:col-span-1">
                  <FieldLabel className="text-xs text-muted-foreground">
                    N° Dispositivo
                  </FieldLabel>
                  <Input
                    type="text"
                    placeholder="Ej. 14"
                    value={localFilters.numeroDispositivo || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "numeroDispositivo",
                        e.target.value || undefined,
                      )
                    }
                    className="h-9"
                    maxLength={2}
                  />
                </FieldGroup>
              )}

              {/* Profesional (más ancho) */}
              <FieldGroup className="2xl:col-span-1">
                <FieldLabel className="text-xs text-muted-foreground">
                  Profesional
                </FieldLabel>
                <Select
                  value={localFilters.profesionalACargo || ""}
                  onValueChange={(v) =>
                    handleFilterChange("profesionalACargo", v || undefined)
                  }
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    {/* Obtener licenciados activos */}
                    {getLicenciadosActivos().length > 0 ? (
                      getLicenciadosActivos().map((prof, index) => (
                        <SelectItem key={`${prof}-${index}`} value={prof}>
                          {prof}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No hay licenciados registrados
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </FieldGroup>

              {/* Resultado */}
              <FieldGroup className="2xl:col-span-1">
                <FieldLabel className="text-xs text-muted-foreground">
                  Resultado
                </FieldLabel>
                <Select
                  value={localFilters.resultado || ""}
                  onValueChange={(v) =>
                    handleFilterChange("resultado", v || undefined)
                  }
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    {RESULTADOS.map((resultado, index) => (
                      <SelectItem
                        key={`${resultado}-${index}`}
                        value={resultado}
                        className="text-xs"
                      >
                        {resultado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldGroup>

              {/* Estado Paciente */}
              <FieldGroup className="2xl:col-span-1">
                <FieldLabel className="text-xs text-muted-foreground">
                  Estado Paciente
                </FieldLabel>
                <Select
                  value={localFilters.estadoPaciente || ""}
                  onValueChange={(v) =>
                    handleFilterChange("estadoPaciente", v || undefined)
                  }
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    {ESTADO_PACIENTE.map((estado, index) => (
                      <SelectItem
                        key={`${estado}-${index}`}
                        value={estado}
                        className="text-xs"
                      >
                        {estado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldGroup>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap items-center gap-3 pt-3 mt-6">
            <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
              <Checkbox
                id="incidencias"
                checked={localFilters.incidencias === true}
                onCheckedChange={(checked) =>
                  handleFilterChange(
                    "incidencias",
                    checked === true ? true : undefined,
                  )
                }
              />
              <span>Con Incidencias</span>
            </label>

            <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
              <Checkbox
                id="checklistCumplido"
                checked={localFilters.checklistCumplido === true}
                onCheckedChange={(checked) =>
                  handleFilterChange(
                    "checklistCumplido",
                    checked === true ? true : undefined,
                  )
                }
              />
              <span>Checklist Cumplido</span>
            </label>

            <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
              <Checkbox
                id="cuidadorPrincipalPresente"
                checked={localFilters.cuidadorPrincipalPresente === true}
                onCheckedChange={(checked) =>
                  handleFilterChange(
                    "cuidadorPrincipalPresente",
                    checked === true ? true : undefined,
                  )
                }
              />
              <span>Cuidador Principal Presente</span>
            </label>
          </div>

          {/* Apply Button */}
          <div className="flex justify-end pt-3">
            <Button
              onClick={handleApplyFilters}
              className="bg-blue-600 hover:bg-blue-700 py-4 px-6 cursor-pointer"
            >
              Aplicar Filtros
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
