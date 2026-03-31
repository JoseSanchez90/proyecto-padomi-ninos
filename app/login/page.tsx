"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { LoginForm } from "@/components/auth/LoginForm";
import Logo from "@/public/images/padomi-log.png";
import Image from "next/image";

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex flex-col items-center mb-8 animate-in fade-in duration-500">
          <Image
            src={Logo}
            alt="Logo"
            width={240}
            height={240}
            className="object-cover"
          />
          <p className="text-2xl text-gray-600 font-semibold mt-2">
            Sistema de Gestión Clínica
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Iniciar Sesión
          </h2>
          <LoginForm />
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>© 2024 PADOMI. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
}
