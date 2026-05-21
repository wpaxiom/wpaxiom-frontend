"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

type FormState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; message: string };

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [state, setState] = useState<FormState>({ kind: "idle" });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email || !password) {
      setState({ kind: "error", message: "Email and password are required." });
      return;
    }
    setState({ kind: "submitting" });

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!result || result.error) {
      setState({
        kind: "error",
        message:
          "Sign-in failed. Check your email and password — or reset via the link below.",
      });
      return;
    }

    window.location.href = from;
  }

  const submitting = state.kind === "submitting";

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="email" className="block text-xs font-mono uppercase tracking-[0.16em] text-muted mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-4 py-2.5 rounded-lg bg-base border border-line text-ink placeholder:text-subtle focus:outline-none focus:border-coral transition"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="password" className="text-xs font-mono uppercase tracking-[0.16em] text-muted">
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-xs text-muted hover:text-ink underline-offset-4 hover:underline"
          >
            Forgot?
          </Link>
        </div>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 pr-11 rounded-lg bg-base border border-line text-ink placeholder:text-subtle focus:outline-none focus:border-coral transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-muted hover:text-ink focus-coral rounded"
          >
            {showPassword ? <EyeOff size={16} strokeWidth={1.7} /> : <Eye size={16} strokeWidth={1.7} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-coral hover:bg-coral-hover text-white font-medium transition focus-coral disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <Loader2 size={16} strokeWidth={2} className="animate-spin" />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </button>

      {state.kind === "error" && (
        <div
          role="alert"
          className="rounded-lg border border-err/40 bg-err/[0.06] px-4 py-3 text-sm text-err"
        >
          {state.message}
        </div>
      )}
    </form>
  );
}
