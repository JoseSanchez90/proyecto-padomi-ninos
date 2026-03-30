const DISTRITO_POR_ZONA = {
  Norte: [
    "Ancón",
    "Carabayllo",
    "Comas",
    "Independencia",
    "Los Olivos",
    "Puente Piedra",
    "San Martín de Porres",
    "Santa Rosa",
  ],
  Sur: [
    "Chorrillos",
    "Lurín",
    "Pachacámac",
    "Pucusana",
    "Punta Hermosa",
    "Punta Negra",
    "San Bartolo",
    "San Juan de Miraflores",
    "Santa María del Mar",
    "Villa El Salvador",
    "Villa María del Triunfo",
  ],
  Este: [
    "Ate",
    "Chaclacayo",
    "Cieneguilla",
    "El Agustino",
    "La Molina",
    "Lurigancho",
    "San Juan de Lurigancho",
    "San Luis",
    "Santa Anita",
    "Huaycán",
  ],
  Centro: [
    "Cercado de Lima",
    "Rímac",
    "Breña",
    "La Victoria",
    "Lince",
    "Jesús María",
    "San Isidro",
  ],
  Oeste: [
    "Barranco",
    "Magdalena del Mar",
    "Pueblo Libre",
    "San Borja",
    "San Miguel",
    "Santiago de Surco",
    "Surquillo",
  ],
};

export const ZONAS = ["Norte", "Sur", "Este", "Centro", "Oeste"];

export const DISTRITOS = Object.values(DISTRITO_POR_ZONA).flat();

export const getDistritosPorZona = (zona: string): string[] => {
  return DISTRITO_POR_ZONA[zona as keyof typeof DISTRITO_POR_ZONA] || [];
};

export const DIAGNOSTICOS = [
  "Atención paliativa",
  "Atresia esofágica",
  "Epilepsia",
  "Insuficiencia respiratoria crónica",
  "Mucopolisacaridosis",
  "PCI",
  "SD Duchenne",
  "Secuelas neurológicas",
  "Traqueomalacia",
  "Tumor",
  "Vejiga neurogénica",
];

export const PROCEDIMIENTOS = [
  "Administración de enemas",
  "Administración de medicamentos endovenosos",
  "Administración de medicamentos intramusculares",
  "Administración de medicamentos subcutáneos",
  "Aspiración de secreciones orofaríngeas",
  "Aspiración de secreciones por traqueostomía",
  "Cambio de bolsa de colostomía",
  "Cambio de botón de gastrostomía",
  "Cambio de endocánula",
  "Cambio de fijación de sonda",
  "Cambio de sonda Foley adaptada a gastrostomía",
  "Colocación de sonda Foley",
  "Colocación de sonda nasogástrica",
  "Colocación de sonda orogástrica",
  "Curación de gastrostomía",
  "Curación de herida postoperatoria",
  "Curación de lesión por presión (LPP)",
  "Curación de traqueostomía",
  "Llenado de bomba elastomérica",
  "Nebulización",
  "Oxigenoterapia",
  "Permeabilización de vía",
  "Retiro de sonda Foley",
  "Retiro de sonda nasogástrica",
  "Retiro de sonda orogástrica",
  "Retiro de vía periférica",
  "Terapia de rescate",
];

export const NOMBRE_DISPOSITIVO = [
  "Bolsa de colostomía",
  "Bomba elastomérica",
  "Cánula binasal",
  "Catéter Port-a-Cath",
  "Foley de gastrostomía",
  "Ninguno",
  "Sonda de gastrostomía",
  "Sonda Foley",
  "Sonda nasogástrica",
  "Traqueostomía",
  "Urostomía",
  "Ventilador mecánico",
  "Vía periférica",
];

export const MATERIAL_SONDA = ["Siliconada", "PVC", "Latex"];

export const PROFESIONALES = [
  "Lic. Aguero",
  "Lic. Blancas",
  "Lic. Castillo",
  "Lic. Chumpitaz",
  "Lic. Cruz",
  "Lic. Cupe",
  "Lic. Echegaray",
  "Lic. Epiquien",
  "Lic. Flores",
  "Lic. García",
  "Lic. Matta",
  "Lic. Ochoa",
  "Lic. Peralta",
  "Lic. Silva",
  "Lic. Tarazona",
  "Lic. Vera",
];

export const RESULTADOS = [
  "Exitoso",
  "Requiere seguimiento",
  "Rechazado",
  "Fallido",
];

export const INCIDENCIAS = [
  "Derivación a emergencia",
  "Dolor excesivo",
  "Falla técnica",
  "Negativa de cuidador",
  "Ninguna",
  "Reacción adversa",
];

export const ESTADO_PACIENTE = ["Activo", "Inactivo", "Fallecido"];

export const CHECKLIST_OPTIONS = ["Si", "No"];
export const CUIDADOR_OPTIONS = ["Si", "No"];

export const CHECKLIST_ITEMS = [
  "Consentimiento informado firmado",
  "Documentación completa",
  "Equipo verificado y disponible",
  "Historial médico revisado",
  "Paciente identificado correctamente",
  "Protocolo de seguridad cumplido",
];

// Datos demo para gráficos
export const DEMO_REGISTROS = [
  {
    id: "1",
    fecha: "2024-01-15",
    horaInicio: "09:00",
    horaFin: "10:30",
    duracion: 90,
    paciente: "Juan Rodríguez",
    dni: "12345678",
    edad: 65,
    zona: "Zona 1 - Centro",
    distrito: "San Isidro",
    diagnosticoPrincipal: "Artrosis",
    procedimiento: "Fisioterapia",
    profesionalACargo: "Lic. Carlos López",
    resultado: "exitoso" as const,
    incidencias: false,
    procedimientoRepetido: false,
    checklistCumplido: true,
    cuidadorPrincipalPresente: true,
    createdAt: "2024-01-15T09:00:00Z",
  },
];

// Datos para indicadores
export const INDICATOR_LABELS = {
  totalPacientes: "Total Pacientes",
  totalProcedimientos: "Total Procedimientos",
  promedioDiario: "Promedio Diario",
  tasaIncidencias: "Tasa de Incidencias",
  checklistCumplido: "Checklist Cumplido",
  duracionPromedio: "Duración Promedio (min)",
};
