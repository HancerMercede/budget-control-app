import { Profile } from "../profile/Profile";

type Props = {
  selectedMonth: string;
};
export const Header = ({ selectedMonth }: Props) => {
  return (
    <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">Gastos de {selectedMonth} 2026</h1>
        <p className="text-slate-400 text-sm">Resumen de finanzas personales</p>
      </div>
      <Profile />
    </header>
  );
};
