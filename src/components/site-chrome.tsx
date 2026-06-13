import { Link } from "@tanstack/react-router";
import { ShieldCheck, HeartHandshake, LayoutDashboard, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function SiteHeader() {
  const { user, role } = useAuth();
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-hero-gradient text-primary-foreground">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-base font-bold tracking-tight">ReliefLedger</div>
            <div className="hidden text-[11px] uppercase tracking-wider text-muted-foreground sm:block">
              Transparent disaster relief
            </div>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          <Link to="/" className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-secondary hover:text-foreground">
            Active Disasters
          </Link>
          <a href="/#how" className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-secondary">
            How It Works
          </a>
          <a href="/#safety" className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-secondary">
            Trust & Safety
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1.5 rounded-full border border-verified/30 bg-verified/10 px-2.5 py-1 text-xs font-medium text-[color:var(--verified)] sm:flex">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified Partners Only
          </div>
          {user ? (
            <Link
              to={role === "admin" ? "/admin" : "/dashboard"}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-trust transition hover:bg-primary/90"
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/auth"
                className="hidden items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-secondary sm:inline-flex"
              >
                <LogIn className="h-4 w-4" /> Sign in
              </Link>
              <Link
                to="/start"
                className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-trust transition hover:bg-primary/90"
              >
                Start a Relief Fund
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-hero-gradient text-primary-foreground">
              <HeartHandshake className="h-4 w-4" />
            </div>
            <div className="font-bold">ReliefLedger</div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            A non-profit platform connecting verified responders with urgent community needs.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold">Platform</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Active disasters</li>
            <li>How verification works</li>
            <li>Public ledger</li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Responders</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Start a fund</li>
            <li>Verification checklist</li>
            <li>Field reporting tools</li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Trust</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Donor protection</li>
            <li>Audit & accountability</li>
            <li>Contact safety team</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} ReliefLedger — Donations routed only to verified responders.
      </div>
    </footer>
  );
}
