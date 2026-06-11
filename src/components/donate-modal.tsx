import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, ShieldCheck, Lock } from "lucide-react";
import type { Disaster } from "@/lib/disasters";
import { fmtUSD } from "./campaign-card";

const presets = [25, 50, 100, 250, 500];

export function DonateModal({
  d,
  open,
  onOpenChange,
}: {
  d: Disaster;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [amount, setAmount] = useState<number>(50);
  const [custom, setCustom] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");

  const final = custom ? Number(custom) || 0 : amount;

  const reset = () => {
    setStep(1); setAmount(50); setCustom(""); setAnonymous(false);
    setName(""); setEmail(""); setNote("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => { onOpenChange(o); if (!o) setTimeout(reset, 200); }}
    >
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        <div className="bg-hero-gradient px-6 py-4 text-primary-foreground">
          <DialogHeader>
            <DialogTitle className="text-primary-foreground">Donate to {d.title}</DialogTitle>
            <DialogDescription className="text-primary-foreground/80">
              {d.location} · Organized by {d.organizer}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-3 flex items-center gap-3 text-xs">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <span className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold ${step >= s ? "bg-white text-primary" : "bg-white/20"}`}>
                  {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
                </span>
                <span className="hidden sm:inline">{["Amount", "Your info", "Confirm"][s - 1]}</span>
                {s < 3 && <span className="mx-1 h-px w-6 bg-white/40" />}
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-5">
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {presets.map((p) => (
                  <button
                    key={p}
                    onClick={() => { setAmount(p); setCustom(""); }}
                    className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                      !custom && amount === p
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:bg-secondary"
                    }`}
                  >
                    ${p}
                  </button>
                ))}
                <div className="col-span-3">
                  <Label htmlFor="custom" className="text-xs">Or custom amount (USD)</Label>
                  <Input
                    id="custom"
                    inputMode="numeric"
                    placeholder="e.g. 75"
                    value={custom}
                    onChange={(e) => setCustom(e.target.value.replace(/[^0-9]/g, ""))}
                  />
                </div>
              </div>
              <Button
                className="w-full"
                disabled={!final || final < 1}
                onClick={() => setStep(2)}
              >
                Continue · {fmtUSD(final || 0)}
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/40 p-3">
                <Checkbox id="anon" checked={anonymous} onCheckedChange={(v) => setAnonymous(!!v)} />
                <Label htmlFor="anon" className="cursor-pointer text-sm">Donate anonymously</Label>
              </div>
              {!anonymous && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="n" className="text-xs">Name</Label>
                    <Input id="n" value={name} onChange={(e) => setName(e.target.value.slice(0, 80))} placeholder="Your name" />
                  </div>
                  <div>
                    <Label htmlFor="e" className="text-xs">Email (for receipt)</Label>
                    <Input id="e" type="email" value={email} onChange={(e) => setEmail(e.target.value.slice(0, 120))} placeholder="you@email.com" />
                  </div>
                </div>
              )}
              <div>
                <Label htmlFor="note" className="text-xs">Words of encouragement (optional)</Label>
                <Textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value.slice(0, 240))}
                  placeholder="Share a message with the affected community…"
                  rows={3}
                />
                <div className="mt-1 text-right text-[11px] text-muted-foreground">{note.length}/240</div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                <Button className="flex-1" onClick={() => setStep(3)}>Review</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-secondary/40 p-4 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-bold">{fmtUSD(final)}</span></div>
                <div className="mt-1 flex justify-between"><span className="text-muted-foreground">Donor</span><span>{anonymous ? "Anonymous" : name || "—"}</span></div>
                <div className="mt-1 flex justify-between"><span className="text-muted-foreground">Fund</span><span className="text-right">{d.title}</span></div>
                {note && <div className="mt-2 rounded-md bg-background p-2 text-xs italic text-muted-foreground">"{note}"</div>}
              </div>
              <div className="flex items-start gap-2 rounded-lg border border-verified/30 bg-verified/5 p-3 text-xs">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--verified)]" />
                <p>
                  Funds are held in escrow and released to <strong>{d.organizer}</strong> in tracked phases. Every disbursement is published on the public ledger.
                </p>
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  // Mock submit
                  alert("Thank you! (Mock donation — no payment processed)");
                  onOpenChange(false);
                  setTimeout(reset, 200);
                }}
              >
                <Lock className="mr-2 h-4 w-4" /> Confirm secure donation
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setStep(2)}>Back</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
