import type { MonthFilterProps } from "../../types";

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export const MonthFilter = ({
  currentMonth,
  onMonthChange,
}: MonthFilterProps) => {
  return (
    <div className="flex items-center gap-4 bg-[#1e293b] p-4 rounded-xl border border-gray-800">
      <label className="text-gray-400 text-sm font-bold uppercase">
        Filtrar por Mes:
      </label>
      <select
        value={currentMonth}
        onChange={(e) => onMonthChange(e.target.value)}
        className="bg-[#0f172a] border border-gray-700 text-white text-sm rounded-lg p-2 outline-none focus:border-blue-500 transition-all"
      >
        {months.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>
    </div>
  );
};
