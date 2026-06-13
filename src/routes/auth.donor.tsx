import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { HeartHandshake, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/donor")({
  head: () => ({
    meta: [
      { title: "Donor Sign in — ReliefLedger" },
      { name: "description", content: "Sign in or create your donor account on ReliefLedger." },
    ],
  }),
  component: DonorAuth,
});

const signupSchema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(8, "At least 8 characters").max(72),
  full_name: z.string().trim().min(1, "Required").max(120),
  phone: z.string().trim().min(5, "Required").max(30),
  address: z.string().trim().min(1, "Required").max(255),
  age: z.coerce.number().int().min(13, "Must be 13+").max(120),
  birthdate: z.string().min(1, "Required"),
});

function DonorAuth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [validId, setValidId] = useState<File | null>(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    address: "",
    age: "",
    birthdate: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onGoogle = async () => {
    setLoading(true);
    const res = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/dashboard",
    });
    if (res.error) {
      toast.error(res.error.message || "Google sign-in failed");
      setLoading(false);
    }
  };

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    setLoading(false);
    if (error) return toast.error(formatAuthError(error.message));
    toast.success("Welcome back");
    navigate({ to: "/dashboard" });
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
        emailRedirectTo: window.location.origin + "/dashboard",
        data: {
          full_name: parsed.data.full_name,
          phone: parsed.data.phone,
          address: parsed.data.address,
          age: parsed.data.age,
          birthdate: parsed.data.birthdate,
          role: "donor",
        },
      },
    });
    if (error) {
      setLoading(false);
      return toast.error(error.message);
    }

    if (data.user && data.user.identities?.length === 0) {
      setLoading(false);
      return toast.error(
        "That email already has an account. Sign in with Google or reset your password.",
      );
    }

    const user = data.user;
    // Persist age/birthdate + upload valid ID if signed-in immediately
    if (user) {
      await supabase
        .from("profiles")
        .update({
          age: parsed.data.age,
          birthdate: parsed.data.birthdate,
        })
        .eq("id", user.id);

      if (validId) {
        const ext = validId.name.split(".").pop() ?? "jpg";
        const path = `${user.id}/valid-id.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("valid-ids")
          .upload(path, validId, { upsert: true });
        if (!upErr) {
          await supabase
            .from("profiles")
            .update({ valid_id_url: path })
            .eq("id", user.id);
        }
      }
    }
    setLoading(false);
    toast.success(data.session ? "Account created!" : "Check your email to confirm your account");
    if (data.session) navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute -top-24 left-1/3 h-96 w-96 rounded-full bg-indigo-600/15 blur-[120px]" />
      <div className="relative mx-auto max-w-md px-6 py-12">
        <Link to="/" className="mb-8 inline-flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-hero-gradient text-primary-foreground">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <span className="font-bold tracking-tight">ReliefLedger</span>
        </Link>

        <div className="rounded-2xl border border-border bg-card p-7 shadow-trust">
          <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-400">
            Donor
          </div>
          <h1 className="text-2xl font-bold">
            {mode === "login" ? "Welcome back" : "Create your donor account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login" ? "Sign in to support active relief funds." : "Help us verify donors with a few details."}
          </p>

          <button
            type="button"
            onClick={onGoogle}
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium hover:bg-secondary disabled:opacity-60"
          >
            <GoogleIcon /> Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> OR <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={mode === "login" ? onLogin : onSignup} className="space-y-3">
            <Field label="Email">
              <input type="email" required value={form.email} onChange={set("email")} className={inputCls} />
            </Field>
            <Field label="Password">
              <input type="password" required minLength={8} value={form.password} onChange={set("password")} className={inputCls} />
            </Field>

            {mode === "login" && (
              <button type="button" onClick={onForgotPassword} className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
                Forgot password?
              </button>
            )}

            {mode === "signup" && (
              <>
                <Field label="Full name">
                  <input required value={form.full_name} onChange={set("full_name")} className={inputCls} />
                </Field>
                <Field label="Phone">
                  <input required value={form.phone} onChange={set("phone")} className={inputCls} />
                </Field>
                <Field label="Address">
                  <input required value={form.address} onChange={set("address")} className={inputCls} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Age">
                    <input type="number" min={13} max={120} required value={form.age} onChange={set("age")} className={inputCls} />
                  </Field>
                  <Field label="Birthdate">
                    <input type="date" required value={form.birthdate} onChange={set("birthdate")} className={inputCls} />
                  </Field>
                </div>
                <Field label="Valid ID (image)">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setValidId(e.target.files?.[0] ?? null)}
                    className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground"
                  />
                </Field>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {mode === "login" ? "New here?" : "Already have an account?"}{" "}
            <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="font-semibold text-indigo-400 hover:text-indigo-300">
              {mode === "login" ? "Create donor account" : "Sign in"}
            </button>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Admin? <Link to="/auth/admin" className="text-orange-400 hover:text-orange-300">Use the admin sign in</Link>
        </p>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-medium text-muted-foreground">{label}</div>
      {children}
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.1 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.4 1.1 7.4 2.8l5.7-5.7C33.6 6.7 29.1 5 24 5 13.5 5 5 13.5 5 24s8.5 19 19 19 19-8.5 19-19c0-1.2-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c2.8 0 5.4 1.1 7.4 2.8l5.7-5.7C33.6 6.7 29.1 5 24 5 16.3 5 9.7 9.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 43c5 0 9.5-1.6 13-4.4l-6-5.1c-1.9 1.3-4.3 2-7 2-5.3 0-9.7-2.9-11.3-7l-6.5 5C9.5 38.6 16.2 43 24 43z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.7 2-2 3.7-3.7 5l6 5.1C41.9 35.5 45 30.2 45 24c0-1.2-.1-2.4-.4-3.5z"/>
    </svg>
  );
}

function formatAuthError(message: string) {
  if (message.toLowerCase().includes("invalid login credentials")) {
    return "Invalid email or password. If you used Google before, continue with Google or reset your password.";
  }
  return message;
}
