// Types para la aplicación PADOMI

export interface User {
  id: string;
  dni: string;
  name: string;
  role: string;
}

export interface RegistroRecord {
  id: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  duracion: number;
  paciente: string;
  dni: string;
  fechaNacimiento: string;
  edad: number;
  zona: string;
  distrito: string;
  diagnosticoPrincipal: string;
  procedimiento: string;
  tieneDispositivo: boolean;
  numeroDispositivo?: string;
  nombreDispositivo?: string;
  materialSonda?: string;
  fechaColocacion?: string;
  fechaCambio?: string;
  profesionalACargo: string;
  resultado: "Exitoso" | "Requiere seguimiento" | "Fallido" | "Rechazado";
  incidencias: boolean;
  tipoIncidencia?: string;
  descripcionIncidente?: string;
  procedimientoRepetido: boolean;
  checklistCumplido: boolean;
  cuidadorPrincipalPresente: boolean;
  estadoPaciente: string;
  imagenes?: string[]; // Array de base64 encoded images
  createdAt: string;
}

export interface MonthlyGoal {
  id: string;
  mes: number;
  ano: number;
  pacientesAtendidos: number;
  procedimientosExitosos: number;
  procedimientosFallidos: number;
  checklistCumplimiento: number;
  incidenciasMaximas: number;
  profesional?: string;
  createdAt: string;
}

export interface GoalResult {
  meta: MonthlyGoal;
  actual: {
    pacientesAtendidos: number;
    procedimientosExitosos: number;
    procedimientosFallidos: number;
    checklistCumplimiento: number;
    incidenciasCount: number;
  };
}

export interface FilterState {
  fechaDesde?: string;
  fechaHasta?: string;
  paciente?: string;
  dni?: string;
  edad?: number;
  zona?: string;
  distrito?: string;
  diagnosticoPrincipal?: string;
  procedimiento?: string;
  tieneDispositivo?: boolean;
  numeroDispositivo?: string;
  nombreDispositivo?: string;
  profesionalACargo?: string;
  resultado?: string;
  incidencias?: boolean;
  checklistCumplido?: boolean;
  cuidadorPrincipalPresente?: boolean;
  estadoPaciente: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (dni: string, password: string) => void;
  logout: () => void;
}

export interface RegistroContextType {
  registros: RegistroRecord[];
  filters: FilterState;
  filteredRegistros: RegistroRecord[];
  monthlyGoals: MonthlyGoal[];
  addRegistro: (data: Omit<RegistroRecord, "id" | "createdAt">) => void;
  deleteRegistro: (id: string) => void;
  updateRegistro: (id: string, data: Partial<RegistroRecord>) => void;
  applyFilters: (filters: FilterState) => void;
  clearFilters: () => void;
  addMonthlyGoal: (goal: Omit<MonthlyGoal, "id" | "createdAt">) => void;
  updateMonthlyGoal: (id: string, goal: Partial<MonthlyGoal>) => void;
  deleteMonthlyGoal?: (id: string) => void;
}

export interface UIContextType {
  activeSection: "pacientes" | "indicadores" | "graficos";
  sidebarOpen: boolean;
  theme: "light" | "dark";
  setActiveSection: (section: "pacientes" | "indicadores" | "graficos") => void;
  toggleSidebar: () => void;
  toggleTheme: () => void;
}

export type RolPersonal = "Licenciado" | "Administrador";
export type EstadoPersonal = "Habilitado" | "Ausente" | "No labora";

export interface PersonalRecord {
  id: string;
  dni: string;
  nombre: string;
  fechaNacimiento: string;
  edad: number;
  rol: RolPersonal;
  estado: EstadoPersonal;
  especialidad?: string;
  fechaIngreso: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  licenciaProfesional?: string;
  fotoUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PersonalContextType {
  personal: PersonalRecord[];
  addPersonal: (
    data: Omit<PersonalRecord, "id" | "createdAt" | "updatedAt">,
  ) => void;
  updatePersonal: (id: string, data: Partial<PersonalRecord>) => void;
  deletePersonal: (id: string) => void;
  getPersonalByEstado: (estado: EstadoPersonal) => PersonalRecord[];
  getLicenciadosActivos: () => PersonalRecord[];
}
