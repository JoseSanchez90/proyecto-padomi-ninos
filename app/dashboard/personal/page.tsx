// app/dashboard/personal/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  UserPlus,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Award,
} from "lucide-react";
import { calcularEdad } from "@/components/dashboard/RegistroForm";
import { initializeMockData } from "@/lib/mockData";

// Tipos locales (puedes moverlos a lib/types.ts)
type RolPersonal = "Licenciado" | "Administrador";
type EstadoPersonal = "Habilitado" | "Ausente" | "No labora";

interface PersonalRecord {
  id: string;
  dni: string;
  nombre: string;
  fechaNacimiento: string;
  edad: number;
  rol: RolPersonal;
  estado: EstadoPersonal;
  fechaIngreso: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  licenciaProfesional?: string;
  turnosPreferidos?: string[];
  fotoUrl?: string;
  createdAt: string;
}

const ROLES: RolPersonal[] = ["Licenciado", "Administrador"];
const ESTADOS: EstadoPersonal[] = ["Habilitado", "Ausente", "No labora"];

export default function GestionPersonalPage() {
  const router = useRouter();
  const [personal, setPersonal] = useState<PersonalRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<EstadoPersonal | "Todos">(
    "Todos",
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<PersonalRecord | null>(
    null,
  );

  const [formData, setFormData] = useState({
    dni: "",
    nombre: "",
    fechaNacimiento: "",
    edad: 0,
    rol: "Licenciado" as RolPersonal,
    estado: "Habilitado" as EstadoPersonal,
    fechaIngreso: new Date().toISOString().split("T")[0],
    telefono: "",
    email: "",
    direccion: "",
    licenciaProfesional: "",
  });

  useEffect(() => {
    initializeMockData();
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("padomi_personal");
    if (stored) {
      try {
        setPersonal(JSON.parse(stored));
      } catch (error) {
        console.error("Error loading personal:", error);
      }
    }
  }, []);

  // Cargar datos de localStorage al montar
  useEffect(() => {
    const stored = localStorage.getItem("padomi_personal");
    if (stored) {
      try {
        setPersonal(JSON.parse(stored));
      } catch (error) {
        console.error("Error loading personal:", error);
      }
    }
  }, []);

  // Guardar en localStorage cuando cambie personal
  useEffect(() => {
    localStorage.setItem("padomi_personal", JSON.stringify(personal));
  }, [personal]);

  // Calcular edad cuando cambia fechaNacimiento
  useEffect(() => {
    if (formData.fechaNacimiento) {
      const edad = calcularEdad(formData.fechaNacimiento);
      setFormData((prev) => ({ ...prev, edad }));
    }
  }, [formData.fechaNacimiento]);

  // Filtrar personal
  const personalFiltrado = personal.filter((p) => {
    const matchesSearch =
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.dni.includes(searchTerm);
    const matchesEstado = filterEstado === "Todos" || p.estado === filterEstado;
    return matchesSearch && matchesEstado;
  });

  // Manejar cambios en el formulario
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Guardar nuevo o actualizar existente
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.dni || !formData.nombre || !formData.fechaNacimiento) {
      alert("Complete los campos obligatorios");
      return;
    }

    // Sin updatedAt para evitar error de tipo
    const personalData: Omit<PersonalRecord, "id" | "createdAt"> = {
      ...formData,
    };

    if (editingPerson) {
      // Actualizar existente
      setPersonal((prev) =>
        prev.map((p) =>
          p.id === editingPerson.id ? { ...p, ...personalData } : p,
        ),
      );
    } else {
      // Crear nuevo
      const newPerson: PersonalRecord = {
        ...personalData,
        id: `personal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      };
      setPersonal((prev) => [newPerson, ...prev]);
    }

    // Reset y cerrar
    resetForm();
    setIsDialogOpen(false);
  };

  // Editar persona existente
  const handleEdit = (person: PersonalRecord) => {
    setEditingPerson(person);
    setFormData({
      dni: person.dni,
      nombre: person.nombre,
      fechaNacimiento: person.fechaNacimiento,
      edad: person.edad,
      rol: person.rol,
      estado: person.estado,
      fechaIngreso: person.fechaIngreso,
      telefono: person.telefono || "",
      email: person.email || "",
      direccion: person.direccion || "",
      licenciaProfesional: person.licenciaProfesional || "",
    });
    setIsDialogOpen(true);
  };

  // Eliminar persona
  const handleDelete = (id: string) => {
    if (confirm("¿Eliminar este registro de personal?")) {
      setPersonal((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      dni: "",
      nombre: "",
      fechaNacimiento: "",
      edad: 0,
      rol: "Licenciado",
      estado: "Habilitado",
      fechaIngreso: new Date().toISOString().split("T")[0],
      telefono: "",
      email: "",
      direccion: "",
      licenciaProfesional: "",
    });
    setEditingPerson(null);
  };

  // Badge de estado con colores
  const EstadoBadge = ({ estado }: { estado: EstadoPersonal }) => {
    const colors: Record<EstadoPersonal, string> = {
      Habilitado: "bg-green-100 text-green-700 border-green-200",
      Ausente: "bg-yellow-100 text-yellow-700 border-yellow-200",
      "No labora": "bg-gray-100 text-gray-700 border-gray-200",
    };
    return (
      <Badge variant="outline" className={colors[estado]}>
        {estado}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestión de Personal
          </h1>
          <p className="text-muted-foreground mt-1">
            Administre el equipo de enfermeros licenciados
          </p>
        </div>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
              <UserPlus className="w-4 h-4" />
              Nuevo Enfermero
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-4xl! max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPerson
                  ? "Editar Enfermero"
                  : "Registrar Nuevo Enfermero"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Datos básicos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FieldGroup>
                  <FieldLabel className="text-xs">DNI *</FieldLabel>
                  <Input
                    type="text"
                    placeholder="12345678"
                    value={formData.dni}
                    onChange={(e) => handleInputChange("dni", e.target.value)}
                    className="h-9 text-sm"
                    maxLength={8}
                    required
                  />
                </FieldGroup>

                <FieldGroup className="lg:col-span-2">
                  <FieldLabel className="text-xs">Nombre Completo *</FieldLabel>
                  <Input
                    type="text"
                    placeholder="Lic. Juan Pérez"
                    value={formData.nombre}
                    onChange={(e) =>
                      handleInputChange("nombre", e.target.value)
                    }
                    className="h-9 text-sm"
                    required
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel className="text-xs">
                    Fecha Nacimiento *
                  </FieldLabel>
                  <Input
                    type="date"
                    value={formData.fechaNacimiento}
                    onChange={(e) =>
                      handleInputChange("fechaNacimiento", e.target.value)
                    }
                    className="h-9 text-sm"
                    max={new Date().toISOString().split("T")[0]}
                    required
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel className="text-xs">Edad</FieldLabel>
                  <Input
                    type="number"
                    value={formData.edad}
                    disabled
                    className="h-9 text-sm bg-muted"
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel className="text-xs">Rol *</FieldLabel>
                  <Select
                    value={formData.rol}
                    onValueChange={(v: RolPersonal) =>
                      handleInputChange("rol", v)
                    }
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((rol) => (
                        <SelectItem key={rol} value={rol}>
                          {rol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel className="text-xs">Estado *</FieldLabel>
                  <Select
                    value={formData.estado}
                    onValueChange={(v: EstadoPersonal) =>
                      handleInputChange("estado", v)
                    }
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      {ESTADOS.map((estado) => (
                        <SelectItem key={estado} value={estado}>
                          {estado}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldGroup>
              </div>

              {/* Datos profesionales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FieldGroup>
                  <FieldLabel className="text-xs">Fecha de Ingreso</FieldLabel>
                  <Input
                    type="date"
                    value={formData.fechaIngreso}
                    onChange={(e) =>
                      handleInputChange("fechaIngreso", e.target.value)
                    }
                    className="h-9 text-sm"
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel className="text-xs">
                    Licencia Profesional
                  </FieldLabel>
                  <Input
                    type="text"
                    placeholder="COLP-XXXXX"
                    value={formData.licenciaProfesional}
                    onChange={(e) =>
                      handleInputChange("licenciaProfesional", e.target.value)
                    }
                    className="h-9 text-sm"
                  />
                </FieldGroup>
              </div>

              {/* Contacto */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FieldGroup>
                  <FieldLabel className="text-xs flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Teléfono
                  </FieldLabel>
                  <Input
                    type="tel"
                    placeholder="999 888 777"
                    value={formData.telefono}
                    onChange={(e) =>
                      handleInputChange("telefono", e.target.value)
                    }
                    className="h-9 text-sm"
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel className="text-xs flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Email
                  </FieldLabel>
                  <Input
                    type="email"
                    placeholder="enfermero@padomi.pe"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="h-9 text-sm"
                  />
                </FieldGroup>

                <FieldGroup className="lg:col-span-3">
                  <FieldLabel className="text-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Dirección
                  </FieldLabel>
                  <Input
                    type="text"
                    placeholder="Av. Siempre Viva 123, Lima"
                    value={formData.direccion}
                    onChange={(e) =>
                      handleInputChange("direccion", e.target.value)
                    }
                    className="h-9 text-sm"
                  />
                </FieldGroup>
              </div>

              {/* Botones */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingPerson ? "Actualizar" : "Guardar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros y búsqueda */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-50">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, DNI o especialidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>

          <Select
            value={filterEstado}
            onValueChange={(v: any) => setFilterEstado(v)}
          >
            <SelectTrigger className="w-40 h-9 text-sm">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos los estados</SelectItem>
              {ESTADOS.map((estado) => (
                <SelectItem key={estado} value={estado}>
                  {estado}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Badge variant="secondary" className="ml-auto">
            {personalFiltrado.length} registros
          </Badge>
        </div>
      </Card>

      {/* Tabla de personal */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-left pl-4">Nombre</TableHead>
                <TableHead className="text-center">DNI</TableHead>
                <TableHead className="text-center">Edad</TableHead>
                <TableHead className="text-center">Rol</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead className="text-center">Ingreso</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {personalFiltrado.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-12 text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-8 h-8 text-muted-foreground/50" />
                      <p>No se encontraron registros</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                personalFiltrado.map((person) => (
                  <TableRow
                    key={person.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {/* Nombre - align left */}
                    <TableCell className="font-medium pl-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700">
                          {person.nombre.charAt(0).toUpperCase()}
                        </div>
                        <span className="truncate" title={person.nombre}>
                          {person.nombre}
                        </span>
                      </div>
                    </TableCell>

                    {/* DNI - center */}
                    <TableCell className="text-center font-mono text-sm">
                      {person.dni}
                    </TableCell>

                    {/* Edad - center */}
                    <TableCell className="text-center text-sm">
                      {person.edad} años
                    </TableCell>

                    {/* Rol - center */}
                    <TableCell className="text-center">
                      <Badge variant="outline" className="text-xs px-2 py-0.5">
                        {person.rol}
                      </Badge>
                    </TableCell>

                    {/* Estado - center */}
                    <TableCell className="text-center">
                      <EstadoBadge estado={person.estado} />
                    </TableCell>

                    {/* Fecha Ingreso - center */}
                    <TableCell className="text-center text-xs text-muted-foreground">
                      {new Date(person.fechaIngreso).toLocaleDateString(
                        "es-PE",
                      )}
                    </TableCell>

                    {/* Acciones - right align */}
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 hover:bg-blue-100 hover:text-blue-700"
                          onClick={() => handleEdit(person)}
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 hover:bg-red-100 hover:text-red-700"
                          onClick={() => handleDelete(person.id)}
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Stats resumen */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{personal.length}</p>
          <p className="text-xs text-muted-foreground">Total Personal</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {personal.filter((p) => p.estado === "Habilitado").length}
          </p>
          <p className="text-xs text-muted-foreground">Habilitados</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">
            {personal.filter((p) => p.rol === "Licenciado").length}
          </p>
          <p className="text-xs text-muted-foreground">Licenciados</p>
        </Card>
      </div>
    </div>
  );
}
