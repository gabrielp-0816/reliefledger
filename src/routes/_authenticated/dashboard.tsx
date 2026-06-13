import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { HeartHandshake, LogOut, Heart, Bookmark, TrendingUp, Settings, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { disasters } from "@/lib/disasters";
import { fmtUSD } from "@/components/campaign-card";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DonorDashboard,
});

type Donation = { id: string; campaign_id: string; campaign_title: string | null; amount: number; currency: string; created_at: string };
type Saved = { id: string; campaign_id: string };
type Profile = { full_name: string | null; phone: string | null; address: string | null; age: number | null; birthdate: string | null; avatar_url: string | null };

function DonorDashboard() {
  const navigate = useNavigate();
  const { user, role, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<"impact" | "history" | "saved" | "settings">("impact");
  const [donations, setDonations] = useState<Donation[]>([]);
  const [saved, setSaved] = useState<Saved[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [d, s, p] = await Promise.all([
        supabase.from("donations").select("*").order("created_at", { ascending: false }),
        supabase.from("saved_campaigns").select("id,campaign_id"),
        supabase.from("profiles").select("full_name,phone,address,age,birthdate,avatar_url").eq("id", user.id).maybeSingle(),
      ]);
      setDonations((d.data ?? []) as Donation[]);
      setSaved((s.data ?? []) as Saved[]);
      setProfile((p.data ?? null) as Profile | null);
      setLoading(false);
    })();
  }, [user]);

  // Redirect admins to admin dashboard
  useEffect(() => {
    if (!authLoading && role === "admin") navigate({ to: "/admin" });
  }, [authLoading, role, navigate]);

  const totalDonated = donations.reduce((s, d) => s + Number(d.amount), 0);
  const uniqueCampaigns = new Set(donations.map((d) => d.campaign_id)).size;
  const savedDisasters = disasters.filter((d) => saved.some((s) => s.campaign_id === d.id));

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  const saveProfile = async () => {
    if (!user || !profile) return;
    const { error } = await supabase.from("profiles").update(profile).eq("id", user.id);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
  };

  if (authLoading || loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-hero-gradient text-primary-foreground">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <span className="font-bold tracking-tight">ReliefLedger</span>
          </Link>
          <button onClick={signOut} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-secondary">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Donor dashboard</div>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              Hi, {profile?.full_name?.split(" ")[0] ?? "friend"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Your impact at a glance.</p>
          </div>
          <Link to="/" className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 sm:inline-flex">
            Browse campaigns
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat icon={<Heart className="h-5 w-5" />} label="Total donated" value={fmtUSD(totalDonated)} tint="indigo" />
          <Stat icon={<TrendingUp className="h-5 w-5" />} label="Campaigns supported" value={String(uniqueCampaigns)} tint="cyan" />
          <Stat icon={<Bookmark className="h-5 w-5" />} label="Saved campaigns" value={String(saved.length)} tint="orange" />
        </div>

        {/* Tabs */}
        <div className="mt-8 flex flex-wrap gap-1 border-b border-border">
          {([
            ["impact", "Impact"], ["history", "Donation history"],
            ["saved", "Saved"], ["settings", "Settings"],
          ] as const).map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition ${
                tab === k ? "border-indigo-500 text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}>{label}</button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "impact" && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold">Your impact so far</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                You've contributed {fmtUSD(totalDonated)} across {uniqueCampaigns} {uniqueCampaigns === 1 ? "campaign" : "campaigns"}.
                Every donation is verifiable on the public ledger.
              </p>
              {donations.length === 0 && (
                <Link to="/" className="mt-4 inline-flex rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400">
                  Make your first donation
                </Link>
              )}
            </div>
          )}

          {tab === "history" && (
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              {donations.length === 0 ? (
                <Empty title="No donations yet" body="When you donate, it'll show up here." />
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <tr><th className="px-5 py-3">Campaign</th><th className="px-5 py-3">Amount</th><th className="px-5 py-3">Date</th></tr>
                  </thead>
                  <tbody>
                    {donations.map((d) => (
                      <tr key={d.id} className="border-t border-border">
                        <td className="px-5 py-3 font-medium">{d.campaign_title ?? d.campaign_id}</td>
                        <td className="px-5 py-3">{fmtUSD(Number(d.amount))}</td>
                        <td className="px-5 py-3 text-muted-foreground">{new Date(d.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {tab === "saved" && (
            <div>
              {savedDisasters.length === 0 ? (
                <div className="rounded-2xl border border-border bg-card">
                  <Empty title="No saved campaigns" body="Bookmark campaigns to follow them here." />
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {savedDisasters.map((d) => (
                    <Link key={d.id} to="/campaign/$id" params={{ id: d.id }}
                      className="rounded-2xl border border-border bg-card p-5 hover:border-indigo-500/40">
                      <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400">{d.type}</div>
                      <div className="mt-1 font-semibold">{d.title}</div>
                      <div className="text-sm text-muted-foreground">{d.location}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "settings" && profile && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold"><Settings className="h-4 w-4" /> Account settings</div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" value={profile.full_name ?? ""} onChange={(v) => setProfile({ ...profile, full_name: v })} />
                <Field label="Phone" value={profile.phone ?? ""} onChange={(v) => setProfile({ ...profile, phone: v })} />
                <Field label="Address" value={profile.address ?? ""} onChange={(v) => setProfile({ ...profile, address: v })} />
                <Field label="Age" type="number" value={String(profile.age ?? "")} onChange={(v) => setProfile({ ...profile, age: v ? Number(v) : null })} />
                <Field label="Birthdate" type="date" value={profile.birthdate ?? ""} onChange={(v) => setProfile({ ...profile, birthdate: v })} />
              </div>
              <button onClick={saveProfile} className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                Save changes
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Stat({ icon, label, value, tint }: { icon: React.ReactNode; label: string; value: string; tint: "indigo" | "cyan" | "orange" }) {
  const tints = { indigo: "bg-indigo-500/10 text-indigo-400", cyan: "bg-cyan-500/10 text-cyan-400", orange: "bg-orange-500/10 text-orange-400" }[tint];
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className={`grid h-10 w-10 place-items-center rounded-lg ${tints}`}>{icon}</div>
      <div className="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}

function Empty({ title, body }: { title: string; body: string }) {
  return (
    <div className="p-10 text-center">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-sm text-muted-foreground">{body}</div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-medium text-muted-foreground">{label}</div>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
    </label>
  );
}
