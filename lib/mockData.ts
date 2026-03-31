// lib/mockData.ts
import type {
  RegistroRecord,
  PersonalRecord,
  RolPersonal,
  EstadoPersonal,
} from "./types";

// Helpers para generar datos aleatorios
const randomItem = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];
const randomBool = () => Math.random() > 0.5;
const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

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

// ✅ Nombres de Licenciados para Gestión de Personal
const NOMBRES_LICENCIADOS = [
  "Lic. Aguero",
  "Lic. Blancas",
  "Lic. Castillo",
  "Lic. Chumpitaz",
  "Lic. Cruz",
  "Lic. Cupe",
  "Lic. Flores",
  "Lic. García",
  "Lic. Tarazona",
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

// ✅ Generar Licenciados para Gestión de Personal
const generarLicenciadoMock = (index: number): PersonalRecord => {
  const now = new Date();
  const currentYear = now.getFullYear();

  // Fecha de nacimiento: entre 25-55 años atrás (licenciados adultos)
  const birthYear = randomInt(currentYear - 55, currentYear - 25);
  const birthMonth = String(randomInt(1, 12)).padStart(2, "0");
  const birthDay = String(randomInt(1, 28)).padStart(2, "0");
  const fechaNacimiento = `${birthYear}-${birthMonth}-${birthDay}`;

  // Fecha de ingreso: entre 1-15 años atrás
  const ingresoYear = randomInt(currentYear - 15, currentYear - 1);
  const fechaIngreso = `${ingresoYear}-${String(randomInt(1, 12)).padStart(2, "0")}-${String(randomInt(1, 28)).padStart(2, "0")}`;

  return {
    id: `personal_${index}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    dni: generarDNI(),
    nombre: NOMBRES_LICENCIADOS[index % NOMBRES_LICENCIADOS.length],
    fechaNacimiento,
    edad: calcularEdad(fechaNacimiento),
    rol: "Licenciado" as RolPersonal,
    estado: randomItem([
      "Habilitado",
      "Habilitado",
      "Habilitado",
      "Ausente",
    ]) as EstadoPersonal, // 75% habilitados
    especialidad: randomItem([
      "Pediatría",
      "UCI",
      "Emergencia",
      "Oncología",
      "General",
      "",
    ]),
    fechaIngreso,
    telefono: `9${randomInt(10000000, 99999999)}`,
    email: `${NOMBRES_LICENCIADOS[index].toLowerCase().replace(/\s/g, ".")}@padomi.pe`,
    direccion: randomItem([
      "Av. Siempre Viva 123, Lima",
      "Calle Falsa 456, San Isidro",
      "Jr. Los Olivos 789, Comas",
      "",
    ]),
    licenciaProfesional: `COLP-${randomInt(10000, 99999)}`,
    fotoUrl: undefined,
    createdAt: new Date().toISOString(),
  };
};

// ✅ Generar 9 Licenciados para Gestión de Personal
export const MOCK_PERSONAL: PersonalRecord[] = NOMBRES_LICENCIADOS.map(
  (_, index) => generarLicenciadoMock(index),
);

// Generar un registro de paciente mock
const generarRegistroMock = (
  index: number,
  licenciadosDisponibles: string[],
): RegistroRecord => {
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

  // ✅ FECHAS DEL MES ACTUAL
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const day = randomInt(1, 28);
  const fecha = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const mesesAtras = randomInt(0, 3);
  const colocacionDate = new Date(
    currentYear,
    currentMonth - 1 - mesesAtras,
    randomInt(1, 28),
  );
  const fechaColocacion = colocacionDate.toISOString().split("T")[0];

  const fechaCambio =
    tieneDispositivo && randomBool()
      ? `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(randomInt(1, 28)).padStart(2, "0")}`
      : undefined;

  // ✅ SELECCIONAR PROFESIONAL DESDE LICENCIADOS DISPONIBLES (no hardcoded)
  const profesionalACargo =
    licenciadosDisponibles.length > 0
      ? randomItem(licenciadosDisponibles)
      : randomItem(NOMBRES_LICENCIADOS); // Fallback si no hay licenciados

  return {
    id: `mock_${index}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    fecha,
    horaInicio: `${String(randomInt(7, 19)).padStart(2, "0")}:${randomItem(["00", "15", "30", "45"])}`,
    horaFin: "",
    duracion: randomInt(30, 120),
    paciente: NOMBRES_NIÑOS[index % NOMBRES_NIÑOS.length],
    dni: generarDNI(),
    fechaNacimiento: generarFechaNacimiento(),
    edad: 0,
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
    fechaColocacion,
    fechaCambio,
    profesionalACargo, // ← Usa nombres de licenciados reales
    estadoPaciente: randomItem(["Activo", "Activo", "Activo", "Inactivo"]),
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

// ✅ Generar registros vinculados a licenciados reales
export const MOCK_REGISTROS: RegistroRecord[] = (() => {
  // Obtener nombres de licenciados HABILITADOS para asignar en registros
  const licenciadosHabilitados = MOCK_PERSONAL.filter(
    (p) => p.estado === "Habilitado",
  ).map((p) => p.nombre);

  // Si no hay habilitados, usar todos como fallback
  const disponibles =
    licenciadosHabilitados.length > 0
      ? licenciadosHabilitados
      : NOMBRES_LICENCIADOS;

  const registros: RegistroRecord[] = [];

  // Generar 2-3 registros por licenciado disponible (total ~20)
  disponibles.forEach((prof, profIndex) => {
    const numRegistros = profIndex < 2 ? 3 : 2;

    for (let i = 0; i < numRegistros; i++) {
      const registro = generarRegistroMock(registros.length, disponibles);
      registro.profesionalACargo = prof; // Forzar que coincida con licenciado real
      registro.edad = calcularEdad(registro.fechaNacimiento);

      // Calcular horaFin
      const [startH, startM] = registro.horaInicio.split(":").map(Number);
      const endMinutes = startH * 60 + startM + registro.duracion;
      const endH = Math.floor(endMinutes / 60);
      const endM = endMinutes % 60;
      registro.horaFin = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;

      registros.push(registro);
    }
  });

  return registros;
})();

// ✅ Inicializar BOTH registros y personal en localStorage
export const initializeMockData = () => {
  if (typeof window === "undefined") return;

  // Inicializar registros de pacientes
  const storedRegistros = localStorage.getItem("padomi_registros");
  if (!storedRegistros || JSON.parse(storedRegistros).length === 0) {
    localStorage.setItem("padomi_registros", JSON.stringify(MOCK_REGISTROS));
    console.log(
      "✅ Registros mock inicializados:",
      MOCK_REGISTROS.length,
      "registros",
    );
  }

  // ✅ Inicializar personal (licenciados) - NUEVO
  const storedPersonal = localStorage.getItem("padomi_personal");
  if (!storedPersonal || JSON.parse(storedPersonal).length === 0) {
    localStorage.setItem("padomi_personal", JSON.stringify(MOCK_PERSONAL));
    console.log(
      "✅ Personal mock inicializado:",
      MOCK_PERSONAL.length,
      "licenciados",
    );
  }
};

// ✅ Resetear BOTH registros y personal
export const resetMockData = () => {
  if (typeof window === "undefined") return;
  localStorage.setItem("padomi_registros", JSON.stringify(MOCK_REGISTROS));
  localStorage.setItem("padomi_personal", JSON.stringify(MOCK_PERSONAL)); // ← NUEVO
  console.log("🔄 Datos mock y personal reseteados");
};
