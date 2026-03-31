// components/dashboard/Sidebar.tsx
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
  Users,
} from "lucide-react";
import Image from "next/image";
import Logo from "@/public/images/padomi-log.png";

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

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleNavigate = (href: string) => {
    router.push(href);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Bloquear scroll del body cuando sidebar está abierto en móvil
  useEffect(() => {
    if (sidebarOpen && isMobile) {
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;

      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${window.scrollY}px`;

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        if (originalTop) {
          window.scrollTo(0, parseInt(originalTop) * -1);
        }
      };
    }
  }, [sidebarOpen, isMobile]);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 pt-2 bg-card flex items-center justify-between px-4 py-2 z-40">
        <Image src={Logo} alt="Logo" className="w-20 object-cover" />
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

      {/* Sidebar con layout flex para sticky footer */}
      <aside
        className={`
          fixed md:relative 
          top-16 md:top-0 
          left-0 
          md:m-6 
          h-[calc(100vh-4rem)] md:h-auto
          md:rounded-4xl 
          bg-white 
          border-r border-sidebar-border 
          flex 
          flex-col 
          z-30
          transition-transform duration-300 ease-in-out
          -translate-x-full md:translate-x-0
          w-64
          overflow-hidden  /* ← Evita scroll en el contenedor principal */
          ${sidebarOpen && isMobile ? "translate-x-0" : ""}
          ${!isMobile ? "translate-x-0" : ""}
        `}
      >
        {/* Header Desktop */}
        <div className="hidden md:flex items-center justify-center pt-4 shrink-0">
          <Image src={Logo} alt="Logo" className="w-32 2xl:w-40 object-cover" />
        </div>

        {/* Navigation - Con scroll interno */}
        <nav
          className={`
            overflow-y-auto
            px-4 py-6 space-y-6
            transition-opacity duration-200
            ${isMobile && !sidebarOpen ? "opacity-0 pointer-events-none" : "opacity-100"}
            /* Scrollbar personalizado */
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-gray-300
            [&::-webkit-scrollbar-thumb]:rounded-full
            hover:[&::-webkit-scrollbar-thumb]:bg-gray-400
          `}
        >
          {/* Sección: Pacientes */}
          <div className="space-y-6">
            {/* Ver Pacientes */}
            <div>
              <h3 className="text-sm text-gray-800 font-bold px-4 mb-1">
                PACIENTES
              </h3>

              <button
                onClick={() => handleNavigate("/dashboard")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  pathname === "/dashboard" || pathname === "/"
                    ? "bg-blue-600 text-white"
                    : "text-gray-800 hover:bg-blue-100 hover:text-blue-900"
                }`}
              >
                <Notebook
                  className={`w-5 h-5 shrink-0 ${pathname === "/dashboard" || pathname === "/" ? "text-white" : "text-gray-800"}`}
                />
                <span
                  className={`text-sm font-medium ${pathname === "/dashboard" || pathname === "/" ? "text-white" : "text-gray-800"}`}
                >
                  Ver Pacientes
                </span>
              </button>
            </div>

            {/* Nuevo Paciente */}
            <div>
              <h3 className="text-sm text-gray-800 font-bold px-4 mb-1">
                REGISTRO
              </h3>

              <button
                onClick={() => handleNavigate("/dashboard/registrar-paciente")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  pathname?.includes("/registrar-paciente")
                    ? "bg-blue-600 text-white"
                    : "text-gray-800 hover:bg-blue-100 hover:text-blue-900"
                }`}
              >
                <NotebookPen
                  className={`w-5 h-5 shrink-0 ${pathname?.includes("/registrar-paciente") ? "text-white" : "text-gray-800"}`}
                />
                <span
                  className={`text-sm font-medium ${pathname?.includes("/registrar-paciente") ? "text-white" : "text-gray-800"}`}
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

            {/* Indicadores */}
            <button
              onClick={() => handleNavigate("/dashboard/indicadores")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                pathname?.includes("/indicadores")
                  ? "bg-blue-600 text-white"
                  : "text-gray-800 hover:bg-blue-100 hover:text-blue-900"
              }`}
            >
              <BarChart3
                className={`w-5 h-5 shrink-0 ${pathname?.includes("/indicadores") ? "text-white" : "text-gray-800"}`}
              />
              <div className="text-left">
                <span
                  className={`text-sm font-medium block ${pathname?.includes("/indicadores") ? "text-white" : "text-gray-800"}`}
                >
                  Indicadores
                </span>
                <p
                  className={`text-xs ${pathname?.includes("/indicadores") ? "text-white" : "text-gray-800"}`}
                >
                  Metricas
                </p>
              </div>
            </button>

            {/* Gráficos */}
            <button
              onClick={() => handleNavigate("/dashboard/graficos")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                pathname?.includes("/graficos")
                  ? "bg-blue-600 text-white"
                  : "text-gray-800 hover:bg-blue-100 hover:text-blue-900"
              }`}
            >
              <PieChart
                className={`w-5 h-5 shrink-0 ${pathname?.includes("/graficos") ? "text-white" : "text-gray-800"}`}
              />
              <div className="text-left">
                <span
                  className={`text-sm font-medium block ${pathname?.includes("/graficos") ? "text-white" : "text-gray-800"}`}
                >
                  Gráficos
                </span>
                <span
                  className={`text-xs ${pathname?.includes("/graficos") ? "text-white" : "text-gray-800"}`}
                >
                  Análisis
                </span>
              </div>
            </button>
          </div>

          {/* Sección: Gestión */}
          <div className="space-y-2">
            <h3 className="text-md text-gray-800 font-bold px-4 mb-1">
              GESTIÓN
            </h3>
            <button
              onClick={() => handleNavigate("/dashboard/personal")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                pathname?.includes("/personal")
                  ? "bg-blue-600 text-white"
                  : "text-gray-800 hover:bg-blue-100 hover:text-blue-900"
              }`}
            >
              <Users className="w-5 h-5 shrink-0" />
              <div className="text-left">
                <span
                  className={`text-sm font-medium block ${pathname?.includes("/personal") ? "text-white" : "text-gray-800"}`}
                >
                  Personal
                </span>
                <span
                  className={`text-xs ${pathname?.includes("/personal") ? "text-white" : "text-gray-800"}`}
                >
                  Enfermeros
                </span>
              </div>
            </button>
          </div>
        </nav>

        {/* Footer Sticky - Siempre visible al fondo */}
        <div
          className={`
            p-4 space-y-3 
            bg-white border-t border-sidebar-border
            shrink-0 
            transition-opacity duration-200
            ${isMobile && !sidebarOpen ? "opacity-0 pointer-events-none" : "opacity-100"}
          `}
        >
          {/* User Info */}
          <div className="px-2 py-2 text-xs">
            <p className="text-gray-800">Medico:</p>
            <p className="text-gray-800 text-lg font-medium truncate">
              {user?.name || "Enfermero"}
            </p>
          </div>

          {/* Logout Button - Siempre accesible */}
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
      {sidebarOpen && isMobile && (
        <div
          className="fixed md:hidden inset-0 bg-black/80 z-20 top-16 touch-none select-none"
          onClick={() => setSidebarOpen(false)}
          onTouchMove={(e) => e.preventDefault()}
        />
      )}
    </>
  );
}
