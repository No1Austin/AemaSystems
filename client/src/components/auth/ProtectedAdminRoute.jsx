import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

const ADMIN_EMAILS = [
  "austin@aemasystems.com",
  "austinamadi.e@gmail.com",
  "trust@aemasystems.com",
];

export default function ProtectedAdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session?.user?.email) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      const userEmail = session.user.email.toLowerCase();

      const isAdmin = ADMIN_EMAILS.map((email) =>
        email.toLowerCase()
      ).includes(userEmail);

      setAllowed(isAdmin);
      setLoading(false);
    }

    checkAdmin();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-8 py-6 text-center">
          <p className="text-sm text-slate-400">Checking admin access...</p>
        </div>
      </main>
    );
  }

  if (!allowed) {
    return <Navigate to="/" replace />;
  }

  return children;
}