"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

type FormState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; message: string }
  | { kind: "sent"; email: string };

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>({ kind: "idle" });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setState({ kind: "error", message: "Email is required." });
      return;
    }
    setState({ kind: "submitting" });
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setState({
          kind: "error",
          message: data.error ?? "Something went wrong. Try again in a moment.",
        });
        return;
      }
      setState({ kind: "sent", email: trimmed });
    } catch {
      setState({ kind: "error", message: "Network error. Try again." });
    }
  }

  if (state.kind === "sent") {
    return (
      <div className="text-sm text-ink/90 leading-relaxed">
        <div className="flex items-center gap-2 text-ok mb-3">
          <Check size={16} strokeWidth={2.4} />
          <span className="font-medium text-ink">Check your inbox.</span>
        </div>
        <p className="text-muted">
          If an account exists for <span className="font-mono text-ink">{state.email}</span>, a reset link
          is on its way. The link expires in 24 hours.
        </p>
      </div>
    );
  }

  const submitting = state.kind === "submitting";

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div>
        <label
          htmlFor="email"
          className="block text-xs font-mono uppercase tracking-[0.16em] text-muted mb-2"
        >
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

      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-coral hover:bg-coral-hover text-white font-medium transition focus-coral disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <Loader2 size={16} strokeWidth={2} className="animate-spin" />
            Sending…
          </>
        ) : (
          "Send reset link"
        )}
      </button>

      {state.kind === "error" && (
        <div
          role="alert"
          className="rounded-lg border border-warn/40 bg-warn/[0.06] px-4 py-3 text-sm text-warn"
        >
          {state.message}
        </div>
      )}
    </form>
  );
}
