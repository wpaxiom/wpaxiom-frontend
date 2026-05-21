import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset password — wpaxiom",
  description: "Set a new password for your wpaxiom account.",
};

export default function ResetPasswordPage() {
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

          <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">// Reset password</div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
            Set a new password.
          </h1>
          <p className="mt-3 text-muted leading-relaxed">
            Choose a strong password — at least 8 characters. You&apos;ll use this to sign in next time.
          </p>

          <div className="mt-8 rounded-2xl border border-line bg-surface p-7">
            <Suspense fallback={<FormSkeleton />}>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div>
        <div className="h-3 w-20 bg-elevated rounded mb-2" />
        <div className="h-11 bg-base border border-line rounded-lg" />
      </div>
      <div>
        <div className="h-3 w-28 bg-elevated rounded mb-2" />
        <div className="h-11 bg-base border border-line rounded-lg" />
      </div>
      <div className="h-12 bg-elevated rounded-lg" />
    </div>
  );
}
