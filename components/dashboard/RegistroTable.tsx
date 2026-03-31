"use client";

import { useState } from "react";
import { useRegistro } from "@/lib/contexts/RegistroContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Trash2,
  ChevronDown,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Stethoscope,
  Calendar,
  Pencil,
  TriangleAlert,
} from "lucide-react";
import { ImageViewer } from "./ImageViewer";
import { useRouter } from "next/navigation";
import { gooeyToast } from "@/components/ui/goey-toaster";

const ITEMS_PER_PAGE = 7;

export function RegistroTable() {
  const { filteredRegistros, deleteRegistro } = useRegistro();

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  // Estados existentes
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Calcular registros de la página actual
  const totalPages = Math.ceil(filteredRegistros.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentRecords = filteredRegistros.slice(startIndex, endIndex);

  // Navegación de páginas
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    setExpandedId(null);
  };

  // Obtener números de página para mostrar
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  // Si no hay datos
  if (filteredRegistros.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No hay registros disponibles</p>
      </Card>
    );
  }

  const truncate = (text: string, length: number = 30) => {
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  const openImageViewer = (images: string[], index: number) => {
    setSelectedImages(images);
    setSelectedImageIndex(index);
    setImageViewerOpen(true);
  };

  const getEstadoPacienteColor = (estado: string) => {
    switch (estado) {
      case "Activo":
        return "bg-green-500";
      case "Inactivo":
        return "bg-yellow-500";
      default:
        return "bg-red-500";
    }
  };

  // Helper para formatear fecha a DD/MM/AAAA
  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  // Agregar al inicio del componente RegistroTable:
  const handleDeleteConfirm = (id: string, paciente: string) => {
    gooeyToast.warning("¿Eliminar registro?", {
      description: "Esta acción no se puede deshacer",
      duration: 5000,
      action: {
        label: "Sí, eliminar",
        onClick: () => {
          deleteRegistro(id);
          gooeyToast.success("Eliminado", {
            description: `El registro de ${paciente} ha sido eliminado`,
            duration: 3000,
          });
        },
      },
    });
  };

  return (
    <>
      <ImageViewer
        images={selectedImages}
        initialIndex={selectedImageIndex}
        onClose={() => setImageViewerOpen(false)}
        isOpen={imageViewerOpen}
      />

      <div className="space-y-2">
        {/* Registros de la página actual */}
        {currentRecords.map((record) => (
          <div
            key={record.id}
            className="border border-border rounded-4xl overflow-hidden bg-white hover:shadow-sm transition-shadow"
          >
            {/* Row Header */}
            <div className="flex items-center gap-4 p-4 bg-white">
              {/* Main Info */}
              <div className="flex-1 grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Fecha</p>
                  <p className="text-xs 2xl:text-sm font-medium">
                    {record.fecha}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Paciente</p>
                  <p className="text-xs 2xl:text-sm font-medium">
                    {truncate(record.paciente)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Procedimiento</p>
                  <p className="text-xs 2xl:text-sm font-medium">
                    {truncate(record.procedimiento, 20)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Profesional</p>
                  <p className="text-xs 2xl:text-sm font-medium">
                    {truncate(record.profesionalACargo, 20)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Resultado</p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        record.resultado === "Exitoso"
                          ? "bg-green-500"
                          : record.resultado === "Requiere seguimiento"
                            ? "bg-yellow-500"
                            : record.resultado === "Fallido"
                              ? "bg-red-500"
                              : "bg-gray-400"
                      }`}
                    />
                    <span className="text-xs 2xl:text-sm font-medium capitalize">
                      {record.resultado}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Estado Paciente
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${getEstadoPacienteColor(
                        record.estadoPaciente,
                      )}`}
                    />
                    <span className="text-xs 2xl:text-sm font-medium capitalize">
                      {record.estadoPaciente}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center justify-center">
                {/* Editar Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onMouseEnter={() =>
                    router.prefetch(
                      `/dashboard/registrar-paciente?edit=${record.id}`,
                    )
                  }
                  onClick={(e) => {
                    e.stopPropagation(); // Evitar que se expanda/colapse al hacer clic en editar
                    router.push(
                      `/dashboard/registrar-paciente?edit=${record.id}`,
                    );
                  }}
                  className="h-8 w-8 hover:bg-green-100 hover:text-green-800 cursor-pointer"
                  title="Editar registro"
                >
                  <Pencil className="w-4 h-4" />
                </Button>

                {/* Delete Button */}
                <Button
                  onClick={() =>
                    handleDeleteConfirm(record.id, record.paciente)
                  }
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-red-100 hover:text-red-800 cursor-pointer"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>

                {/* Expand Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setExpandedId(expandedId === record.id ? null : record.id)
                  }
                  className="h-8 w-8 bg-blue-500 hover:bg-blue-600 cursor-pointer"
                >
                  <ChevronDown
                    className={`w-4 h-4 text-white transition-transform ${expandedId === record.id ? "rotate-180" : ""}`}
                  />
                </Button>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedId === record.id && (
              <div className="p-4 border-t border-border bg-background/50">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-sm">
                  {/* Horario */}
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold mb-1">
                      Horario
                    </p>
                    <p className="text-foreground">
                      {record.horaInicio} - {record.horaFin}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Duración: {record.duracion} min
                    </p>
                  </div>

                  {/* Paciente */}
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold mb-1">
                      Paciente
                    </p>
                    <p className="text-foreground">{record.paciente}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      DNI: {record.dni}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Edad: {record.edad} años
                    </p>
                  </div>

                  {/* Fecha Nacimiento */}
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Nacimiento
                    </p>
                    <p className="text-foreground">
                      {formatDate(record.fechaNacimiento)}
                    </p>
                  </div>

                  {/* Ubicación */}
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold mb-1">
                      Ubicación
                    </p>
                    <p className="text-foreground">{record.zona}</p>
                    <p className="text-xs text-muted-foreground">
                      {record.distrito}
                    </p>
                  </div>

                  {/* Diagnóstico */}
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold mb-1">
                      Diagnóstico
                    </p>
                    <p className="text-foreground">
                      {record.diagnosticoPrincipal || "N/A"}
                    </p>
                  </div>

                  {/* Procedimiento */}
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold mb-1">
                      Procedimiento
                    </p>
                    <p className="text-foreground">{record.procedimiento}</p>
                  </div>

                  {/* Profesional */}
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold mb-1">
                      Profesional
                    </p>
                    <p className="text-foreground">
                      {record.profesionalACargo}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
                  {/* Imágenes */}
                  {record.imagenes && record.imagenes.length > 0 && (
                    <div className="col-span-2 md:col-span-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-2xl border border-blue-200 dark:border-blue-900/30">
                      <div className="flex items-center gap-2 mb-2">
                        <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <p className="text-xs text-blue-900 dark:text-blue-200 font-semibold">
                          Imágenes ({record.imagenes.length})
                        </p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {record.imagenes.map((img, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              openImageViewer(record.imagenes || [], index)
                            }
                            className="relative group overflow-hidden rounded-xl border border-border hover:border-primary/50 transition-all cursor-pointer"
                          >
                            <img
                              src={img}
                              alt={`Imagen ${index + 1}`}
                              className="w-full h-24 object-cover group-hover:scale-110 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                              <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                Ver
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Incidencias */}
                  {record.incidencias && (
                    <div className="col-span-2 md:col-span-1 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-900/30">
                      <p className="flex items-center gap-2 text-sm text-yellow-900 dark:text-yellow-200 font-semibold mb-2">
                        <TriangleAlert className="w-4 h-4 text-yellow-600" />
                        Incidencia Reportada
                      </p>
                      {record.tipoIncidencia && (
                        <div className="flex gap-2 text-yellow-800 dark:text-yellow-300 mb-1">
                          <p className="text-xs">Tipo:</p>
                          <p className="text-xs font-bold text-yellow-900 dark:text-yellow-300">
                            {record.tipoIncidencia}
                          </p>
                        </div>
                      )}
                      <div className="gap-2 text-yellow-800 dark:text-yellow-300">
                        <p className="text-xs">Descripcion:</p>
                        <p className="text-xs font-bold text-yellow-900 dark:text-yellow-300">
                          {record.descripcionIncidente || "Sin descripción"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Dispositivo Médico */}
                  {record.tieneDispositivo && (
                    <div className="col-span-2 md:col-span-1 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-900/30">
                      <p className="text-xs text-purple-900 dark:text-purple-200 font-semibold mb-2 flex items-center gap-1">
                        <Stethoscope className="w-3 h-3" />
                        Dispositivo Médico
                      </p>

                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tipo:</span>
                          <span className="font-medium">
                            {record.nombreDispositivo}
                          </span>
                        </div>

                        {record.nombreDispositivo?.startsWith("Sonda") &&
                          record.materialSonda && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Material:
                              </span>
                              <span className="font-medium">
                                {record.materialSonda}
                              </span>
                            </div>
                          )}

                        {record.numeroDispositivo && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">N°:</span>
                            <span className="font-medium">
                              {record.numeroDispositivo}
                            </span>
                          </div>
                        )}

                        {record.fechaColocacion && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Colocado:
                            </span>
                            <span className="font-medium">
                              {formatDate(record.fechaColocacion)}
                            </span>
                          </div>
                        )}

                        {record.fechaCambio && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Cambio:
                            </span>
                            <span className="font-medium">
                              {formatDate(record.fechaCambio)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  {/* Checkboxes de estado */}
                  <div className="flex flex-wrap gap-4 pt-2 border-t border-border/50">
                    <label className="flex items-center gap-2 text-xs cursor-default">
                      <Checkbox
                        checked={record.checklistCumplido}
                        disabled
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <span className="select-none">Checklist Cumplido</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs cursor-default">
                      <Checkbox
                        checked={record.procedimientoRepetido}
                        disabled
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <span className="select-none">
                        Procedimiento Repetido
                      </span>
                    </label>

                    <label className="flex items-center gap-2 text-xs cursor-default">
                      <Checkbox
                        checked={record.cuidadorPrincipalPresente}
                        disabled
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <span className="select-none">Cuidador Presente</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end md:justify-between px-2">
          {/* Información */}
          <div className="hidden md:flex text-xs text-muted-foreground">
            Mostrando {startIndex + 1} -{" "}
            {Math.min(endIndex, filteredRegistros.length)} de{" "}
            {filteredRegistros.length} registros
          </div>

          {/* Controles */}
          <div className="flex items-center gap-1">
            {/* Primera página */}
            <Button
              size="icon"
              className="h-8 w-8 bg-gray-600 cursor-pointer"
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>

            {/* Página anterior */}
            <Button
              size="icon"
              className="h-8 w-8 bg-gray-600 cursor-pointer"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {/* Números de página */}
            {getPageNumbers().map((page, index) => (
              <Button
                key={index}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                className="h-8 w-8 min-w-8 p-0 cursor-pointer"
                onClick={() => typeof page === "number" && goToPage(page)}
                disabled={page === "..."}
              >
                {page}
              </Button>
            ))}

            {/* Página siguiente */}
            <Button
              size="icon"
              className="h-8 w-8 bg-gray-600 cursor-pointer"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            {/* Última página */}
            <Button
              size="icon"
              className="h-8 w-8 bg-gray-600 cursor-pointer"
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
