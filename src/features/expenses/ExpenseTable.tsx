import { Trash2 } from "lucide-react";
import { deleteExpense } from "../../services/expenseService";
import { type Expense } from "../../types/index";
import { formatFix } from "../../components/utils/FormatFix";
import { Pagination } from "../../components/utils/Pagination";
import { useTotalPages } from "../../hooks/useTotalPages";
import { useConfirm } from "../../hooks/useConfirm";
import { ConfirmModal } from "../../components/Modal/ConfirmModal";

interface Props {
  expenses: Expense[];
}

export const ExpenseTable = ({ expenses }: Props) => {
  const { totalPages, currentExpenses, currentPage, setCurrentPage } =
    useTotalPages(expenses);

  const { isOpen, selectedId, askConfirm, closeConfirm } = useConfirm();
  return (
    <div className="bg-[#1e293b] rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
      <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#111827] text-[10px] uppercase tracking-widest text-slate-500 font-black">
            <tr>
              <th className="px-6 py-4">Descripción</th>
              <th className="px-6 py-4">Categoría</th>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4 text-right">Monto</th>
              <th className="px-6 py-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 text-gray-300">
            {expenses.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-gray-500 italic"
                >
                  No hay gastos registrados en este mes.
                </td>
              </tr>
            ) : (
              currentExpenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-white">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 whitespace-nowrap rounded-md bg-slate-700 text-[10px] text-slate-300">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {formatFix(expense.date)}
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold tracking-tighter text-red-400">
                    $
                    {expense.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        askConfirm(expense.id!);
                      }}
                      className="text-gray-500 hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      <ConfirmModal
        isOpen={isOpen}
        onClose={closeConfirm}
        onConfirm={async () => {
          if (selectedId) deleteExpense(selectedId);
          closeConfirm();
        }}
      />
    </div>
  );
};
