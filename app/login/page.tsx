import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in — wpaxiom",
  description: "Sign in to your wpaxiom account to manage licenses, subscriptions, and downloads.",
};

export default function LoginPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="absolute inset-0 hero-mesh" />
      <div className="absolute inset-0 hero-grid" />
      <div className="relative flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[420px]">
          <Link href="/" className="flex items-center gap-2.5 mb-10 focus-coral rounded">
            <Image src="/logo-icon.svg" alt="" width={32} height={32} className="h-8 w-auto" priority />
            <span className="text-[20px] font-medium tracking-tight text-ink">wpaxiom</span>
          </Link>

          <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">// Sign in</div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
            Welcome back.
          </h1>
          <p className="mt-3 text-muted leading-relaxed">
            Use the email you bought with. Forgot your password? You can reset it below.
          </p>

          <div className="mt-8 rounded-2xl border border-line bg-surface p-7">
            <Suspense fallback={<LoginFormSkeleton />}>
              <LoginForm />
            </Suspense>
          </div>

          <div className="mt-6 rounded-xl border border-line bg-base/40 px-5 py-4 text-sm text-muted" id="signup-hint">
            <span className="font-medium text-ink">No account yet?</span> wpaxiom accounts are created
            automatically when you purchase a Pro license.{" "}
            <Link
              href="/plugins/axiom-blocks/pricing"
              className="text-coral hover:text-coral-hover underline-offset-4 hover:underline inline-flex items-center gap-1"
            >
              See plans <ArrowRight size={12} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginFormSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div>
        <div className="h-3 w-12 bg-elevated rounded mb-2" />
        <div className="h-11 bg-base border border-line rounded-lg" />
      </div>
      <div>
        <div className="h-3 w-20 bg-elevated rounded mb-2" />
        <div className="h-11 bg-base border border-line rounded-lg" />
      </div>
      <div className="h-12 bg-elevated rounded-lg" />
    </div>
  );
}
