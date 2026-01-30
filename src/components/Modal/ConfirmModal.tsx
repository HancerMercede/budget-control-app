interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay - Fondo desenfocado */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Card Minimalista */}
      <div className="relative w-full max-w-[280px] bg-[#1e293b] border border-white/5 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          {/* Indicador sutil de peligro */}
          <div className="flex justify-center mb-4">
            <div className="h-1 w-12 rounded-full bg-slate-700" />
          </div>

          <h3 className="text-white font-black text-[11px] uppercase tracking-[0.2em] text-center mb-2">
            Confirmar Acción
          </h3>

          <p className="text-slate-400 text-[10px] font-medium text-center leading-relaxed mb-6">
            ¿Deseas eliminar este registro permanentemente?
          </p>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-white text-slate-950 text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
            >
              Eliminar Registro
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-transparent text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
            >
              Volver atrás
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
