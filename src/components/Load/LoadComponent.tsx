export const LoadComponent = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
      <p className="text-slate-400 animate-pulse">Cargando tus finanzas...</p>
    </div>
  );
};
