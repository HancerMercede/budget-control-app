import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  color: string; // Mantenemos el color para el texto del monto
}

export const StatsCard = ({
  title,
  amount,
  icon: Icon,
  color,
}: StatsCardProps) => {
  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-2xl relative overflow-hidden group">
      <div
        className={`absolute -right-4 -top-4 w-24 h-24 bg-current opacity-10 rounded-full blur-2xl transition-all group-hover:opacity-20 ${color}`}
      ></div>

      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <Icon size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">
              {title}
            </span>
          </div>
        </div>

        <div className="flex items-baseline gap-1">
          <span className={`text-4xl font-black tracking-tighter ${color}`}>
            ${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          <span className="text-slate-500 font-medium text-sm">USD</span>
        </div>
      </div>
    </div>
  );
};
