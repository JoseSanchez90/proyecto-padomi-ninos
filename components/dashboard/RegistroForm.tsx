"use client";

import { useState, useEffect } from "react";
import { useRegistro } from "@/lib/contexts/RegistroContext";
import {
  ZONAS,
  DISTRITOS,
  PROCEDIMIENTOS,
  RESULTADOS,
  DIAGNOSTICOS,
  INCIDENCIAS,
  NOMBRE_DISPOSITIVO,
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
import { useRouter } from "next/navigation";
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
        procedimiento: initialData.procedimiento || "",
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
      procedimiento: "",
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
        procedimiento: initialData.procedimiento || prev.procedimiento,
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
        procedimiento: formData.procedimiento,
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
        imagenes: imagenes,
      };

      if (editMode && initialData?.id) {
        // MODO EDICIÓN: Actualizar registro existente
        updateRegistro(initialData.id, registroData);
        gooeyToast.success("Registro actualizado", {
          description: `Los cambios han sido guardados`,
          duration: 3000,
        });
      } else {
        // MODO CREACIÓN: Agregar nuevo registro
        addRegistro(registroData);
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
          procedimiento: "",
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
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Seleccione" />
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

              {/* Mensaje informativo si no hay licenciados */}
              {getLicenciadosActivos().length === 0 && (
                <p className="text-[10px] text-muted-foreground mt-1">
                  Registra licenciados en{" "}
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
          <FieldGroup className="col-span-2 lg:col-span-3">
            <Field>
              <FieldLabel className="text-xs">
                Diagnóstico Principal *
              </FieldLabel>
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
                  {DIAGNOSTICOS.map((diag, index) => (
                    <SelectItem key={`${diag}-${index}`} value={diag}>
                      {diag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <FieldGroup className="col-span-2 lg:col-span-4">
            <Field>
              <FieldLabel className="text-xs">Procedimiento *</FieldLabel>
              <Select
                value={formData.procedimiento}
                onValueChange={(v) => handleInputChange("procedimiento", v)}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  {PROCEDIMIENTOS.map((proc, index) => (
                    <SelectItem key={`${proc}-${index}`} value={proc}>
                      {proc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>

          {/* ¿Tiene Dispositivo? */}
          <FieldGroup className="col-span-1 lg:col-span-2">
            <Field>
              <FieldLabel className="text-xs">¿Tiene Dispositivo? *</FieldLabel>
              <Select
                value={formData.tieneDispositivo}
                onValueChange={(v: "" | "Si" | "No") => {
                  handleInputChange("tieneDispositivo", v);
                  if (v === "No") {
                    handleInputChange("nombreDispositivo", "");
                    handleInputChange("materialSonda", "");
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
            </Field>
          </FieldGroup>

          {/* Nombre Dispositivo (solo si tiene dispositivo) */}
          {formData.tieneDispositivo === "Si" && (
            <FieldGroup className="col-span-1 lg:col-span-3">
              <Field>
                <FieldLabel className="text-xs">Nombre Dispositivo</FieldLabel>
                <Select
                  value={formData.nombreDispositivo}
                  onValueChange={(v) => {
                    handleInputChange("nombreDispositivo", v);
                    if (!v.startsWith("Sonda")) {
                      handleInputChange("materialSonda", "");
                    }
                  }}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Seleccione" />
                  </SelectTrigger>
                  <SelectContent>
                    {NOMBRE_DISPOSITIVO.map((tipo, index) => (
                      <SelectItem key={`${tipo}-${index}`} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
          )}

          {/* Material de Sonda (solo si el dispositivo empieza con "Sonda") */}
          {formData.tieneDispositivo === "Si" &&
            formData.nombreDispositivo?.startsWith("Sonda") && (
              <FieldGroup className="col-span-1 lg:col-span-2">
                <Field>
                  <FieldLabel className="text-xs">Material de Sonda</FieldLabel>
                  <Select
                    value={formData.materialSonda}
                    onValueChange={(v: "" | "Siliconada" | "PVC" | "Latex") =>
                      handleInputChange("materialSonda", v)
                    }
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      {MATERIAL_SONDA.map((material, index) => (
                        <SelectItem
                          key={`${material}-${index}`}
                          value={material}
                        >
                          {material}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
            )}

          {/* Número de Dispositivo (solo si tiene dispositivo) */}
          {formData.tieneDispositivo === "Si" && (
            <FieldGroup className="lg:col-span-2">
              <Field>
                <FieldLabel className="text-xs">
                  Número de Dispositivo
                </FieldLabel>
                <Input
                  type="text"
                  value={formData.numeroDispositivo}
                  onChange={(e) =>
                    handleInputChange("numeroDispositivo", e.target.value)
                  }
                  className="h-9 text-xs"
                  placeholder="Ej. 123"
                  minLength={1}
                  maxLength={3}
                />
              </Field>
            </FieldGroup>
          )}

          {/* Fecha de Colocación (solo si tiene dispositivo) */}
          {formData.tieneDispositivo === "Si" && (
            <FieldGroup className="col-span-1 lg:col-span-2">
              <Field>
                <FieldLabel className="text-xs">Fecha Colocación</FieldLabel>
                <Input
                  type="date"
                  value={formData.fechaColocacion}
                  onChange={(e) =>
                    handleInputChange("fechaColocacion", e.target.value)
                  }
                  className="h-9 text-xs"
                />
              </Field>
            </FieldGroup>
          )}

          {/* Fecha Próxima Colocación (solo si tiene dispositivo) */}
          {formData.tieneDispositivo === "Si" && (
            <FieldGroup className="col-span-1 lg:col-span-2">
              <Field>
                <FieldLabel className="text-xs">Fecha Cambio</FieldLabel>
                <Input
                  type="date"
                  value={formData.fechaCambio}
                  onChange={(e) =>
                    handleInputChange("fechaCambio", e.target.value)
                  }
                  className="h-9 text-xs"
                />
              </Field>
            </FieldGroup>
          )}
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
                  {RESULTADOS.map((resultado, index) => (
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
