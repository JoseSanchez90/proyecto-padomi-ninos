"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type {
  RegistroContextType,
  RegistroRecord,
  FilterState,
  MonthlyGoal,
} from "../types";

const RegistroContext = createContext<RegistroContextType | undefined>(
  undefined,
);

function matchesFilters(record: RegistroRecord, filters: FilterState): boolean {
  // Fecha
  if (filters.fechaDesde && record.fecha < filters.fechaDesde) return false;
  if (filters.fechaHasta && record.fecha > filters.fechaHasta) return false;

  // Paciente
  if (
    filters.paciente &&
    !record.paciente.toLowerCase().includes(filters.paciente.toLowerCase())
  ) {
    return false;
  }

  // DNI
  if (filters.dni && !record.dni.includes(filters.dni)) return false;

  // Zona
  if (filters.zona && record.zona !== filters.zona) return false;

  // Distrito
  if (filters.distrito && record.distrito !== filters.distrito) return false;

  // Procedimiento
  if (filters.procedimiento && record.procedimiento !== filters.procedimiento)
    return false;

  // Profesional a cargo
  if (
    filters.profesionalACargo &&
    record.profesionalACargo !== filters.profesionalACargo
  ) {
    return false;
  }

  // Resultado
  if (filters.resultado && record.resultado !== filters.resultado) return false;

  // Incidencias
  if (
    filters.incidencias !== undefined &&
    record.incidencias !== filters.incidencias
  ) {
    return false;
  }

  // Tiene Dispositivo
  if (
    filters.tieneDispositivo !== undefined &&
    record.tieneDispositivo !== filters.tieneDispositivo
  )
    return false;

  // Numero Dispositivo
  if (
    filters.numeroDispositivo &&
    record.numeroDispositivo !== filters.numeroDispositivo
  )
    return false;

  // Estado Paciente
  if (
    filters.estadoPaciente &&
    record.estadoPaciente !== filters.estadoPaciente
  )
    return false;

  // Checklist cumplido
  if (
    filters.checklistCumplido !== undefined &&
    record.checklistCumplido !== filters.checklistCumplido
  ) {
    return false;
  }

  // Cuidador principal presente
  if (
    filters.cuidadorPrincipalPresente !== undefined &&
    record.cuidadorPrincipalPresente !== filters.cuidadorPrincipalPresente
  ) {
    return false;
  }

  return true;
}

export function RegistroProvider({ children }: { children: React.ReactNode }) {
  const [registros, setRegistros] = useState<RegistroRecord[]>([]);
  const [filters, setFilters] = useState<FilterState>({} as FilterState);
  const [filteredRegistros, setFilteredRegistros] = useState<RegistroRecord[]>(
    [],
  );
  const [monthlyGoals, setMonthlyGoals] = useState<MonthlyGoal[]>([]);

  // Cargar registros y metas del localStorage al montar
  useEffect(() => {
    const storedRegistros = localStorage.getItem("padomi_registros");
    if (storedRegistros) {
      try {
        const parsedRegistros = JSON.parse(storedRegistros);
        setRegistros(parsedRegistros);
        setFilteredRegistros(parsedRegistros);
      } catch (error) {
        console.error("Error loading registros:", error);
      }
    }

    const storedGoals = localStorage.getItem("padomi_monthly_goals");
    if (storedGoals) {
      try {
        const parsedGoals = JSON.parse(storedGoals);
        setMonthlyGoals(parsedGoals);
      } catch (error) {
        console.error("Error loading monthly goals:", error);
      }
    }
  }, []);

  // Aplicar filtros cuando cambien los registros o filtros
  useEffect(() => {
    const filtered = registros.filter((record) =>
      matchesFilters(record, filters),
    );
    setFilteredRegistros(filtered);
  }, [registros, filters]);

  const addRegistro = (data: Omit<RegistroRecord, "id" | "createdAt">) => {
    const newRecord: RegistroRecord = {
      ...data,
      id: `registro_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    const updatedRegistros = [newRecord, ...registros];
    setRegistros(updatedRegistros);
    localStorage.setItem("padomi_registros", JSON.stringify(updatedRegistros));
  };

  const deleteRegistro = (id: string) => {
    const updatedRegistros = registros.filter((r) => r.id !== id);
    setRegistros(updatedRegistros);
    localStorage.setItem("padomi_registros", JSON.stringify(updatedRegistros));
  };

  const updateRegistro = (id: string, data: Partial<RegistroRecord>) => {
    const updatedRegistros = registros.map((r) =>
      r.id === id ? { ...r, ...data } : r,
    );
    setRegistros(updatedRegistros);
    localStorage.setItem("padomi_registros", JSON.stringify(updatedRegistros));
  };

  const applyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({} as FilterState);
  };

  const addMonthlyGoal = (goal: Omit<MonthlyGoal, "id" | "createdAt">) => {
    const newGoal: MonthlyGoal = {
      ...goal,
      id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    const updatedGoals = [newGoal, ...monthlyGoals];
    setMonthlyGoals(updatedGoals);
    localStorage.setItem("padomi_monthly_goals", JSON.stringify(updatedGoals));
  };

  const updateMonthlyGoal = (id: string, goal: Partial<MonthlyGoal>) => {
    const updatedGoals = monthlyGoals.map((g) =>
      g.id === id ? { ...g, ...goal } : g,
    );
    setMonthlyGoals(updatedGoals);
    localStorage.setItem("padomi_monthly_goals", JSON.stringify(updatedGoals));
  };

  return (
    <RegistroContext.Provider
      value={{
        registros,
        filters,
        filteredRegistros,
        monthlyGoals,
        addRegistro,
        deleteRegistro,
        updateRegistro,
        applyFilters,
        clearFilters,
        addMonthlyGoal,
        updateMonthlyGoal,
      }}
    >
      {children}
    </RegistroContext.Provider>
  );
}

export function useRegistro() {
  const context = useContext(RegistroContext);
  if (context === undefined) {
    throw new Error("useRegistro must be used within RegistroProvider");
  }
  return context;
}
