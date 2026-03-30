// app/dashboard/registrar-paciente/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { RegistroForm } from "@/components/dashboard/RegistroForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function RegistrarPacientePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [registroParaEditar, setRegistroParaEditar] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(!!editId);

  // Cargar datos del registro si estamos en modo edición
  useEffect(() => {
    if (editId) {
      const storedRegistros = localStorage.getItem("padomi_registros");
      if (storedRegistros) {
        try {
          const registros = JSON.parse(storedRegistros);
          const registro = registros.find((r: any) => r.id === editId);
          if (registro) {
            setRegistroParaEditar(registro);
          } else {
            // Si no se encuentra el registro, redirigir al dashboard
            router.push("/dashboard");
          }
        } catch (error) {
          console.error("Error loading registro:", error);
          router.push("/dashboard");
        }
      } else {
        router.push("/dashboard");
      }
      setIsLoading(false);
    }
  }, [editId, router]);

  // Mostrar loading mientras se cargan los datos en modo edición
  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header con botón de regreso */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            router.push("/dashboard");
            router.refresh();
          }}
          className="shrink-0"
          title="Volver al listado"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {editId ? "Editar Paciente" : "Nuevo Paciente"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {editId
              ? "Modifica los datos del paciente registrado"
              : "Complete el formulario para registrar un nuevo paciente"}
          </p>
        </div>
      </div>

      {/* Formulario - pasar props según modo */}
      <div className="w-full">
        <RegistroForm
          editMode={!!editId}
          initialData={registroParaEditar}
          onSaved={() => {
            router.push("/dashboard");
            router.refresh();
          }}
        />
      </div>
    </div>
  );
}
