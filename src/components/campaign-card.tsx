import { Link } from "@tanstack/react-router";
import { ShieldCheck, MapPin, Users, Flame } from "lucide-react";
import type { Disaster } from "@/lib/disasters";
import { ProgressBar } from "./progress-bar";

export const fmtUSD = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const urgencyStyles: Record<Disaster["urgency"], string> = {
  Critical: "bg-destructive text-destructive-foreground",
  High: "bg-alert-soft text-alert-strong",
  Ongoing: "bg-secondary text-secondary-foreground",
};

export function CampaignCard({ d }: { d: Disaster }) {
  const pct = Math.round((d.raised / d.goal) * 100);
  return (
    <Link
      to="/campaign/$id"
      params={{ id: d.id }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-trust"
    >
      <div className="relative h-44 overflow-hidden bg-muted">
        <img
          src={d.image}
          alt={d.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${urgencyStyles[d.urgency]}`}>
            {d.urgency === "Critical" && <Flame className="h-3 w-3" />}
            {d.urgency}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-background/85 px-2.5 py-1 text-xs font-medium backdrop-blur">
            {d.type}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="line-clamp-2 text-lg font-bold leading-tight">{d.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{d.location}</span>
            <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" />{d.beneficiaries.toLocaleString()} affected</span>
          </div>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-[color:var(--verified)]">
          <ShieldCheck className="h-3.5 w-3.5" />
          Verified · {d.organizer}
        </div>

        <ProgressBar value={pct} tone={d.urgency === "Critical" ? "alert" : "trust"} />

        <div className="flex items-end justify-between">
          <div>
            <div className="text-lg font-bold">{fmtUSD(d.raised)}</div>
            <div className="text-xs text-muted-foreground">raised of {fmtUSD(d.goal)} · {d.donors.toLocaleString()} donors</div>
          </div>
          <span className="inline-flex items-center justify-center rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-trust transition group-hover:bg-primary/90">
            Donate Now
          </span>
        </div>
      </div>
    </Link>
  );
}
