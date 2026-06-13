import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { HeartHandshake, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — ReliefLedger" },
      { name: "description", content: "Set a new ReliefLedger account password." },
    ],
  }),
  component: ResetPassword,
});

const schema = z.object({
  password: z.string().min(8, "At least 8 characters").max(72),
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ password });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
    setLoading(false);
    if (error) return toast.error(error.message);

    toast.success("Password updated. You can sign in now.");
    navigate({ to: "/auth/donor" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative mx-auto max-w-md px-6 py-12">
        <Link to="/" className="mb-8 inline-flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-hero-gradient text-primary-foreground">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <span className="font-bold tracking-tight">ReliefLedger</span>
        </Link>

        <div className="rounded-2xl border border-border bg-card p-7 shadow-trust">
          <h1 className="text-2xl font-bold">Reset password</h1>
          <p className="mt-1 text-sm text-muted-foreground">Choose a new password for your account.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <label className="block">
              <div className="mb-1 text-xs font-medium text-muted-foreground">New password</div>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Update password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}