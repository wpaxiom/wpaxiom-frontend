"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";

type FormState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export function ResetPasswordForm() {
  const params = useSearchParams();
  const key = params.get("key") ?? "";
  const login = params.get("login") ?? "";

  const missingParams = !key || !login;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [state, setState] = useState<FormState>({ kind: "idle" });

  if (missingParams) {
    return (
      <div
        role="alert"
        className="rounded-lg border border-err/40 bg-err/[0.06] px-4 py-3 text-sm text-err"
      >
        This link is missing required parameters. Request a new reset link from{" "}
        <Link href="/forgot-password" className="underline">
          Forgot password
        </Link>
        .
      </div>
    );
  }

  if (state.kind === "success") {
    return (
      <div className="space-y-5">
        <div className="rounded-lg border border-ok/40 bg-ok/[0.06] px-4 py-4 text-sm text-ink">
          <div className="flex items-start gap-3">
            <CheckCircle2 size={18} strokeWidth={2} className="text-ok flex-none mt-0.5" />
            <div>
              <div className="font-medium">Password updated.</div>
              <div className="mt-1 text-muted">You can now sign in with your new password.</div>
            </div>
          </div>
        </div>
        <Link
          href="/login"
          className="block w-full text-center px-4 py-3 rounded-lg bg-coral hover:bg-coral-hover text-white font-medium transition focus-coral"
        >
          Continue to sign in
        </Link>
      </div>
    );
  }

  const submitting = state.kind === "submitting";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.length < 8) {
      setState({ kind: "error", message: "Password must be at least 8 characters." });
      return;
    }
    if (password !== confirm) {
      setState({ kind: "error", message: "Passwords don't match." });
      return;
    }
    setState({ kind: "submitting" });
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, login, password }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setState({
          kind: "error",
          message: data.error ?? "Could not reset password. Try again.",
        });
        return;
      }
      setState({ kind: "success" });
    } catch {
      setState({ kind: "error", message: "Network error. Try again." });
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div>
        <label
          htmlFor="password"
          className="block text-xs font-mono uppercase tracking-[0.16em] text-muted mb-2"
        >
          New password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
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
        <p className="mt-1.5 text-xs text-subtle">At least 8 characters.</p>
      </div>

      <div>
        <label
          htmlFor="confirm"
          className="block text-xs font-mono uppercase tracking-[0.16em] text-muted mb-2"
        >
          Confirm new password
        </label>
        <input
          id="confirm"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
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
            Updating…
          </>
        ) : (
          "Set new password"
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

      <Link
        href="/login"
        className="block text-center text-sm text-muted hover:text-ink underline-offset-4 hover:underline"
      >
        Back to sign in
      </Link>
    </form>
  );
}
