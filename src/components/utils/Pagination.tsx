import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-slate-900/40 border-t border-white/5 rounded-b-3xl">
      <div className="flex flex-col text-white">
        <span className="text-[10px] text-cyan-300 font-black uppercase ">
          Página
        </span>
        <p className="text-xs font-bold">
          {currentPage} de {totalPages}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-950/50 border border-white/5 disabled:opacity-20"
        >
          <ChevronLeft size={18} className="text-white" />
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-950/50 border border-white/5 disabled:opacity-20"
        >
          <ChevronRight size={18} className="text-white" />
        </button>
      </div>
    </div>
  );
}
