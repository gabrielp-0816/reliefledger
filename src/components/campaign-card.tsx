import { Link } from "@tanstack/react-router";
import { ShieldCheck, MapPin } from "lucide-react";
import type { Disaster } from "@/lib/disasters";

export const fmtUSD = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const fmtCompact = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : `$${n}`;

const urgencyStyles: Record<Disaster["urgency"], string> = {
  Critical: "bg-rose-500/15 border-rose-500/40 text-rose-300",
  High: "bg-amber-500/15 border-amber-500/40 text-amber-300",
  Ongoing: "bg-cyan-500/15 border-cyan-500/40 text-cyan-300",
};

export function CampaignCard({ d }: { d: Disaster }) {
  const pct = Math.round((d.raised / d.goal) * 100);
  return (
    <Link
      to="/campaign/$id"
      params={{ id: d.id }}
      className="group flex flex-col overflow-hidden rounded-[28px] border border-white/5 bg-slate-900/40 transition-all hover:-translate-y-0.5 hover:border-indigo-500/50"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={d.image}
          alt={d.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
        <span className={`absolute left-4 top-4 rounded-lg border px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md ${urgencyStyles[d.urgency]}`}>
          {d.urgency}
        </span>
        <span className="absolute right-4 top-4 rounded-lg border border-white/10 bg-slate-950/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-200 backdrop-blur-md">
          {d.type}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-6">
        <div>
          <h4 className="font-display text-xl font-bold leading-tight transition-colors group-hover:text-indigo-300">
            {d.title}
          </h4>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{d.location}</span>
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[color:var(--verified)]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified · {d.organizer}
          </div>
        </div>

        <p className="line-clamp-2 text-sm text-slate-400">{d.story}</p>

        <div className="mt-auto space-y-3">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-500">{pct}% funded</span>
            <span className="text-slate-300">{fmtCompact(d.raised)} / {fmtCompact(d.goal)}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-indigo-500 transition-[width] duration-700"
              style={{ width: `${Math.min(100, pct)}%` }}
            />
          </div>
        </div>

        <div className="w-full rounded-xl bg-slate-800/80 py-3 text-center text-sm font-bold text-white transition-all group-hover:bg-indigo-600">
          Support Recovery →
        </div>
      </div>
    </Link>
  );
}
