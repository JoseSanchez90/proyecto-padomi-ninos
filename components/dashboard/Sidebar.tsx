"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  PieChart,
  LogOut,
  Menu,
  X,
  NotebookPen,
  Notebook,
} from "lucide-react";
import Image from "next/image";
import Logo from "@/public/images/padomi-log.png";

// Tipos para los items de navegación
type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
};

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, user } = useAuth();

  // Estado local para sidebar + persistencia en localStorage
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("padomi_sidebar");
    return saved ? JSON.parse(saved) : true;
  });

  // Guardar preferencia cuando cambie
  useEffect(() => {
    localStorage.setItem("padomi_sidebar", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  // Helper para verificar si una ruta está activa
  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  // Items de navegación principales
  const navItems: NavItem[] = [
    {
      label: "Ver Registros",
      href: "/dashboard",
      icon: <Notebook className="w-5 h-5 text-gray-800 shrink-0" />,
    },
    {
      label: "Indicadores",
      href: "/dashboard/indicadores",
      icon: <BarChart3 className="w-5 h-5 text-gray-800 shrink-0" />,
      description: "Métricas",
    },
    {
      label: "Gráficos",
      href: "/dashboard/graficos",
      icon: <PieChart className="w-5 h-5 text-gray-800 shrink-0" />,
      description: "Análisis",
    },
  ];

  // Manejar navegación
  const handleNavigate = (href: string) => {
    router.push(href);
    // Cerrar sidebar en móvil después de navegar
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 pt-2 bg-card flex items-center justify-between px-4 z-40">
        <Image
          src={Logo}
          alt="Logo"
          width={100}
          height={100}
          className="object-cover"
        />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
          aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {sidebarOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative top-16 md:top-0 left-0 right-0 md:right-auto 
          m-6 h-auto rounded-4xl bg-white border-r border-sidebar-border 
          flex flex-col transition-all duration-300 z-30
          ${sidebarOpen ? "w-full md:w-64" : "w-0 md:w-64"}
          overflow-hidden md:overflow-visible
        `}
      >
        {/* Header (Desktop) */}
        <div className="hidden md:flex items-center justify-center pt-4">
          <Image
            src={Logo}
            alt="Logo"
            width={160}
            height={160}
            className="object-cover"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-6">
          {/* Sección: Pacientes */}
          <div className="space-y-6">
            {/* Sub-sección: Ver Pacientes */}
            <div>
              <h3 className="text-sm text-gray-800 font-bold px-4 mb-1">
                PACIENTES
              </h3>

              {/* Ver Pacientes - activo SOLO en /dashboard exacto */}
              <button
                onClick={() => handleNavigate("/dashboard")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  // Activo solo si es /dashboard exacto (no incluye registrar-paciente)
                  pathname === "/dashboard" || pathname === "/"
                    ? "bg-blue-600 text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-blue-100 hover:text-sidebar-accent-foreground"
                }`}
              >
                <Notebook
                  className={`w-5 h-5 ${pathname === "/dashboard" || pathname === "/" ? "text-white" : "text-gray-800"} shrink-0`}
                />
                <span
                  className={`text-sm font-medium ${
                    pathname === "/dashboard" || pathname === "/"
                      ? "text-white"
                      : "text-gray-800"
                  }`}
                >
                  Ver Pacientes
                </span>
              </button>
            </div>

            {/* Sub-sección: Nuevo Registro */}
            <div>
              <h3 className="text-sm text-gray-800 font-bold px-4 mb-1">
                REGISTRO
              </h3>

              {/* Nuevo Paciente - activo cuando estás en /dashboard/registrar-paciente */}
              <button
                onClick={() => handleNavigate("/dashboard/registrar-paciente")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  // Activo si la ruta incluye "/registrar-paciente"
                  pathname?.includes("/registrar-paciente")
                    ? "bg-blue-600 text-white"
                    : "text-sidebar-foreground hover:bg-blue-100 hover:text-sidebar-accent-foreground"
                }`}
              >
                <NotebookPen
                  className={`w-5 h-5 ${
                    pathname?.includes("/registrar-paciente")
                      ? "text-white"
                      : "text-gray-800"
                  } shrink-0`}
                />
                <span
                  className={`text-sm font-medium ${
                    pathname?.includes("/registrar-paciente")
                      ? "text-white"
                      : "text-gray-800"
                  }`}
                >
                  Nuevo Paciente
                </span>
              </button>
            </div>
          </div>

          {/* Sección: Análisis */}
          <div className="space-y-2">
            <h3 className="text-md text-gray-800 font-bold px-4 mb-1">
              ANÁLISIS
            </h3>
            {navItems.slice(1).map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavigate(item.href)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-blue-600 text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-blue-100 hover:text-sidebar-accent-foreground"
                }`}
              >
                {item.icon}
                <div className="text-left">
                  <span
                    className={`text-sm ${
                      isActive(item.href) ? "text-white" : "text-gray-800"
                    } font-medium block`}
                  >
                    {item.label}
                  </span>
                  {item.description && (
                    <span
                      className={`text-xs ${
                        isActive(item.href) ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {item.description}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 space-y-3">
          {/* User Info */}
          <div className="px-2 py-2 text-xs">
            <p className="text-gray-800">Medico:</p>
            <p className="text-gray-800 text-lg font-medium truncate">
              {user?.name || "Enfermero"}
            </p>
          </div>

          {/* Logout */}
          <Button
            onClick={logout}
            className="w-full justify-start gap-2 px-6 py-4 text-white bg-blue-600 hover:bg-blue-800 cursor-pointer"
            size="sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed md:hidden inset-0 bg-black/50 z-20 top-16"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
