import { useEffect, useState } from "react";
import type { currentUser, userProviderProps } from "../types";
import { onAuthStateChangeListener } from "../config/firebase";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: userProviderProps) => {
  const [user, setUser] = useState<currentUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChangeListener((user: currentUser) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
