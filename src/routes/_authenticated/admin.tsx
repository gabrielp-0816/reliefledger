import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck, LogOut, Users, Heart, DollarSign, Loader2, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { fmtUSD } from "@/components/campaign-card";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminDashboard,
});

type Donation = { id: string; user_id: string; campaign_id: string; campaign_title: string | null; amount: number; created_at: string };

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, role, loading: authLoading } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [donorCount, setDonorCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (role !== "admin") return;
    (async () => {
      const [d, p] = await Promise.all([
        supabase.from("donations").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
      ]);
      setDonations((d.data ?? []) as Donation[]);
      setDonorCount(p.count ?? 0);
      setLoading(false);
    })();
  }, [authLoading, role]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  if (authLoading) {
    return <div className="grid min-h-screen place-items-center bg-background"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  if (role !== "admin") {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-foreground">
        <div className="max-w-md rounded-2xl border border-border bg-card p-8 text-center">
          <AlertTriangle className="mx-auto h-8 w-8 text-orange-400" />
          <h1 className="mt-3 text-lg font-semibold">Admins only</h1>
          <p className="mt-1 text-sm text-muted-foreground">This dashboard is restricted to admin accounts.</p>
          <div className="mt-5 flex justify-center gap-2">
            <Link to="/dashboard" className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary">Go to donor dashboard</Link>
            <button onClick={signOut} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Sign out</button>
          </div>
        </div>
      </div>
    );
  }

  const total = donations.reduce((s, d) => s + Number(d.amount), 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-orange-500/20 text-orange-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="font-bold tracking-tight">ReliefLedger · Admin</span>
          </Link>
          <button onClick={signOut} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-secondary">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="text-xs font-semibold uppercase tracking-wider text-orange-400">Admin dashboard</div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Oversight</h1>
        <p className="mt-1 text-sm text-muted-foreground">Monitor donors, donations, and disbursements.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat icon={<DollarSign className="h-5 w-5" />} label="Total raised" value={fmtUSD(total)} />
          <Stat icon={<Heart className="h-5 w-5" />} label="Donations" value={String(donations.length)} />
          <Stat icon={<Users className="h-5 w-5" />} label="Registered users" value={String(donorCount)} />
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-semibold">Recent donations</h2>
          <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card">
            {loading ? (
              <div className="grid place-items-center py-12"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
            ) : donations.length === 0 ? (
              <div className="p-10 text-center text-sm text-muted-foreground">No donations yet.</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-secondary/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3">Campaign</th>
                    <th className="px-5 py-3">Donor</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d) => (
                    <tr key={d.id} className="border-t border-border">
                      <td className="px-5 py-3 font-medium">{d.campaign_title ?? d.campaign_id}</td>
                      <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{d.user_id.slice(0, 8)}…</td>
                      <td className="px-5 py-3">{fmtUSD(Number(d.amount))}</td>
                      <td className="px-5 py-3 text-muted-foreground">{new Date(d.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-orange-500/10 text-orange-400">{icon}</div>
      <div className="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}
