"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { AlertCircle } from "lucide-react";

export function LoginForm() {
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!dni || !password) {
      setError("Por favor complete todos los campos");
      return;
    }

    setIsLoading(true);
    try {
      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 500));

      login(dni, password);
      router.push("/dashboard");
    } catch (err) {
      setError("Error al iniciar sesión. Intente nuevamente.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel>DNI / Email</FieldLabel>
          <Input
            type="text"
            placeholder="Ingrese su DNI o correo electrónico"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            disabled={isLoading}
          />
        </Field>
      </FieldGroup>

      <FieldGroup>
        <Field>
          <FieldLabel>Contraseña</FieldLabel>
          <Input
            type="password"
            placeholder="Ingrese su contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </Field>
      </FieldGroup>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-blue-600 py-4 text-white hover:bg-blue-700 cursor-pointer"
        disabled={isLoading}
      >
        {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
      </Button>

      <div className="text-center text-sm text-muted-foreground mt-4">
        <p>Para demostración:</p>
        <p className="text-xs mt-1">DNI: cualquier número</p>
        <p className="text-xs">Contraseña: cualquier texto</p>
      </div>
    </form>
  );
}
