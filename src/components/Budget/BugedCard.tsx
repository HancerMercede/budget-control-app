import { useState, useEffect } from "react";

import { useAuth } from "../../hooks/useAuth";
import { Edit2, Check, X, Wallet } from "lucide-react";
import { getRemoteBudget, updateBaseBudget } from "../../config/firebase";
import { type UserBudgetData } from "../../types";

export const BudgetCard = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [budgetData, setBudgetData] = useState<UserBudgetData>({
    baseBudget: 0,
    currentBudget: 0,
    currentMonth: "",
  });
  const [tempValue, setTempValue] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      const data = await getRemoteBudget(user.uid);
      setBudgetData(data);
      setTempValue(data.baseBudget.toString());
    };
    loadData();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    const numValue = parseFloat(tempValue);

    try {
      await updateBaseBudget(user.uid, numValue);
      setBudgetData((prev) => ({
        ...prev,
        baseBudget: numValue,
        currentBudget: numValue,
      }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving budget:", error);
    }
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-2xl relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all"></div>

      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <Wallet size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">
              Presupuesto Mensual
            </span>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-cyan-400 transition-colors"
            >
              <Edit2 size={14} />
            </button>
          ) : (
            <div className="flex gap-1">
              <button
                onClick={handleSave}
                className="p-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500 hover:text-white transition-all"
              >
                <Check size={14} />
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-1">
            {isEditing ? (
              <input
                type="number"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="bg-slate-800/50 border border-cyan-500/30 text-2xl font-black text-white w-full rounded-xl px-3 py-1 outline-none focus:ring-2 ring-cyan-500/20"
                autoFocus
              />
            ) : (
              <>
                <span className="text-4xl font-black text-white tracking-tighter">
                  ${budgetData.currentBudget.toLocaleString()}
                </span>
                <span className="text-slate-500 font-medium text-sm">USD</span>
              </>
            )}
          </div>
          {!isEditing && budgetData.currentBudget !== budgetData.baseBudget && (
            <div className="text-xs text-emerald-400/70">
              Incluye ${(budgetData.currentBudget - budgetData.baseBudget).toLocaleString()} del mes anterior
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
