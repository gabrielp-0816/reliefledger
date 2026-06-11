import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { CampaignCard, fmtUSD } from "@/components/campaign-card";
import { ProgressBar } from "@/components/progress-bar";
import { disasters } from "@/lib/disasters";
import { AlertTriangle, Search, ShieldCheck, Eye, Layers, HandCoins } from "lucide-react";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ReliefLedger — Active Disasters Dashboard" },
      { name: "description", content: "Browse active, verified disaster relief funds. Filter by location, disaster type, and urgency." },
    ],
  }),
  component: Index,
});

const types = ["All", "Typhoon", "Flood", "Earthquake", "Wildfire", "Landslide"] as const;
const urgencies = ["All", "Critical", "High", "Ongoing"] as const;

function Index() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<(typeof types)[number]>("All");
  const [urg, setUrg] = useState<(typeof urgencies)[number]>("All");

  const filtered = useMemo(() => {
    return disasters.filter((d) => {
      const matchesQ = !q ||
        d.title.toLowerCase().includes(q.toLowerCase()) ||
        d.location.toLowerCase().includes(q.toLowerCase()) ||
        d.organizer.toLowerCase().includes(q.toLowerCase());
      const matchesType = type === "All" || d.type === type;
      const matchesUrg = urg === "All" || d.urgency === urg;
      return matchesQ && matchesType && matchesUrg;
    });
  }, [q, type, urg]);

  const critical = disasters.filter((d) => d.urgency === "Critical");
  const totalRaised = disasters.reduce((s, d) => s + d.raised, 0);
  const totalDonors = disasters.reduce((s, d) => s + d.donors, 0);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="bg-hero-gradient text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--alert)] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--alert)]" />
                </span>
                {critical.length} active critical emergencies
              </div>
              <h1 className="mt-4 text-4xl font-black leading-[1.05] sm:text-5xl lg:text-6xl">
                When disaster strikes, every minute and every dollar counts.
              </h1>
              <p className="mt-5 max-w-xl text-base text-primary-foreground/85 sm:text-lg">
                ReliefLedger routes donations <strong>only</strong> to verified local governments and accredited NGOs — and shows you exactly how funds are spent, phase by phase.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#disasters"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-primary shadow-trust transition hover:bg-white/90"
                >
                  See active disasters
                </a>
                <Link
                  to="/start"
                  className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-primary-foreground backdrop-blur transition hover:bg-white/20"
                >
                  Start a relief fund
                </Link>
              </div>
              <div className="mt-8 grid max-w-md grid-cols-3 gap-4 text-sm">
                <Stat label="Raised this month" value={fmtUSD(totalRaised)} />
                <Stat label="Active donors" value={totalDonors.toLocaleString()} />
                <Stat label="Verified responders" value="48" />
              </div>
            </div>

            {/* Urgent banner card */}
            {critical[0] && (
              <Link
                to="/campaign/$id"
                params={{ id: critical[0].id }}
                className="group block overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur transition hover:bg-white/15"
              >
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[color:var(--alert)]">
                  <AlertTriangle className="h-4 w-4" />
                  Urgent · responding now
                </div>
                <h3 className="mt-2 text-2xl font-bold leading-tight">{critical[0].title}</h3>
                <p className="mt-1 text-sm text-primary-foreground/80">{critical[0].location} · {critical[0].organizer}</p>
                <div className="mt-4">
                  <ProgressBar value={Math.round((critical[0].raised / critical[0].goal) * 100)} tone="alert" />
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="font-semibold">{fmtUSD(critical[0].raised)}</span>
                    <span className="text-primary-foreground/80">of {fmtUSD(critical[0].goal)}</span>
                  </div>
                </div>
                <div className="mt-4 inline-flex items-center justify-center rounded-lg bg-[color:var(--alert)] px-4 py-2 text-sm font-semibold text-[color:var(--alert-foreground)] transition group-hover:brightness-110">
                  Donate to this emergency →
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Filters + grid */}
      <section id="disasters" className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-3xl font-black tracking-tight">Active Relief Funds</h2>
            <p className="mt-1 text-muted-foreground">Every campaign is verified before it can accept donations.</p>
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search location, organizer, disaster…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-4">
          <FilterRow label="Type" options={[...types]} value={type} onChange={(v) => setType(v as typeof type)} />
          <FilterRow label="Urgency" options={[...urgencies]} value={urg} onChange={(v) => setUrg(v as typeof urg)} />
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => <CampaignCard key={d.id} d={d} />)}
        </div>
        {filtered.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-secondary/30 p-10 text-center text-muted-foreground">
            No relief funds match your filters.
          </div>
        )}
      </section>

      {/* How it works */}
      <section id="how" className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-3xl font-black tracking-tight">How ReliefLedger works</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">A simple model designed for speed, dignity, and accountability.</p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <Step
              icon={<ShieldCheck className="h-5 w-5" />}
              n={1}
              title="Verify the responder"
              body="Only credentialed local governments and accredited NGOs can launch a fund — we check IDs, permits, and prior relief history."
            />
            <Step
              icon={<HandCoins className="h-5 w-5" />}
              n={2}
              title="Donate to a phase, not a promise"
              body="Funds are held in escrow and released in tracked phases (food, shelter, rebuild). You see the breakdown before you give."
            />
            <Step
              icon={<Eye className="h-5 w-5" />}
              n={3}
              title="Watch the money work"
              body="Every disbursement appears on the public ledger with photos, receipts, and a beneficiary count."
            />
          </div>
        </div>
      </section>

      {/* Trust & safety */}
      <section id="safety" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-12">
          <div className="grid items-start gap-10 md:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-verified/10 px-3 py-1 text-xs font-semibold text-[color:var(--verified)]">
                <ShieldCheck className="h-3.5 w-3.5" /> Donor protection
              </div>
              <h2 className="mt-3 text-3xl font-black tracking-tight">Your donation is protected by design.</h2>
              <p className="mt-3 text-muted-foreground">
                We treat disaster relief differently from generic crowdfunding. Money never sits in a personal account, and every responder is identifiable.
              </p>
            </div>
            <ul className="space-y-4">
              {[
                ["Escrow disbursement", "Donations are held until a phase milestone is met and verified by an on-the-ground partner."],
                ["Verified-only campaigns", "No anonymous organizers. Every fund lists a real organization with credentials on file."],
                ["Public ledger", "Every transaction in and out of a fund is published with timestamps and beneficiary counts."],
                ["Refund protection", "If a fund is paused for misuse, undistributed donations are refunded automatically."],
              ].map(([t, b]) => (
                <li key={t} className="flex gap-3">
                  <Layers className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <div className="font-semibold">{t}</div>
                    <div className="text-sm text-muted-foreground">{b}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xl font-bold sm:text-2xl">{value}</div>
      <div className="text-[11px] uppercase tracking-wider text-primary-foreground/70">{label}</div>
    </div>
  );
}

function FilterRow({
  label, options, value, onChange,
}: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              value === o
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:bg-secondary"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function Step({ icon, n, title, body }: { icon: React.ReactNode; n: number; title: string; body: string }) {
  return (
    <div className="relative rounded-2xl border border-border bg-card p-6">
      <div className="absolute -top-3 left-6 grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{n}</div>
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">{icon}</div>
      <h3 className="mt-3 font-bold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
