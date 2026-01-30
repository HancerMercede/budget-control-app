import { useAuth } from "../../hooks/useAuth";
import { auth } from "../../config/firebase";
import { LogOut } from "lucide-react";

export const Profile = () => {
  const { user } = useAuth();
  return (
    <div className="flex items-center gap-3">
      <img
        src={user?.photoURL || ""}
        referrerPolicy="no-referrer"
        className="w-9 h-9 rounded-full border border-white/10"
        alt="Profile"
      />
      <div>
        <span>{user?.displayName}</span>
      </div>
      <button
        onClick={() => auth.signOut()}
        title="Cerrar Sesión"
        className="p-2.5 rounded-xl bg-red-500/5 text-red-500 border border-red-500/10 hover:bg-red-500 hover:text-white transition-all duration-300 group/btn"
      >
        <LogOut
          size={18}
          className="group-hover/btn:scale-110 transition-transform"
        />
      </button>
    </div>
  );
};
