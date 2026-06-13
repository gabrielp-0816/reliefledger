import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { ShieldCheck, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/admin")({
  head: () => ({
    meta: [
      { title: "Admin Sign in — ReliefLedger" },
      { name: "description", content: "Admin sign in for ReliefLedger campaign oversight." },
    ],
  }),
  component: AdminAuth,
});

const signupSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(72),
  full_name: z.string().trim().min(1).max(120),
});

function AdminAuth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", full_name: "" });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    if (error) {
      setLoading(false);
      return toast.error(formatAuthError(error.message));
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user!.id);
    const isAdmin = (roles ?? []).some((r) => r.role === "admin");
    setLoading(false);
    if (!isAdmin) {
      await supabase.auth.signOut();
      return toast.error("This account isn't an admin.");
    }
    toast.success("Welcome back, admin");
    navigate({ to: "/admin" });
  };

  const onForgotPassword = async () => {
    const email = form.email.trim();
    if (!email) return toast.error("Enter your email first.");
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Check your email for a password reset link.");
  };

  const onSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signupSchema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: window.location.origin + "/admin",
        data: { full_name: parsed.data.full_name, role: "admin" },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    if (data.user && data.user.identities?.length === 0) {
      return toast.error("That email already has an account. Sign in or reset your password.");
    }
    toast.success(
      data.session ? "Admin account created" : "Check your email to confirm your account",
    );
    if (data.session) navigate({ to: "/admin" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute -top-24 right-1/4 h-96 w-96 rounded-full bg-orange-500/15 blur-[120px]" />
      <div className="relative mx-auto max-w-md px-6 py-12">
        <Link to="/" className="mb-8 inline-flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-orange-500/20 text-orange-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="font-bold tracking-tight">ReliefLedger</span>
        </Link>

        <div className="rounded-2xl border border-border bg-card p-7 shadow-trust">
          <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-semibold text-orange-400">
            Admin
          </div>
          <h1 className="text-2xl font-bold">
            {mode === "login" ? "Admin sign in" : "Create admin account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login"
              ? "Access the campaign oversight dashboard."
              : "Open admin signup — restrict in production."}
          </p>

          <form onSubmit={mode === "login" ? onLogin : onSignup} className="mt-6 space-y-3">
            {mode === "signup" && (
              <Field label="Full name">
                <input
                  required
                  value={form.full_name}
                  onChange={set("full_name")}
                  className={inputCls}
                />
              </Field>
            )}
            <Field label="Email">
              <input
                type="email"
                required
                value={form.email}
                onChange={set("email")}
                className={inputCls}
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={set("password")}
                className={inputCls}
              />
            </Field>

            {mode === "login" && (
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-xs font-semibold text-orange-400 hover:text-orange-300"
              >
                Forgot password?
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-500/90 disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "login" ? "Sign in" : "Create admin account"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {mode === "login" ? "Need an admin account?" : "Already an admin?"}{" "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="font-semibold text-orange-400 hover:text-orange-300"
            >
              {mode === "login" ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Donor?{" "}
          <Link to="/auth/donor" className="text-indigo-400 hover:text-indigo-300">
            Use the donor sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-medium text-muted-foreground">{label}</div>
      {children}
    </label>
  );
}

function formatAuthError(message: string) {
  if (message.toLowerCase().includes("invalid login credentials")) {
    return "Invalid email or password. If this account already exists, reset the password.";
  }
  return message;
}
