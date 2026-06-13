import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2, Upload, ShieldCheck, Building2, Target, ListChecks, FileCheck2, ArrowLeft,
} from "lucide-react";

export const Route = createFileRoute("/start")({
  head: () => ({
    meta: [
      { title: "Start a Relief Fund — ReliefLedger" },
      { name: "description", content: "Verified responders: launch a disaster relief fund in four steps." },
    ],
  }),
  component: StartPage,
});

type Form = {
  org: string;
  orgType: string;
  disasterType: string;
  location: string;
  goal: string;
  story: string;
  permitName: string;
  allocations: { label: string; pct: string }[];
};

const initial: Form = {
  org: "",
  orgType: "Local Government",
  disasterType: "Flood",
  location: "",
  goal: "",
  story: "",
  permitName: "",
  allocations: [
    { label: "Food & Water", pct: "30" },
    { label: "Medical & Shelter", pct: "30" },
    { label: "Rebuilding", pct: "30" },
    { label: "Logistics & Audit", pct: "10" },
  ],
};

const steps = [
  { id: 1, title: "Organization", icon: Building2 },
  { id: 2, title: "Disaster details", icon: Target },
  { id: 3, title: "Allocation", icon: ListChecks },
  { id: 4, title: "Verification", icon: FileCheck2 },
];

