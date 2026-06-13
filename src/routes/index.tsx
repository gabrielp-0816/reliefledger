import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { CampaignCard, fmtUSD } from "@/components/campaign-card";
import { disasters } from "@/lib/disasters";
import { AlertTriangle, Search, ShieldCheck, Eye, Layers, HandCoins, MapPin, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ReliefLedger — Verified Disaster Relief, Phase by Phase" },
      { name: "description", content: "A transparent disaster relief ledger. Browse verified emergencies, donate to specific phases, and watch every disbursement publicly." },
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
  const featured = critical[0];
  const featuredPct = featured ? Math.round((featured.raised / featured.goal) * 100) : 0;
  const totalRaised = disasters.reduce((s, d) => s + d.raised, 0);
  const totalDonors = disasters.reduce((s, d) => s + d.donors, 0);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-indigo-500/30">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute top-1/2 -right-48 h-[500px] w-[500px] rounded-full bg-cyan-600/10 blur-[150px]" />

        <div className="relative mx-auto max-w-7xl px-6 pt-12 pb-24">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Hero content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
                </span>
                {critical.length} active critical emergencies
              </div>

              <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl">
                When disaster strikes,
                <span className="block bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  every second is accounted for.
                </span>
              </h1>

              <p className="max-w-lg text-lg leading-relaxed text-slate-400">
                ReliefLedger routes donations <span className="font-semibold text-white">only</span> to verified local governments and accredited NGOs — with a public ledger showing exactly how funds move.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="#disasters"
                  className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 active:scale-95"
                >
                  See active disasters
                </a>
                <Link
                  to="/start"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/50 px-8 py-4 text-lg font-bold text-slate-300 transition-all hover:border-slate-500 active:scale-95"
                >
                  Start a relief fund
                </Link>
              </div>

              <div className="grid max-w-md grid-cols-3 gap-3 pt-4">
                <Stat label="Raised" value={fmtUSD(totalRaised)} />
                <Stat label="Donors" value={totalDonors.toLocaleString()} />
                <Stat label="Responders" value="48" />
              </div>
            </div>

            {/* Urgent campaign card */}
            {featured && (
              <div className="relative">
                <div className="relative z-10 rounded-[40px] border border-white/10 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-xl">
                  <div className="mb-6 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400">
                      Urgent · Responding Now
                    </span>
                  </div>

                  <h3 className="mb-3 font-display text-3xl font-bold leading-tight">{featured.title}</h3>
                  <p className="mb-10 flex items-center gap-2 text-sm text-slate-400">
                    <MapPin className="h-4 w-4" />
                    {featured.location} · {featured.organizer}
                  </p>

                  <div className="mb-10 space-y-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="font-display text-3xl font-extrabold">{fmtUSD(featured.raised)}</div>
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Raised so far</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-200">Target {fmtUSD(featured.goal)}</div>
                        <div className="text-xs font-bold text-indigo-400">{featuredPct}% funded</div>
                      </div>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600 shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-[width] duration-700"
                        style={{ width: `${featuredPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="mb-10 grid grid-cols-3 gap-3">
                    <MiniStat label="Donors" value={featured.donors.toLocaleString()} />
                    <MiniStat label="Affected" value={featured.beneficiaries.toLocaleString()} />
                    <MiniStat label="Active" value={`${featured.startedDaysAgo}d`} />
                  </div>

                  <Link
                    to="/campaign/$id"
                    params={{ id: featured.id }}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-5 font-bold text-slate-900 shadow-xl shadow-orange-500/20 transition-all hover:bg-orange-600 active:scale-[0.98]"
                  >
                    Donate to this emergency
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Filters + grid */}
      <section id="disasters" className="mx-auto max-w-7xl px-6 pb-32">
        <div className="mb-12 flex flex-col gap-6 rounded-[24px] border border-white/5 bg-slate-900/50 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`rounded-xl px-6 py-2.5 text-sm font-bold transition-colors ${
                  type === t
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {t === "All" ? "All Disasters" : t}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search regions, organizers…"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-11 pr-4 text-sm text-foreground outline-none transition-all focus:ring-2 focus:ring-indigo-500 md:w-72"
            />
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {urgencies.map((u) => (
            <button
              key={u}
              onClick={() => setUrg(u)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                urg === u
                  ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
                  : "border-white/10 bg-transparent text-slate-500 hover:border-white/20 hover:text-slate-300"
              }`}
            >
              {u === "All" ? "All urgency" : u}
            </button>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => <CampaignCard key={d.id} d={d} />)}
        </div>
        {filtered.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-white/10 bg-slate-900/40 p-10 text-center text-slate-400">
            No relief funds match your filters.
          </div>
        )}
      </section>

      {/* How it works */}
      <section id="how" className="border-y border-white/5 bg-slate-950/60 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="font-display text-4xl font-extrabold tracking-tight">How ReliefLedger works</h2>
          <p className="mt-2 max-w-2xl text-slate-400">Simple by design — built for speed, dignity, and accountability.</p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
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
      <section id="safety" className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-[32px] border border-white/5 bg-slate-900/40 p-8 backdrop-blur sm:p-12">
          <div className="grid items-start gap-10 md:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--verified)]/10 px-3 py-1 text-xs font-semibold text-[color:var(--verified)]">
                <ShieldCheck className="h-3.5 w-3.5" /> Donor protection
              </div>
              <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight">
                Your donation is protected by design.
              </h2>
              <p className="mt-3 text-slate-400">
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
                <li key={t} className="flex gap-3 rounded-2xl border border-white/5 bg-slate-950/40 p-4">
                  <Layers className="mt-0.5 h-5 w-5 shrink-0 text-indigo-400" />
                  <div>
                    <div className="font-semibold">{t}</div>
                    <div className="text-sm text-slate-400">{b}</div>
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
    <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-3">
      <div className="text-lg font-bold sm:text-xl">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-slate-950/50 p-4 text-center">
      <div className="text-lg font-bold">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}

function Step({ icon, n, title, body }: { icon: React.ReactNode; n: number; title: string; body: string }) {
  return (
    <div className="relative rounded-[24px] border border-white/5 bg-slate-900/40 p-6">
      <div className="absolute -top-3 left-6 grid h-7 w-7 place-items-center rounded-full bg-indigo-600 text-xs font-bold text-white">{n}</div>
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-500/10 text-indigo-400">{icon}</div>
      <h3 className="mt-3 font-display text-lg font-bold">{title}</h3>
      <p className="mt-1 text-sm text-slate-400">{body}</p>
    </div>
  );
}
