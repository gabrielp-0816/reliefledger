import { createFileRoute, Link } from "@tanstack/react-router";
import { HeartHandshake, ShieldCheck, Users } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — ReliefLedger" },
      { name: "description", content: "Sign in or create an account to donate or manage relief campaigns on ReliefLedger." },
    ],
  }),
  component: AuthChooser,
});

function AuthChooser() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-16">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[120px]" />

        <Link to="/" className="mb-10 flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-hero-gradient text-primary-foreground">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">ReliefLedger</span>
        </Link>

        <h1 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          How will you be using ReliefLedger?
        </h1>
        <p className="mt-3 max-w-xl text-center text-muted-foreground">
          Choose your account type. You can always switch later.
        </p>

        <div className="mt-10 grid w-full gap-5 sm:grid-cols-2">
          <Link
            to="/auth/donor"
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition hover:-translate-y-0.5 hover:border-indigo-500/50 hover:shadow-trust"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <Users className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-xl font-semibold">I'm a Donor</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Support verified relief campaigns and track your impact across disasters.
            </p>
            <span className="mt-5 inline-flex text-sm font-semibold text-indigo-400 group-hover:text-indigo-300">
              Continue as donor →
            </span>
          </Link>

          <Link
            to="/auth/admin"
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition hover:-translate-y-0.5 hover:border-orange-500/50 hover:shadow-trust"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-orange-500/10 text-orange-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-xl font-semibold">I'm an Admin</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Verify partners, publish campaigns, and oversee disbursements on the ledger.
            </p>
            <span className="mt-5 inline-flex text-sm font-semibold text-orange-400 group-hover:text-orange-300">
              Continue as admin →
            </span>
          </Link>
        </div>

        <Link to="/" className="mt-10 text-sm text-muted-foreground hover:text-foreground">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
