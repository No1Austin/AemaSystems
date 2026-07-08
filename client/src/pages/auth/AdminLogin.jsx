import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ShieldCheck } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

const ADMIN_EMAILS = ["austin@aemasystems.com", "austinamadi.e@gmail.com", "edmarkaustin@GamepadDirectional.com", "trust@aemasystems.com"];

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setStatus(error.message);
      setLoading(false);
      return;
    }

    const userEmail = data?.user?.email?.toLowerCase();

    const isAdmin = ADMIN_EMAILS.map((item) => item.toLowerCase()).includes(
      userEmail
    );

    if (!isAdmin) {
      await supabase.auth.signOut();
      setStatus("This account is not authorized for admin access.");
      setLoading(false);
      return;
    }

    navigate("/governance");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050816] px-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400/10">
            <ShieldCheck className="h-8 w-8 text-emerald-400" />
          </div>

          <h1 className="mt-5 text-3xl font-black">Admin Login</h1>

          <p className="mt-3 text-sm text-slate-400">
            Access the AEMA Governance Portal.
          </p>
        </div>

        <form onSubmit={handleLogin} className="grid gap-4">
          <div>
            <label className="mb-2 block text-sm text-slate-400">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400"
              placeholder="admin@aemasystems.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-400">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400"
              placeholder="••••••••"
            />
          </div>

          {status && (
            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
              {status}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Lock className="h-4 w-4" />
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}