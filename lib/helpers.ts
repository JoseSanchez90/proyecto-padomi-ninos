// lib/helpers.ts

// ✅ Helper simple para obtener licenciados activos desde localStorage
export const getLicenciadosActivos = (): string[] => {
  // Solo ejecutar en cliente
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem("padomi_personal");
    if (!stored) return [];

    const personal: any[] = JSON.parse(stored);

    // Filtrar: solo Licenciados con estado "Habilitado"
    return personal
      .filter((p) => p.rol === "Licenciado" && p.estado === "Habilitado")
      .map((p) => p.nombre)
      .sort((a, b) => a.localeCompare(b)); // Ordenar alfabéticamente
  } catch (error) {
    console.error("Error loading licenciados:", error);
    return [];
  }
};
