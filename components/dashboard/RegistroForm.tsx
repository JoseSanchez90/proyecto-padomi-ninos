"use client";

import { useState, useEffect, useMemo } from "react";
import { useRegistro } from "@/lib/contexts/RegistroContext";
import { ProcedimientoItem } from "@/lib/types";
import {
  ZONAS,
  DISTRITOS,
  PROCEDIMIENTOS,
  DIAGNOSTICOS,
  INCIDENCIAS,
  NOMBRE_DISPOSITIVO,
  RESULTADO,
  MATERIAL_SONDA,
  CHECKLIST_OPTIONS,
  CUIDADOR_OPTIONS,
  ESTADO_PACIENTE,
  getDistritosPorZona,
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
import { Textarea } from "@/components/ui/textarea";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { ImageUpload } from "./ImageUpload";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { getLicenciadosActivos } from "@/lib/helpers";

interface RegistroFormProps {
  editMode?: boolean;
  initialData?: any;
  onSaved?: () => void;
}

export const calcularEdad = (fechaNacimiento: string): number => {
  if (!fechaNacimiento) return 0;

  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);

  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mesActual = hoy.getMonth();
  const diaActual = hoy.getDate();
  const mesNacimiento = nacimiento.getMonth();
  const diaNacimiento = nacimiento.getDate();

  if (
    mesActual < mesNacimiento ||
    (mesActual === mesNacimiento && diaActual < diaNacimiento)
  ) {
    edad--;
  }

  return Math.max(0, edad);
};

