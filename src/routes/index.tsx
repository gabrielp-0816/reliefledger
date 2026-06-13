import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { ShieldCheck, Eye, Layers, HandCoins, HeartHandshake, Globe, Lock, Receipt } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ReliefLedger — Verified Disaster Relief, Phase by Phase" },
      { name: "description", content: "A transparent disaster relief ledger. Verified responders publish funds; donors give to tracked phases and watch every disbursement publicly." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-indigo-500/30">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute top-1/2 -right-48 h-[500px] w-[500px] rounded-full bg-cyan-600/10 blur-[150px]" />

        <div className="relative mx-auto max-w-7xl px-6 pt-12 pb-24">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-400">
                <HeartHandshake className="h-4 w-4" />
                Transparent disaster relief
              </div>

              <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl">
                Donations with
                <span className="block bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  nothing to hide.
                </span>
              </h1>

              <p className="max-w-lg text-lg leading-relaxed text-slate-400">
                ReliefLedger is a nonprofit platform that connects verified disaster responders with donors who want real accountability. Every fund is published by a credentialed organization. Every donation is tracked by phase. Every disbursement is public.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 active:scale-95"
                >
                  Become a donor
                </Link>
                <a
                  href="#how"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/50 px-8 py-4 text-lg font-bold text-slate-300 transition-all hover:border-slate-500 active:scale-95"
                >
                  How it works
                </a>
              </div>

              <div className="grid max-w-md grid-cols-3 gap-3 pt-4">
                <Stat label="Verified responders" value="Governments & NGOs" />
                <Stat label="Donation tracking" value="Phase by phase" />
                <Stat label="Ledger" value="Fully public" />
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 rounded-[40px] border border-white/10 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-xl">
                <div className="mb-6 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-indigo-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                    For donors & responders
                  </span>
                </div>

                <h3 className="mb-3 font-display text-2xl font-bold leading-tight">What ReliefLedger does</h3>
                <p className="mb-6 text-sm text-slate-400">
                  We bridge the trust gap between communities in crisis and the people who want to help.
                </p>

                <ul className="space-y-3">
                  {[
                    ["Verified-only funds", "Only local governments and accredited NGOs can publish a relief fund."],
                    ["Phase-based giving", "Donors contribute to specific milestones — food, shelter, medical, rebuild — not vague promises."],
                    ["Public disbursements", "Every withdrawal is published with receipts, photos, and beneficiary counts."],
                    ["Donor protection", "If a fund is paused, undistributed money is returned automatically."],
                  ].map(([t, b]) => (
                    <li key={t} className="flex gap-3 rounded-2xl border border-white/5 bg-slate-950/40 p-4">
                      <Lock className="mt-0.5 h-5 w-5 shrink-0 text-indigo-400" />
                      <div>
                        <div className="font-semibold text-sm">{t}</div>
                        <div className="text-xs text-slate-400">{b}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
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

      {/* For responders */}
      <section id="responders" className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-[32px] border border-white/5 bg-slate-900/40 p-8 backdrop-blur sm:p-12">
          <div className="grid items-start gap-10 md:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--verified)]/10 px-3 py-1 text-xs font-semibold text-[color:var(--verified)]">
                <ShieldCheck className="h-3.5 w-3.5" /> For verified responders
              </div>
              <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight">
                Are you a local government or accredited NGO?
              </h2>
              <p className="mt-3 text-slate-400">
                ReliefLedger is admin-managed. If your organization is verified, an admin can publish a relief fund on your behalf. Every fund goes through credential checks before going live.
              </p>
            </div>
            <ul className="space-y-4">
              {[
                ["Submit credentials", "Provide your government ID, NGO accreditation, or operating permit for review."],
                ["Define phases", "Break your fund into clear milestones — food, medical, shelter, rebuild — with transparent allocation percentages."],
                ["Report publicly", "Upload receipts and field photos for every disbursement so donors can see impact in real time."],
                ["Build trust", "Public accountability means repeat donors and stronger community support."],
              ].map(([t, b]) => (
                <li key={t} className="flex gap-3 rounded-2xl border border-white/5 bg-slate-950/40 p-4">
                  <Receipt className="mt-0.5 h-5 w-5 shrink-0 text-indigo-400" />
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
      <div className="text-sm font-bold sm:text-base">{value}</div>
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
