import React, { useState } from "react";
import { saveExpense } from "../../services/expenseService";
import { PlusCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getLocalDate } from "../../components/utils/GetLocalDate";

export const ExpenseForm = () => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Alimento");
  const [date, setDate] = useState<string>(getLocalDate());

  const { user } = useAuth();

  const userId = user?.uid ?? "";

  const handleSubmit = async (e: React.FormEvent) => {
    if (!userId) return;

    e.preventDefault();

    if (!description || !amount) return;

    try {
      await saveExpense({
        description,
        amount: parseFloat(amount),
        category,
        userId: userId,
        date: date,
      });

      setDescription("");
      setAmount("");
      setCategory("Alimento");
    } catch (error) {
      alert("Error al saving: " + error);
    }
  };

  return (
    <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-800 shadow-xl">
      <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
        <PlusCircle size={20} className="text-blue-400" />
        Registro Rápido
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">
            Descripción
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej. Cena con amigos"
            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">
              Monto
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white font-bold focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">
              Categoría
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
            >
              <option value="Alimento">Alimento</option>
              <option value="Salud">Salud</option>
              <option value="Transporte">Transporte</option>
              <option value="Ocio">Ocio</option>
              <option value="Gastos Fijos">Gastos Fijos</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">
              Fecha del Gasto
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-noned"
              style={{ colorScheme: "dark" }}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg active:scale-95"
        >
          Guardar Gasto
        </button>
      </form>
    </div>
  );
};
