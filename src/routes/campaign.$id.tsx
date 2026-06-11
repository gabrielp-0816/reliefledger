import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { ProgressBar } from "@/components/progress-bar";
import { fmtUSD } from "@/components/campaign-card";
import { DonateModal } from "@/components/donate-modal";
import { disasterById } from "@/lib/disasters";
import {
  ShieldCheck, MapPin, Users, Clock, CheckCircle2, Circle, Loader2,
  Lock, FileText, AlertTriangle, ArrowLeft,
} from "lucide-react";

export const Route = createFileRoute("/campaign/$id")({
  loader: ({ params }) => {
    const d = disasterById(params.id);
    if (!d) throw notFound();
    return { d };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.d.title} — ReliefLedger` },
          { name: "description", content: loaderData.d.story.slice(0, 155) },
          { property: "og:title", content: loaderData.d.title },
          { property: "og:description", content: loaderData.d.story.slice(0, 155) },
          { property: "og:image", content: loaderData.d.image },
        ]
      : [],
  }),
  component: CampaignPage,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <h1 className="text-2xl font-bold">Fund not found</h1>
        <Link to="/" className="mt-3 inline-block text-primary underline">Back to active disasters</Link>
      </div>
    </div>
  ),
});

type Tab = "story" | "updates" | "donors" | "reports";

function CampaignPage() {
  const { d } = Route.useLoaderData();
  const [tab, setTab] = useState<Tab>("story");
  const [open, setOpen] = useState(false);
  const pct = Math.round((d.raised / d.goal) * 100);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <img src={d.image} alt={d.title} className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> All active disasters
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="rounded-full bg-destructive px-2.5 py-1 text-destructive-foreground">{d.urgency}</span>
            <span className="rounded-full bg-secondary px-2.5 py-1">{d.type}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-verified/10 px-2.5 py-1 text-[color:var(--verified)]">
              <ShieldCheck className="h-3.5 w-3.5" /> Verified {d.organizerType}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">{d.title}</h1>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{d.location}</span>
            <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" />{d.beneficiaries.toLocaleString()} people affected</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" />Started {d.startedDaysAgo} days ago</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" />Organized by {d.organizer}</span>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px]">
        {/* Main content */}
        <div className="min-w-0">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1 rounded-xl border border-border bg-card p-1">
            {([
              ["story", "Story"],
              ["updates", `Updates (${d.updates.length})`],
              ["donors", `Donors (${d.donors.toLocaleString()})`],
              ["reports", "Accountability"],
            ] as [Tab, string][]).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  tab === k ? "bg-primary text-primary-foreground shadow-trust" : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
            {tab === "story" && (
              <div className="space-y-6">
                <p className="text-lg leading-relaxed">{d.story}</p>
                <div>
                  <h3 className="text-lg font-bold">Fund allocation plan</h3>
                  <p className="text-sm text-muted-foreground">Every dollar is committed to a category before it can be released.</p>
                  <div className="mt-4 space-y-3">
                    {d.allocation.map((a) => (
                      <div key={a.label}>
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{a.label}</span>
                          <span className="text-muted-foreground">{a.pct}%</span>
                        </div>
                        <ProgressBar value={a.pct} tone="relief" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === "updates" && (
              <ol className="space-y-5">
                {d.updates.map((u, i) => (
                  <li key={i} className="border-l-2 border-primary/30 pl-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-primary">{u.date}</div>
                    <div className="mt-0.5 font-bold">{u.title}</div>
                    <p className="text-sm text-muted-foreground">{u.body}</p>
                  </li>
                ))}
              </ol>
            )}

            {tab === "donors" && (
              <div>
                <p className="text-sm text-muted-foreground">{d.donors.toLocaleString()} donors have contributed to this fund.</p>
                <ul className="mt-4 divide-y divide-border">
                  {d.topDonors.map((dn, i) => (
                    <li key={i} className="flex items-start justify-between gap-4 py-3">
                      <div className="min-w-0">
                        <div className="font-semibold">{dn.anonymous ? "Anonymous donor" : dn.name}</div>
                        {dn.note && <div className="mt-0.5 text-sm italic text-muted-foreground">"{dn.note}"</div>}
                      </div>
                      <div className="shrink-0 text-right font-bold text-primary">{fmtUSD(dn.amount)}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tab === "reports" && (
              <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-xl border border-verified/30 bg-verified/5 p-4 text-sm">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--verified)]" />
                  <p>This fund is audited by ReliefLedger's independent partner. Reports are filed every 14 days.</p>
                </div>
                <ul className="space-y-2">
                  {["Initial verification report (PDF)", "Phase 1 disbursement receipts (PDF)", "Field beneficiary survey — Week 1 (PDF)"].map((f) => (
                    <li key={f} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3 text-sm">
                      <span className="inline-flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground" />{f}</span>
                      <button className="text-xs font-semibold text-primary hover:underline">Download</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Transparency timeline */}
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black tracking-tight">Transparency Timeline</h3>
              <span className="rounded-full bg-relief/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[color:var(--relief)]">Live</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Funds are released phase by phase, only when milestones are verified.</p>
            <ol className="mt-6 space-y-5">
              {d.timeline.map((p, i) => (
                <li key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`grid h-8 w-8 place-items-center rounded-full ${
                      p.status === "done" ? "bg-[color:var(--relief)] text-[color:var(--relief-foreground)]" :
                      p.status === "active" ? "bg-primary text-primary-foreground" :
                      "bg-secondary text-muted-foreground"
                    }`}>
                      {p.status === "done" ? <CheckCircle2 className="h-4 w-4" /> :
                       p.status === "active" ? <Loader2 className="h-4 w-4 animate-spin" /> :
                       <Circle className="h-4 w-4" />}
                    </div>
                    {i < d.timeline.length - 1 && <div className="mt-1 h-full w-px flex-1 bg-border" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div className="font-bold">{p.phase}</div>
                      <div className="text-sm font-semibold text-primary">{p.spend ? fmtUSD(p.spend) + " spent" : "—"}</div>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{p.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="p-6">
              <div className="text-3xl font-black">{fmtUSD(d.raised)}</div>
              <div className="text-sm text-muted-foreground">raised of {fmtUSD(d.goal)} goal</div>
              <div className="mt-4">
                <ProgressBar value={pct} tone={d.urgency === "Critical" ? "alert" : "trust"} showLabel />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-secondary/50 p-3">
                  <div className="text-lg font-bold">{d.donors.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">donors</div>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3">
                  <div className="text-lg font-bold">{d.startedDaysAgo}d</div>
                  <div className="text-xs text-muted-foreground">since launch</div>
                </div>
              </div>
              <button
                onClick={() => setOpen(true)}
                className="mt-5 w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-trust transition hover:bg-primary/90"
              >
                Donate Now
              </button>
              <button className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-secondary">
                Share this fund
              </button>
            </div>
            <div className="border-t border-border bg-secondary/40 p-5 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-[color:var(--verified)]">
                <ShieldCheck className="h-4 w-4" /> Verified by ReliefLedger
              </div>
              <p className="mt-1.5 text-muted-foreground">
                Credentials on file: government registration, prior relief operations, in-country presence.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-border bg-card p-5 text-sm">
            <div className="flex items-center gap-1.5 font-bold"><Lock className="h-4 w-4 text-primary" /> Safety Guidelines</div>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--relief)]" />Funds held in escrow until phase milestones are verified.</li>
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--relief)]" />Independent audit partner reviews every disbursement.</li>
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--relief)]" />Refunds issued automatically if a fund is paused for misuse.</li>
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--relief)]" />Donor data never sold or shared.</li>
            </ul>
          </div>

          <div className="mt-5 rounded-2xl border border-alert/40 bg-alert-soft p-5 text-sm">
            <div className="flex items-center gap-1.5 font-bold text-alert-strong">
              <AlertTriangle className="h-4 w-4" /> Report a concern
            </div>
            <p className="mt-1 text-foreground/70">If something seems off, contact our safety team — funds can be frozen within hours.</p>
          </div>
        </aside>
      </div>

      <DonateModal d={d} open={open} onOpenChange={setOpen} />
      <SiteFooter />
    </div>
  );
}
