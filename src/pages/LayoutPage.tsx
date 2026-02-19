import type { User } from "@firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../config/firebase";
import { AuthModal } from "../auth/handleGoogleLogin";
import { DashboardPage } from "./DashboardPage";

const LayoutPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0a]" />;
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <AuthModal isOpen={true} />
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <DashboardPage />
    </main>
  );
};

export default LayoutPage;