function StartPage() {
  const [step, setStep] = useState(1);
  const [f, setF] = useState<Form>(initial);
  const [submitted, setSubmitted] = useState(false);

  const upd = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));
  const allocTotal = f.allocations.reduce((s, a) => s + (Number(a.pct) || 0), 0);

  const canNext =
    (step === 1 && f.org.trim().length > 1) ||
    (step === 2 && f.location.trim() && Number(f.goal) > 0 && f.story.trim().length > 30) ||
    (step === 3 && allocTotal === 100) ||
    (step === 4 && f.permitName.trim().length > 0);

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[color:var(--relief)]/15 text-[color:var(--relief)]">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-3xl font-black tracking-tight">Submitted for verification</h1>
          <p className="mt-3 text-muted-foreground">
            Our trust & safety team typically reviews new funds within 6 hours during active emergencies. You'll receive an email when your fund is live.
          </p>
          <Link to="/" className="mt-8 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-trust hover:bg-primary/90">
            Back to active disasters
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Cancel
        </Link>
        <div className="mt-4 flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-3xl font-black tracking-tight">Start a Relief Fund</h1>
            <p className="text-muted-foreground">For verified local governments and accredited NGOs.</p>
          </div>
        </div>

        {/* Stepper */}
        <ol className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {steps.map((s) => {
            const Icon = s.icon;
            const done = step > s.id;
            const active = step === s.id;
            return (
              <li
                key={s.id}
                className={`flex items-center gap-3 rounded-xl border p-3 ${
                  active ? "border-primary bg-primary/5"
                  : done ? "border-[color:var(--relief)]/40 bg-[color:var(--relief)]/5"
                  : "border-border bg-card"
                }`}
              >
                <span className={`grid h-8 w-8 place-items-center rounded-full ${
                  active ? "bg-primary text-primary-foreground"
                  : done ? "bg-[color:var(--relief)] text-white"
                  : "bg-secondary text-muted-foreground"
                }`}>
                  {done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </span>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Step {s.id}</div>
                  <div className="truncate text-sm font-semibold">{s.title}</div>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="org">Organization name</Label>
                <Input id="org" value={f.org} onChange={(e) => upd("org", e.target.value.slice(0, 120))} placeholder="e.g. Cagayan Provincial Disaster Office" />
              </div>
              <div>
                <Label>Organization type</Label>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  {["Local Government", "Verified NGO", "Community Coalition"].map((o) => (
                    <button
                      key={o}
                      type="button"
                      onClick={() => upd("orgType", o)}
                      className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                        f.orgType === o ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-secondary"
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Disaster type</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["Typhoon", "Flood", "Earthquake", "Wildfire", "Landslide"].map((o) => (
                      <button
                        key={o}
                        type="button"
                        onClick={() => upd("disasterType", o)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                          f.disasterType === o ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary"
                        }`}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="loc">Target location</Label>
                  <Input id="loc" value={f.location} onChange={(e) => upd("location", e.target.value.slice(0, 120))} placeholder="City, Region, Country" />
                </div>
              </div>
              <div>
                <Label htmlFor="goal">Goal amount (USD)</Label>
                <Input id="goal" inputMode="numeric" value={f.goal} onChange={(e) => upd("goal", e.target.value.replace(/[^0-9]/g, "").slice(0, 9))} placeholder="100000" />
              </div>
              <div>
                <Label htmlFor="story">Brief story (min. 30 characters)</Label>
                <Textarea id="story" rows={5} value={f.story} onChange={(e) => upd("story", e.target.value.slice(0, 1200))} placeholder="What happened, who is affected, what's the immediate need…" />
                <div className="mt-1 text-right text-[11px] text-muted-foreground">{f.story.length}/1200</div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Break down how funds will be allocated. Total must equal 100%.</p>
              {f.allocations.map((a, i) => (
                <div key={i} className="grid grid-cols-[1fr_100px_auto] items-end gap-3">
                  <div>
                    <Label className="text-xs">Category</Label>
                    <Input
                      value={a.label}
                      onChange={(e) => {
                        const copy = [...f.allocations]; copy[i] = { ...a, label: e.target.value.slice(0, 60) };
                        upd("allocations", copy);
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">%</Label>
                    <Input
                      inputMode="numeric"
                      value={a.pct}
                      onChange={(e) => {
                        const copy = [...f.allocations]; copy[i] = { ...a, pct: e.target.value.replace(/[^0-9]/g, "").slice(0, 3) };
                        upd("allocations", copy);
                      }}
                    />
                  </div>
                  <Button
                    type="button" variant="ghost" size="sm"
                    onClick={() => upd("allocations", f.allocations.filter((_, idx) => idx !== i))}
                    disabled={f.allocations.length <= 1}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <Button
                  type="button" variant="outline" size="sm"
                  onClick={() => upd("allocations", [...f.allocations, { label: "", pct: "0" }])}
                >
                  + Add category
                </Button>
                <div className={`text-sm font-bold ${allocTotal === 100 ? "text-[color:var(--relief)]" : "text-destructive"}`}>
                  Total: {allocTotal}%
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-start gap-2 rounded-xl border border-verified/30 bg-verified/5 p-4 text-sm">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--verified)]" />
                <p>Upload a government-issued credential, NGO accreditation, or operating permit. Our team reviews every submission before going live.</p>
              </div>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-secondary/30 p-8 text-center transition hover:bg-secondary/60">
                <Upload className="h-7 w-7 text-muted-foreground" />
                <div className="text-sm font-semibold">{f.permitName || "Click to upload credential (PDF or image)"}</div>
                <div className="text-xs text-muted-foreground">Max 10 MB · stored encrypted</div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,image/*"
                  onChange={(e) => upd("permitName", e.target.files?.[0]?.name ?? "")}
                />
              </label>
              <div className="rounded-xl border border-border bg-secondary/40 p-4 text-sm">
                <div className="font-bold">Summary</div>
                <ul className="mt-2 grid gap-1 text-muted-foreground sm:grid-cols-2">
                  <li><span className="text-foreground">Org:</span> {f.org || "—"}</li>
                  <li><span className="text-foreground">Type:</span> {f.orgType}</li>
                  <li><span className="text-foreground">Disaster:</span> {f.disasterType}</li>
                  <li><span className="text-foreground">Location:</span> {f.location || "—"}</li>
                  <li><span className="text-foreground">Goal:</span> ${f.goal || "0"}</li>
                  <li><span className="text-foreground">Allocations:</span> {f.allocations.length} categories</li>
                </ul>
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between gap-3">
            <Button variant="outline" disabled={step === 1} onClick={() => setStep(step - 1)}>Back</Button>
            {step < 4 ? (
              <Button disabled={!canNext} onClick={() => setStep(step + 1)}>Continue</Button>
            ) : (
              <Button disabled={!canNext} onClick={() => setSubmitted(true)}>
                <ShieldCheck className="mr-2 h-4 w-4" /> Submit for verification
              </Button>
            )}
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