// Helper para formatear fecha a YYYY-MM-DD (para inputs type="date")
const formatDateForInput = (dateString: string) => {
  if (!dateString) return "";
  // Si ya está en formato YYYY-MM-DD, retornar tal cual
  if (dateString.includes("-") && dateString.split("-")[0].length === 4) {
    return dateString;
  }
  // Si está en DD/MM/YYYY, convertir
  if (dateString.includes("/")) {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  return dateString;
};

export function RegistroForm({
  editMode = false,
  initialData = null,
  onSaved,
}: RegistroFormProps) {
  const { addRegistro, updateRegistro } = useRegistro(); // ← Agregado updateRegistro
  const [isLoading, setIsLoading] = useState(false);
  const [procedure, setProcedure] = useState("");
  const router = useRouter();
  const [licenciadosKey, setLicenciadosKey] = useState(0);

  // Usar esta key como dependencia:
  const licenciadosActivos = useMemo(() => {
    return getLicenciadosActivos();
  }, [licenciadosKey]); // ← Se re-evalúa cuando cambia licenciadosKey

  // Estados para imágenes
  const [imagenes, setImagenes] = useState<string[]>(() => {
    // Inicializar con imágenes existentes si es edición
    if (editMode && initialData?.imagenes) {
      return initialData.imagenes;
    }
    return [];
  });

  // Inicializar formData con datos existentes si es edición
  const [formData, setFormData] = useState(() => {
    if (editMode && initialData) {
      return {
        fecha: formatDateForInput(initialData.fecha) || "",
        horaInicio: initialData.horaInicio || "",
        horaFin: initialData.horaFin || "",
        duracion: initialData.duracion || 0,
        paciente: initialData.paciente || "",
        dni: initialData.dni || "",
        fechaNacimiento: formatDateForInput(initialData.fechaNacimiento) || "",
        edad: initialData.edad?.toString() || "",
        zona: initialData.zona || "",
        distrito: initialData.distrito || "",
        diagnosticoPrincipal: initialData.diagnosticoPrincipal || "",
        procedimientos: initialData.procedimientos || [""],
        tieneDispositivo: initialData.tieneDispositivo ? "Si" : "",
        nombreDispositivo: initialData.nombreDispositivo || "",
        materialSonda: initialData.materialSonda || "",
        numeroDispositivo: initialData.numeroDispositivo || "",
        fechaColocacion: formatDateForInput(initialData.fechaColocacion) || "",
        fechaCambio: formatDateForInput(initialData.fechaCambio) || "",
        profesionalACargo: initialData.profesionalACargo || "",
        resultado: initialData.resultado || "",
        estadoPaciente: initialData.estadoPaciente || "",
        incidencias: initialData.incidencias ? "Si" : "",
        tipoIncidencia: initialData.tipoIncidencia || "",
        descripcionIncidente: initialData.descripcionIncidente || "",
        procedimientoRepetido: initialData.procedimientoRepetido ? "Si" : "",
        checklistCumplido: initialData.checklistCumplido ? "Si" : "",
        cuidadorPrincipalPresente: initialData.cuidadorPrincipalPresente
          ? "Si"
          : "",
      };
    }
    // Valores por defecto para modo creación
    return {
      fecha: (() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      })(),
      horaInicio: "",
      horaFin: "",
      duracion: 0,
      paciente: "",
      dni: "",
      fechaNacimiento: "",
      edad: "",
      zona: "",
      distrito: "",
      diagnosticoPrincipal: "",
      procedimientos: [],
      tieneDispositivo: "",
      nombreDispositivo: "",
      materialSonda: "",
      numeroDispositivo: "",
      fechaColocacion: "",
      fechaCambio: "",
      profesionalACargo: "",
      estadoPaciente: "",
      resultado: "",
      incidencias: "",
      tipoIncidencia: "",
      descripcionIncidente: "",
      procedimientoRepetido: "",
      checklistCumplido: "",
      cuidadorPrincipalPresente: "",
    };
  });

  // Estado inicial con campos de dispositivo
  const [procedimientos, setProcedimientos] = useState<ProcedimientoItem[]>(
    editMode && initialData?.procedimientos
      ? initialData.procedimientos
      : [
          {
            id: `proc_${Date.now()}`,
            procedimiento: "",
            diagnosticoPrincipal: "",
            horaInicio: formData.horaInicio,
            horaFin: formData.horaFin,
            duracion: formData.duracion,
            resultado: "",
            tieneDispositivo: false,
            nombreDispositivo: undefined,
            materialSonda: undefined,
            numeroDispositivo: undefined,
            fechaColocacion: undefined,
            fechaCambio: undefined,
          },
        ],
  );

  // Función para agregar nuevo procedimiento
  const addProcedimiento = () => {
    const newProc: ProcedimientoItem = {
      id: `proc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      procedimiento: "",
      diagnosticoPrincipal: "",
      horaInicio: "",
      horaFin: "",
      duracion: 0,
      resultado: "",
      tieneDispositivo: false,
      nombreDispositivo: undefined,
      materialSonda: undefined,
      numeroDispositivo: undefined,
      fechaColocacion: undefined,
      fechaCambio: undefined,
    };
    setProcedimientos([...procedimientos, newProc]);
  };

  // Función para eliminar procedimiento
  const removeProcedimiento = (index: number) => {
    if (procedimientos.length > 1) {
      setProcedimientos(procedimientos.filter((_, i) => i !== index));
    }
  };

  // Función para actualizar un procedimiento específico
  const updateProcedimiento = (
    index: number,
    field: keyof ProcedimientoItem,
    value: any,
  ) => {
    setProcedimientos((prev) =>
      prev.map((proc, i) => (i === index ? { ...proc, [field]: value } : proc)),
    );

    // Si es el primer procedimiento y actualizamos hora/duración, sincronizar con formData
    if (
      index === 0 &&
      (field === "horaInicio" || field === "horaFin" || field === "duracion")
    ) {
      handleInputChange(field, value);
    }
  };

  // Efecto para sincronizar si initialData cambia (útil si se carga asíncronamente)
  useEffect(() => {
    if (editMode && initialData && initialData.id) {
      setFormData((prev) => ({
        ...prev,
        fecha: formatDateForInput(initialData.fecha) || prev.fecha,
        horaInicio: initialData.horaInicio || prev.horaInicio,
        horaFin: initialData.horaFin || prev.horaFin,
        duracion: initialData.duracion ?? prev.duracion,
        paciente: initialData.paciente || prev.paciente,
        dni: initialData.dni || prev.dni,
        fechaNacimiento:
          formatDateForInput(initialData.fechaNacimiento) ||
          prev.fechaNacimiento,
        edad: initialData.edad?.toString() || prev.edad,
        zona: initialData.zona || prev.zona,
        distrito: initialData.distrito || prev.distrito,
        diagnosticoPrincipal:
          initialData.diagnosticoPrincipal || prev.diagnosticoPrincipal,
        procedimientos: initialData.procedimientos || prev.procedimientos,
        tieneDispositivo: initialData.tieneDispositivo
          ? "Si"
          : prev.tieneDispositivo,
        nombreDispositivo:
          initialData.nombreDispositivo || prev.nombreDispositivo,
        materialSonda: initialData.materialSonda || prev.materialSonda,
        numeroDispositivo:
          initialData.numeroDispositivo || prev.numeroDispositivo,
        fechaColocacion:
          formatDateForInput(initialData.fechaColocacion) ||
          prev.fechaColocacion,
        fechaCambio:
          formatDateForInput(initialData.fechaCambio) || prev.fechaCambio,
        profesionalACargo:
          initialData.profesionalACargo || prev.profesionalACargo,
        estadoPaciente: initialData.estadoPaciente || prev.estadoPaciente,
        resultado: initialData.resultado || prev.resultado,
        incidencias: initialData.incidencias ? "Si" : prev.incidencias,
        tipoIncidencia: initialData.tipoIncidencia || prev.tipoIncidencia,
        descripcionIncidente:
          initialData.descripcionIncidente || prev.descripcionIncidente,
        procedimientoRepetido: initialData.procedimientoRepetido
          ? "Si"
          : prev.procedimientoRepetido,
        checklistCumplido: initialData.checklistCumplido
          ? "Si"
          : prev.checklistCumplido,
        cuidadorPrincipalPresente: initialData.cuidadorPrincipalPresente
          ? "Si"
          : prev.cuidadorPrincipalPresente,
      }));

      if (initialData.imagenes) {
        setImagenes(initialData.imagenes);
      }
      // Cargar procedimientos múltiples
      if (initialData.procedimientos && initialData.procedimientos.length > 0) {
        setProcedimientos(initialData.procedimientos);
      }
    }
  }, [editMode, initialData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Recalcular duración cuando cambian horas
      if (
        (field === "horaInicio" || field === "horaFin") &&
        updated.horaInicio &&
        updated.horaFin
      ) {
        const [startH, startM] = updated.horaInicio.split(":").map(Number);
        const [endH, endM] = updated.horaFin.split(":").map(Number);
        const startMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;
        updated.duracion = Math.max(0, endMinutes - startMinutes);
      }

      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ 1. Validar que cada procedimiento tenga nombre
    if (procedimientos.some((p) => !p.procedimiento?.trim())) {
      gooeyToast.error("Procedimientos incompletos", {
        description: "Seleccione al menos un procedimiento",
        duration: 4000,
      });
      return;
    }

    // ✅ 2. Validar campos requeridos del registro principal
    if (!formData.paciente || !formData.dni || !formData.fecha) {
      gooeyToast.error("Campos requeridos", {
        description: "Completa paciente, DNI y fecha",
        duration: 4000,
      });
      return;
    }

    // ✅ 3. Validar diagnóstico (nivel registro)
    if (!formData.diagnosticoPrincipal) {
      gooeyToast.error("Diagnóstico requerido", {
        description: "Seleccione un diagnóstico principal",
        duration: 4000,
      });
      return;
    }

    // ✅ 4. Validar resultado (nivel registro)
    if (!formData.resultado) {
      gooeyToast.error("Resultado requerido", {
        description: "Seleccione el resultado del procedimiento",
        duration: 4000,
      });
      return;
    }

    // ✅ 5. Validar profesional a cargo
    if (!formData.profesionalACargo) {
      gooeyToast.error("Profesional requerido", {
        description: "Seleccione el profesional a cargo",
        duration: 4000,
      });
      return;
    }

    setIsLoading(true);

    setIsLoading(true);
    try {
      const registroData = {
        fecha: formData.fecha,
        horaInicio: formData.horaInicio,
        horaFin: formData.horaFin,
        duracion: formData.duracion,
        paciente: formData.paciente,
        dni: formData.dni,
        fechaNacimiento: formData.fechaNacimiento,
        edad: parseInt(formData.edad) || 0,
        zona: formData.zona,
        distrito: formData.distrito,
        diagnosticoPrincipal: formData.diagnosticoPrincipal,
        tieneDispositivo: formData.tieneDispositivo === "Si",
        nombreDispositivo: formData.nombreDispositivo || undefined,
        materialSonda: formData.materialSonda || undefined,
        numeroDispositivo: formData.numeroDispositivo || undefined,
        fechaColocacion: formData.fechaColocacion || undefined,
        fechaCambio: formData.fechaCambio || undefined,
        profesionalACargo: formData.profesionalACargo,
        estadoPaciente: formData.estadoPaciente || "",
        resultado:
          (formData.resultado as
            | "Exitoso"
            | "Requiere seguimiento"
            | "Fallido"
            | "Rechazado") || "Exitoso",
        incidencias: formData.incidencias === "Si",
        tipoIncidencia: formData.tipoIncidencia || undefined,
        descripcionIncidente: formData.descripcionIncidente || undefined,
        procedimientoRepetido: formData.procedimientoRepetido === "Si",
        checklistCumplido: formData.checklistCumplido === "Si",
        cuidadorPrincipalPresente: formData.cuidadorPrincipalPresente === "Si",
        procedimientos: procedimientos
          .filter((p) => p.procedimiento)
          .map((p) => ({
            ...p,
            nombreDispositivo: p.nombreDispositivo || undefined,
            materialSonda: p.materialSonda || undefined,
            numeroDispositivo: p.numeroDispositivo || undefined,
            fechaColocacion: p.fechaColocacion || undefined,
            fechaCambio: p.fechaCambio || undefined,
          })),
        imagenes: imagenes,
      };

      if (editMode && initialData?.id) {
        // MODO EDICIÓN: Actualizar registro existente
        await updateRegistro(initialData.id, registroData);
        gooeyToast.success("Registro actualizado", {
          description: `Los cambios han sido guardados`,
          duration: 3000,
        });
      } else {
        // MODO CREACIÓN: Agregar nuevo registro
        await addRegistro(registroData);
        gooeyToast.success("Registro guardado", {
          description: `El paciente ha sido registrado correctamente`,
          duration: 3000,
        });
      }

      // Callback opcional después de guardar
      if (onSaved) {
        onSaved();
      }

      // Reset form SOLO si es modo creación
      if (!editMode) {
        setFormData({
          fecha: (() => {
            const d = new Date();
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
          })(),
          horaInicio: "",
          horaFin: "",
          duracion: 0,
          paciente: "",
          dni: "",
          fechaNacimiento: "",
          edad: "",
          zona: "",
          distrito: "",
          diagnosticoPrincipal: "",
          procedimientos: [],
          tieneDispositivo: "",
          nombreDispositivo: "",
          materialSonda: "",
          numeroDispositivo: "",
          fechaColocacion: "",
          fechaCambio: "",
          profesionalACargo: "",
          estadoPaciente: "",
          resultado: "",
          incidencias: "",
          tipoIncidencia: "",
          descripcionIncidente: "",
          procedimientoRepetido: "",
          checklistCumplido: "",
          cuidadorPrincipalPresente: "",
        });
        setImagenes([]);
        setProcedure("");

        // Redirigir solo en modo creación
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 2000);
      } else {
        // En modo edición, solo redirigir sin resetear
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1500);
      }
    } catch (error) {
      gooeyToast.error("Error al guardar", {
        description: "Intente nuevamente más tarde",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-4xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl 2xl:text-2xl font-bold text-foreground">
          {editMode ? "Editar Paciente" : "Registrar Paciente"}
        </h2>
        <p className="text-xs 2xl:text-sm text-muted-foreground mt-1">
          {editMode
            ? "Modifica los datos del paciente registrado"
            : "Ingrese los datos del paciente"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Fecha, Hora Inicio, Hora Fin, Duración */}
        <div className="grid grid-cols-2 md:grid-cols-12 2xl:grid-cols-22 gap-2">
          <FieldGroup className="col-span-1 lg:col-span-2">
            <Field>
              <FieldLabel className="text-xs">Fecha *</FieldLabel>
              <Input
                type="date"
                value={formData.fecha}
                onChange={(e) => handleInputChange("fecha", e.target.value)}
                className="h-9 text-sm"
                required
              />
            </Field>
          </FieldGroup>
          <FieldGroup className="col-span-1 lg:col-span-2">
            <Field>
              <FieldLabel className="text-xs">Hora Inicio *</FieldLabel>
              <Input
                type="time"
                value={formData.horaInicio}
                onChange={(e) =>
                  handleInputChange("horaInicio", e.target.value)
                }
                className="h-9 text-sm"
              />
            </Field>
          </FieldGroup>
          <FieldGroup className="col-span-1 lg:col-span-2">
            <Field>
              <FieldLabel className="text-xs">Hora Fin *</FieldLabel>
              <Input
                type="time"
                value={formData.horaFin}
                onChange={(e) => handleInputChange("horaFin", e.target.value)}
                className="h-9 text-sm"
              />
            </Field>
          </FieldGroup>
          <FieldGroup className="col-span-1 lg:col-span-2">
            <Field>
              <FieldLabel className="text-xs">Duración (min)</FieldLabel>
              <Input
                type="number"
                value={formData.duracion}
                disabled
                className="bg-muted h-9 text-sm"
              />
            </Field>
          </FieldGroup>
          <FieldGroup className="col-span-2 lg:col-span-4">
            <Field>
              <FieldLabel className="text-xs">Paciente *</FieldLabel>
              <Input
                type="text"
                placeholder="Nombre"
                value={formData.paciente}
                onChange={(e) => handleInputChange("paciente", e.target.value)}
                className="h-9 text-sm"
                required
              />
            </Field>
          </FieldGroup>
          <FieldGroup className="col-span-1 lg:col-span-2">
            <Field>
              <FieldLabel className="text-xs">DNI *</FieldLabel>
              <Input
                type="text"
                placeholder="12345678"
                value={formData.dni}
                onChange={(e) => handleInputChange("dni", e.target.value)}
                className="h-9 text-sm"
                required
              />
            </Field>
          </FieldGroup>
          <FieldGroup className="col-span-1 lg:col-span-2">
            <Field>
              <FieldLabel className="text-xs">Fecha Nacimiento *</FieldLabel>
              <Input
                type="date"
                value={formData.fechaNacimiento}
                onChange={(e) => {
                  const fechaNac = e.target.value;
                  handleInputChange("fechaNacimiento", fechaNac);

                  if (fechaNac) {
                    const edad = calcularEdad(fechaNac);
                    handleInputChange("edad", edad.toString());
                  } else {
                    handleInputChange("edad", "");
                  }
                }}
                className="h-9 text-sm"
                max={new Date().toISOString().split("T")[0]}
              />
            </Field>
          </FieldGroup>
          <FieldGroup className="col-span-1">
            <Field>
              <FieldLabel className="text-xs">Edad</FieldLabel>
              <Input
                type="number"
                value={formData.edad}
                disabled
                className="bg-muted h-9 text-sm"
                placeholder="—"
              />
            </Field>
          </FieldGroup>
          <FieldGroup className="col-span-1 lg:col-span-2">
            <Field>
              <FieldLabel className="text-xs">Zona *</FieldLabel>
              <Select
                value={formData.zona}
                onValueChange={(v) => {
                  handleInputChange("zona", v);
                  handleInputChange("distrito", "");
                }}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  {ZONAS.map((zona, index) => (
                    <SelectItem key={`${zona}-${index}`} value={zona}>
                      {zona}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <FieldGroup className="col-span-2 lg:col-span-3">
            <Field>
              <FieldLabel className="text-xs">Distrito *</FieldLabel>
              <Select
                value={formData.distrito}
                onValueChange={(v) => handleInputChange("distrito", v)}
                disabled={!formData.zona}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  {(formData.zona
                    ? getDistritosPorZona(formData.zona)
                    : DISTRITOS
                  ).map((distrito, index) => (
                    <SelectItem key={`${distrito}-${index}`} value={distrito}>
                      {distrito}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </div>

        {/* Row 2: Profesional, Diagnóstico, Procedimiento */}
        <div className="grid grid-cols-2 md:grid-cols-11 2xl:grid-cols-22 gap-2">
          {/* Profesional a Cargo - DINÁMICO desde Gestión de Personal */}
          <FieldGroup className="col-span-2 lg:col-span-2">
            <Field>
              <FieldLabel className="text-xs">Profesional a Cargo *</FieldLabel>

              <Select
                value={formData.profesionalACargo}
                onValueChange={(v) => handleInputChange("profesionalACargo", v)}
                disabled={licenciadosActivos.length === 0}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue
                    placeholder={
                      licenciadosActivos.length === 0
                        ? "Sin licenciados registrados"
                        : "Seleccione"
                    }
                  />
                </SelectTrigger>

                <SelectContent className="max-h-48">
                  {licenciadosActivos.length > 0 ? (
                    licenciadosActivos.map((prof, index) => (
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

              {licenciadosActivos.length === 0 && (
                <p className="text-[10px] text-muted-foreground mt-1">
                  Registra en{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard/personal")}
                    className="text-blue-600 hover:underline"
                  >
                    Gestión de Personal
                  </button>
                </p>
              )}
            </Field>
          </FieldGroup>

          <FieldGroup className="lg:col-span-2">
            <Field>
              <FieldLabel className="text-xs">Diagnóstico *</FieldLabel>
              <Select
                value={formData.diagnosticoPrincipal}
                onValueChange={(v) =>
                  handleInputChange("diagnosticoPrincipal", v)
                }
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  {DIAGNOSTICOS.map((diag, i) => (
                    <SelectItem key={`${diag}-${i}`} value={diag}>
                      {diag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>

          {/* ========== PROCEDIMIENTOS (Layout 100% Horizontal) ========== */}
          <FieldGroup className="col-span-2 lg:col-span-8">
            <Field>
              <FieldLabel className="text-xs">Procedimientos *</FieldLabel>
              <div className="space-y-4">
                {procedimientos.map((proc, index) => (
                  <div
                    key={proc.id || index}
                    className="p-4 border border-border rounded-xl bg-muted/30"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-muted-foreground">
                        Procedimiento #{index + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        {index === 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={addProcedimiento}
                            className="h-8 w-8 text-blue-600 hover:text-white bg-blue-200 hover:bg-blue-400 shrink-0"
                            title="Agregar procedimiento"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        )}
                        {procedimientos.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeProcedimiento(index)}
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
                            title="Eliminar procedimiento"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* ✅ GRID ÚNICO - Sin anidamiento */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                      {/* Columna 1-4: Procedimiento */}
                      <div className="lg:col-span-4 space-y-2">
                        <FieldLabel className="text-xs">
                          Nombre del Procedimiento *
                        </FieldLabel>
                        <Select
                          value={proc.procedimiento}
                          onValueChange={(v) =>
                            updateProcedimiento(index, "procedimiento", v)
                          }
                        >
                          <SelectTrigger className="h-9 text-sm w-full">
                            <SelectValue
                              placeholder={`Procedimiento ${index + 1}`}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {PROCEDIMIENTOS.map((procItem, i) => (
                              <SelectItem
                                key={`${procItem}-${i}`}
                                value={procItem}
                              >
                                {procItem}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Columna 5-12: Todos los campos de dispositivo */}
                      <div className="lg:col-span-8">
                        {/* FILA 1: ¿Tiene? + Nombre Dispositivo */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <FieldLabel className="text-xs">
                              ¿Tiene Dispositivo?
                            </FieldLabel>
                            <Select
                              value={proc.tieneDispositivo ? "Si" : "No"}
                              onValueChange={(v: "Si" | "No") => {
                                const tiene = v === "Si";
                                updateProcedimiento(
                                  index,
                                  "tieneDispositivo",
                                  tiene,
                                );
                                if (!tiene) {
                                  updateProcedimiento(
                                    index,
                                    "nombreDispositivo",
                                    undefined,
                                  );
                                  updateProcedimiento(
                                    index,
                                    "materialSonda",
                                    undefined,
                                  );
                                  updateProcedimiento(
                                    index,
                                    "numeroDispositivo",
                                    undefined,
                                  );
                                  updateProcedimiento(
                                    index,
                                    "fechaColocacion",
                                    undefined,
                                  );
                                  updateProcedimiento(
                                    index,
                                    "fechaCambio",
                                    undefined,
                                  );
                                }
                              }}
                            >
                              <SelectTrigger className="h-9 text-sm">
                                <SelectValue placeholder="Seleccione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="No">No</SelectItem>
                                <SelectItem value="Si">Sí</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <FieldLabel className="text-xs">
                              Nombre Dispositivo
                            </FieldLabel>
                            <Select
                              value={proc.nombreDispositivo || ""}
                              onValueChange={(v) => {
                                updateProcedimiento(
                                  index,
                                  "nombreDispositivo",
                                  v,
                                );
                                if (!v.startsWith("Sonda")) {
                                  updateProcedimiento(
                                    index,
                                    "materialSonda",
                                    undefined,
                                  );
                                }
                              }}
                              disabled={!proc.tieneDispositivo}
                            >
                              <SelectTrigger className="h-9 text-sm">
                                <SelectValue placeholder="Seleccione" />
                              </SelectTrigger>
                              <SelectContent>
                                {NOMBRE_DISPOSITIVO.map((tipo, i) => (
                                  <SelectItem key={`${tipo}-${i}`} value={tipo}>
                                    {tipo}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* FILA 2: Material de Sonda (si es sonda) */}
                        {proc.nombreDispositivo?.startsWith("Sonda") && (
                          <div className="mt-3">
                            <FieldLabel className="text-xs">
                              Material de Sonda
                            </FieldLabel>
                            <Select
                              value={proc.materialSonda || ""}
                              onValueChange={(
                                v: "Siliconada" | "PVC" | "Latex" | "",
                              ) =>
                                updateProcedimiento(index, "materialSonda", v)
                              }
                              disabled={!proc.tieneDispositivo}
                            >
                              <SelectTrigger className="h-9 text-sm">
                                <SelectValue placeholder="Seleccione" />
                              </SelectTrigger>
                              <SelectContent>
                                {MATERIAL_SONDA.map((material, i) => (
                                  <SelectItem
                                    key={`${material}-${i}`}
                                    value={material}
                                  >
                                    {material}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {/* FILA 3: Número + Colocado + Cambio (3 EN UNA SOLA FILA) */}
                        {proc.tieneDispositivo && (
                          <div className="grid grid-cols-3 gap-3 mt-3">
                            <div>
                              <FieldLabel className="text-xs">
                                Número
                              </FieldLabel>
                              <Input
                                type="text"
                                value={proc.numeroDispositivo || ""}
                                onChange={(e) =>
                                  updateProcedimiento(
                                    index,
                                    "numeroDispositivo",
                                    e.target.value,
                                  )
                                }
                                className="h-9 text-xs"
                                placeholder="123"
                                maxLength={3}
                                disabled={!proc.tieneDispositivo}
                              />
                            </div>

                            <div>
                              <FieldLabel className="text-xs">
                                Colocado
                              </FieldLabel>
                              <Input
                                type="date"
                                value={proc.fechaColocacion || ""}
                                onChange={(e) =>
                                  updateProcedimiento(
                                    index,
                                    "fechaColocacion",
                                    e.target.value,
                                  )
                                }
                                className="h-9 text-xs"
                                disabled={!proc.tieneDispositivo}
                              />
                            </div>

                            <div>
                              <FieldLabel className="text-xs">
                                Cambio
                              </FieldLabel>
                              <Input
                                type="date"
                                value={proc.fechaCambio || ""}
                                onChange={(e) =>
                                  updateProcedimiento(
                                    index,
                                    "fechaCambio",
                                    e.target.value,
                                  )
                                }
                                className="h-9 text-xs"
                                disabled={!proc.tieneDispositivo}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Field>
          </FieldGroup>
        </div>

        {/* Row 3: Checkboxes y Resultado */}
        <div className="grid grid-cols-2 md:grid-cols-6 2xl:grid-cols-10 gap-2">
          <FieldGroup className="col-span-1">
            <Field>
              <FieldLabel className="text-xs">Proced. Repetido *</FieldLabel>
              <Select
                value={formData.procedimientoRepetido}
                onValueChange={(v: "" | "Si" | "No") =>
                  handleInputChange("procedimientoRepetido", v)
                }
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Si">Si</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel className="text-xs">Checklist Cumplido *</FieldLabel>
              <Select
                value={formData.checklistCumplido}
                onValueChange={(v: "" | "Si" | "No") =>
                  handleInputChange("checklistCumplido", v)
                }
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  {CHECKLIST_OPTIONS.map((opt, idx) => (
                    <SelectItem key={`checklist-${idx}`} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel className="text-xs">Cuidador Principal *</FieldLabel>
              <Select
                value={formData.cuidadorPrincipalPresente}
                onValueChange={(v: "" | "Si" | "No") =>
                  handleInputChange("cuidadorPrincipalPresente", v)
                }
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  {CUIDADOR_OPTIONS.map((opt, idx) => (
                    <SelectItem key={`cuidador-${idx}`} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>

          <FieldGroup className="lg:col-span-1">
            <Field>
              <FieldLabel className="text-xs">Resultado *</FieldLabel>
              <Select
                value={formData.resultado}
                onValueChange={(v) => handleInputChange("resultado", v)}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  {RESULTADO.map((resultado, index) => (
                    <SelectItem key={`${resultado}-${index}`} value={resultado}>
                      {resultado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>

          <FieldGroup className="col-span-1 lg:col-span-1">
            <Field>
              <FieldLabel className="text-xs">Incidencias *</FieldLabel>
              <Select
                value={formData.incidencias}
                onValueChange={(v: "" | "Si" | "No") =>
                  handleInputChange("incidencias", v)
                }
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">Ninguna</SelectItem>
                  <SelectItem value="Si">SÍ - Hay incidencias</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>

          {formData.incidencias === "Si" && (
            <FieldGroup className="col-span-1 lg:col-span-1">
              <Field>
                <FieldLabel className="text-xs">Tipo de Incidencia</FieldLabel>
                <Select
                  value={formData.tipoIncidencia}
                  onValueChange={(v) => handleInputChange("tipoIncidencia", v)}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Seleccione" />
                  </SelectTrigger>
                  <SelectContent>
                    {INCIDENCIAS.map((inc, idx) => (
                      <SelectItem key={`incidencia-${idx}`} value={inc}>
                        {inc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
          )}

          {formData.incidencias === "Si" && (
            <div className="col-span-2 md:col-span-4 gap-2">
              <FieldGroup>
                <Field>
                  <FieldLabel className="text-xs">
                    Descripción de Incidente
                  </FieldLabel>
                  <Textarea
                    placeholder="Describa detalladamente el incidente"
                    value={formData.descripcionIncidente}
                    onChange={(e) =>
                      handleInputChange("descripcionIncidente", e.target.value)
                    }
                    className="min-h-20 text-sm resize-none"
                    rows={3}
                  />
                </Field>
              </FieldGroup>
            </div>
          )}
          {/* Estado Paciente */}
          <FieldGroup className="lg:col-span-1">
            <Field>
              <FieldLabel className="text-xs">Estado Paciente *</FieldLabel>
              <Select
                value={formData.estadoPaciente}
                onValueChange={(v) => handleInputChange("estadoPaciente", v)}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
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
            </Field>
          </FieldGroup>
        </div>

        {/* Row 4: Image Upload */}
        <div className="grid grid-cols-4 gap-2">
          <FieldGroup className="col-span-4">
            <Field>
              <FieldLabel className="text-xs">
                Imágenes (opcional, máx. 4)
              </FieldLabel>
              <ImageUpload
                images={imagenes}
                onImagesChange={setImagenes}
                maxImages={4}
              />
            </Field>
          </FieldGroup>
        </div>

        {/* Buttons */}
        <div className="w-fit flex gap-3">
          {/* Botón Guardar/Actualizar */}
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-800 cursor-pointer px-6 py-4"
          >
            {isLoading
              ? "Guardando..."
              : editMode
                ? "Actualizar Registro"
                : "Guardar Registro"}
          </Button>

          {/* Botón Cancelar con confirmación dinámica */}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              // Mostrar toast con acción de confirmación
              gooeyToast.info("Cancelado", {
                description: "El registro ha sido descartado",
                duration: 3000,
              });
              // Redirigir al dashboard descartando cambios
              router.push("/dashboard");
              router.refresh();
            }}
            className="bg-gray-200 hover:bg-gray-300 cursor-pointer px-6 py-4"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
