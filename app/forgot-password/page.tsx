import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset password — wpaxiom",
  description: "Send yourself a password reset link by email.",
};

export default function ForgotPasswordPage() {
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

          <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">// Reset</div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
            Forgot your password?
          </h1>
          <p className="mt-3 text-muted leading-relaxed">
            Enter the email you bought with. We&apos;ll send a reset link that&apos;s valid for 30 minutes.
          </p>

          <div className="mt-8 rounded-2xl border border-line bg-surface p-7">
            <ForgotPasswordForm />
          </div>

          <Link
            href="/login"
            className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition"
          >
            <ArrowLeft size={14} strokeWidth={2} />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
