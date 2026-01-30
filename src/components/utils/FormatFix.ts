export const formatFix = (dateValue: string | any): string => {
  if (!dateValue) return "---";

  // 1. Manejo de nuestro nuevo formato String "YYYY-MM-DD"
  if (typeof dateValue === "string") {
    const pureDate = dateValue.split("T")[0];
    const parts = pureDate.split("-");

    if (parts.length === 3) {
      const [year, month, day] = parts;
      // Obtenemos los últimos dos dígitos del año (ej: 2026 -> 26)
      const shortYear = year.slice(-2);
      return `${month}/${day}/${shortYear}`;
    }
    return pureDate;
  }

  // 2. Manejo de Timestamps viejos (Firebase)
  if (dateValue?.toDate) {
    const d = dateValue.toDate();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yy = String(d.getFullYear()).slice(-2);
    return `${mm}/${dd}/${yy}`;
  }

  return "Fecha inv.";
};
