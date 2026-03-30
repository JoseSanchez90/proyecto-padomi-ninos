// lib/mockData.ts
import type { RegistroRecord } from "./types";

// Helpers para generar datos aleatorios
const randomItem = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];
const randomBool = () => Math.random() > 0.5;
const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (start: Date, end: Date) => {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
  return date.toISOString().split("T")[0];
};

// Nombres de pacientes pediátricos (Perú)
const NOMBRES_NIÑOS = [
  "Sofía Martínez",
  "Mateo López",
  "Valentina García",
  "Lucas Fernández",
  "Camila Rodríguez",
  "Sebastián Pérez",
  "Isabella Sánchez",
  "Daniel Torres",
  "Emma Ramírez",
  "Santiago Flores",
  "Mía Vargas",
  "Diego Castro",
  "Lucía Mendoza",
  "Nicolás Rojas",
  "Renata Morales",
  "Gabriel Silva",
  "Ximena Herrera",
  "Andrés Vega",
  "Antonella Ruiz",
  "Emilio Díaz",
];

// Apellidos para DNI (generar DNI válido de 8 dígitos)
const generarDNI = () =>
  Math.floor(10000000 + Math.random() * 90000000).toString();

// Generar edad < 15 años (fecha de nacimiento entre 2011-2024)
const generarFechaNacimiento = () => {
  const year = randomInt(2011, 2024);
  const month = String(randomInt(1, 12)).padStart(2, "0");
  const day = String(randomInt(1, 28)).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const calcularEdad = (fechaNacimiento: string): number => {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mesActual = hoy.getMonth();
  const diaActual = hoy.getDate();
  const mesNacimiento = nacimiento.getMonth();
  const diaNacimiento = nacimiento.getDate();
  if (
    mesActual < mesNacimiento ||
    (mesActual === mesNacimiento && diaActual < diaNacimiento)
  ) {
    edad--;
  }
  return Math.max(0, edad);
};

// Dispositivos compatibles con sus zonas/procedimientos
const DISPOSITIVOS_POR_PROCEDIMIENTO: Record<string, string[]> = {
  "Administración de medicamentos endovenosos": [
    "Vía periférica",
    "Catéter Port-a-Cath",
    "Ninguno",
  ],
  "Administración de medicamentos intramusculares": ["Ninguno"],
  "Aspiración de secreciones por traqueostomía": [
    "Traqueostomía",
    "Cánula binasal",
  ],
  "Cambio de botón de gastrostomía": [
    "Foley de gastrostomía",
    "Sonda de gastrostomía",
  ],
  "Cambio de sonda Foley adaptada a gastrostomía": ["Foley de gastrostomía"],
  "Colocación de sonda Foley": ["Sonda Foley"],
  "Colocación de sonda nasogástrica": ["Sonda nasogástrica"],
  "Curación de gastrostomía": [
    "Sonda de gastrostomía",
    "Foley de gastrostomía",
  ],
  "Curación de traqueostomía": ["Traqueostomía"],
  Nebulización: ["Cánula binasal", "Ninguno"],
  Oxigenoterapia: ["Cánula binasal", "Ventilador mecánico"],
  "Retiro de sonda Foley": ["Sonda Foley"],
  "Retiro de sonda nasogástrica": ["Sonda nasogástrica"],
  "Retiro de vía periférica": ["Vía periférica"],
};

// Generar un registro mock
const generarRegistroMock = (index: number): RegistroRecord => {
  const procedimiento = randomItem([
    "Administración de medicamentos endovenosos",
    "Administración de medicamentos intramusculares",
    "Aspiración de secreciones por traqueostomía",
    "Cambio de botón de gastrostomía",
    "Colocación de sonda Foley",
    "Colocación de sonda nasogástrica",
    "Curación de gastrostomía",
    "Curación de traqueostomía",
    "Nebulización",
    "Oxigenoterapia",
    "Retiro de sonda Foley",
    "Retiro de vía periférica",
  ]);

  const zona = randomItem(["Norte", "Sur", "Este", "Centro", "Oeste"]);
  const distritosZona = {
    Norte: ["Ancón", "Comas", "Independencia", "Los Olivos"],
    Sur: ["Chorrillos", "San Juan de Miraflores", "Villa El Salvador"],
    Este: ["Ate", "San Juan de Lurigancho", "Santa Anita"],
    Centro: ["Cercado de Lima", "La Victoria", "San Isidro"],
    Oeste: ["Barranco", "San Miguel", "Santiago de Surco"],
  };
  const distrito = randomItem(
    distritosZona[zona as keyof typeof distritosZona],
  );

  const tieneDispositivo = randomBool();
  const posiblesDispositivos = DISPOSITIVOS_POR_PROCEDIMIENTO[
    procedimiento
  ] || ["Ninguno"];
  const nombreDispositivo = tieneDispositivo
    ? randomItem(
        posiblesDispositivos.filter((d) => d !== "Ninguno") || [
          "Vía periférica",
        ],
      )
    : undefined;

  const esSonda = nombreDispositivo?.startsWith("Sonda");
  const materialSonda = esSonda
    ? randomItem(["Siliconada", "PVC", "Latex"])
    : undefined;

  const incidencias = randomBool();

  return {
    id: `mock_${index}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    fecha: randomDate(new Date(2024, 0, 1), new Date()),
    horaInicio: `${String(randomInt(7, 19)).padStart(2, "0")}:${randomItem(["00", "15", "30", "45"])}`,
    horaFin: "", // Se calcula en el form
    duracion: randomInt(30, 120),
    paciente: NOMBRES_NIÑOS[index % NOMBRES_NIÑOS.length],
    dni: generarDNI(),
    fechaNacimiento: generarFechaNacimiento(),
    edad: 0, // Se calcula desde fechaNacimiento
    zona,
    distrito,
    diagnosticoPrincipal: randomItem([
      "Atención paliativa",
      "Epilepsia",
      "PCI",
      "SD Duchenne",
      "Secuelas neurológicas",
      "Traqueomalacia",
      "Mucopolisacaridosis",
    ]),
    procedimiento,
    tieneDispositivo,
    nombreDispositivo,
    materialSonda,
    numeroDispositivo: tieneDispositivo ? String(randomInt(10, 99)) : undefined,
    fechaColocacion: tieneDispositivo
      ? randomDate(new Date(2023, 0, 1), new Date())
      : undefined,
    fechaCambio:
      tieneDispositivo && randomBool()
        ? randomDate(new Date(2024, 0, 1), new Date())
        : undefined,
    profesionalACargo: randomItem([
      "Lic. Aguero",
      "Lic. Blancas",
      "Lic. Castillo",
      "Lic. Chumpitaz",
      "Lic. Cruz",
      "Lic. Cupe",
      "Lic. Flores",
      "Lic. García",
      "Lic. Tarazona",
    ]),
    estadoPaciente: randomItem(["Activo", "Activo", "Activo", "Inactivo"]), // Mayoría activos
    resultado: randomItem([
      "Exitoso",
      "Exitoso",
      "Exitoso",
      "Requiere seguimiento",
      "Fallido",
    ]),
    incidencias,
    tipoIncidencia: incidencias
      ? randomItem([
          "Dolor excesivo",
          "Reacción adversa",
          "Derivación a emergencia",
        ])
      : undefined,
    descripcionIncidente: incidencias
      ? "El paciente presentó reacción leve durante el procedimiento, se brindaron medidas de confort y se monitoreó hasta estabilización."
      : undefined,
    procedimientoRepetido: randomBool(),
    checklistCumplido: randomBool(),
    cuidadorPrincipalPresente: randomBool(),
    imagenes: randomBool()
      ? [
          "https://via.placeholder.com/150/92c952?text=Img1",
          "https://via.placeholder.com/150/771796?text=Img2",
        ]
      : undefined,
    createdAt: new Date().toISOString(),
  };
};

// Generar 20 registros
export const MOCK_REGISTROS: RegistroRecord[] = Array.from(
  { length: 20 },
  (_, i) => {
    const registro = generarRegistroMock(i);
    // Calcular edad real desde fechaNacimiento
    registro.edad = calcularEdad(registro.fechaNacimiento);
    // Calcular horaFin basada en horaInicio + duracion
    const [startH, startM] = registro.horaInicio.split(":").map(Number);
    const endMinutes = startH * 60 + startM + registro.duracion;
    const endH = Math.floor(endMinutes / 60);
    const endM = endMinutes % 60;
    registro.horaFin = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
    return registro;
  },
);

// Función para inicializar datos en localStorage (solo si está vacío)
export const initializeMockData = () => {
  if (typeof window === "undefined") return;

  const stored = localStorage.getItem("padomi_registros");
  if (!stored || JSON.parse(stored).length === 0) {
    localStorage.setItem("padomi_registros", JSON.stringify(MOCK_REGISTROS));
    console.log(
      "✅ Datos mock inicializados:",
      MOCK_REGISTROS.length,
      "registros",
    );
  }
};

// Función para resetear datos (útil para desarrollo)
export const resetMockData = () => {
  if (typeof window === "undefined") return;
  localStorage.setItem("padomi_registros", JSON.stringify(MOCK_REGISTROS));
  console.log("🔄 Datos mock reseteados");
};
