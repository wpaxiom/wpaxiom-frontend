"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import type { ProfileData } from "@/lib/account-profile";

type SaveStatus = "idle" | "saving" | "saved" | "error";

const inputCls =
  "w-full px-4 py-2.5 rounded-lg bg-base border border-line text-ink placeholder:text-subtle focus:outline-none focus:border-coral transition text-sm";

const saveBtnCls =
  "px-4 py-2 rounded-lg bg-coral hover:bg-coral-hover text-white text-sm font-medium transition focus-coral disabled:opacity-50 disabled:cursor-not-allowed";

const outlineBtnCls =
  "px-4 py-2 rounded-lg border border-line hover:border-muted text-ink text-sm font-medium transition focus-coral disabled:opacity-50 disabled:cursor-not-allowed";

function btnLabel(status: SaveStatus, idle: string): string {
  if (status === "saving") return "Saving…";
  if (status === "saved") return "Saved";
  return idle;
}

export function ProfileForm({ profile }: { profile: ProfileData }) {
  // Account details
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [displayName, setDisplayName] = useState(profile.displayName);

  // Contact
  const [phone, setPhone] = useState(profile.phone);
  const [company, setCompany] = useState(profile.company);
  const [website, setWebsite] = useState(profile.website);

  // Billing address
  const [address1, setAddress1] = useState(profile.billing.address1);
  const [address2, setAddress2] = useState(profile.billing.address2);
  const [city, setCity] = useState(profile.billing.city);
  const [billingState, setBillingState] = useState(profile.billing.state);
  const [postcode, setPostcode] = useState(profile.billing.postcode);
  const [country, setCountry] = useState(profile.billing.country);

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Email preferences
  const [productEmails, setProductEmails] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(true);

  // Save statuses + errors
  const [detailsStatus, setDetailsStatus] = useState<SaveStatus>("idle");
  const [contactStatus, setContactStatus] = useState<SaveStatus>("idle");
  const [billingStatus, setBillingStatus] = useState<SaveStatus>("idle");
  const [passwordStatus, setPasswordStatus] = useState<SaveStatus>("idle");
  const [detailsError, setDetailsError] = useState("");
  const [contactError, setContactError] = useState("");
  const [billingError, setBillingError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  async function runSave(
    url: string,
    method: string,
    body: object,
    setStatus: (s: SaveStatus) => void,
    setError: (e: string) => void,
    onSuccess?: () => void
  ) {
    setStatus("saving");
    setError("");
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setStatus("saved");
        onSuccess?.();
        setTimeout(() => setStatus("idle"), 2000);
      } else {
        const data = await res.json().catch(() => ({})) as { error?: string };
        setError(data.error ?? "Failed to save. Please try again.");
        setStatus("error");
        setTimeout(() => setStatus("idle"), 4000);
      }
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  }

  return (
    <div className="space-y-5">

      {/* Profile photo */}
      <section className="rounded-2xl border border-line bg-surface p-7">
        <h2 className="text-lg font-medium tracking-tight text-ink mb-6">Profile photo</h2>

        <div className="flex items-center gap-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.avatarUrl}
            alt=""
            width={80}
            height={80}
            referrerPolicy="no-referrer"
            className="w-20 h-20 rounded-full border-2 border-line object-cover bg-elevated flex-none"
          />

          <div>
            <div className="text-sm font-medium text-ink">
              {[profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.displayName}
            </div>
            <div className="text-xs text-muted font-mono mt-0.5">{profile.email}</div>
            <a
              href="https://gravatar.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink transition"
            >
              Change photo
              <ExternalLink size={10} strokeWidth={2} />
            </a>
          </div>
        </div>
      </section>

      {/* Account details */}
      <section className="rounded-2xl border border-line bg-surface p-7">
        <h2 className="text-lg font-medium tracking-tight text-ink mb-1">Account details</h2>
        <p className="text-sm text-muted mb-6">Used on invoices and account emails.</p>

        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="First name" id="first-name">
              <input
                id="first-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputCls}
                placeholder="First"
              />
            </Field>
            <Field label="Last name" id="last-name">
              <input
                id="last-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputCls}
                placeholder="Last"
              />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Display name" id="display-name">
              <input
                id="display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className={inputCls}
                placeholder="Shown publicly"
              />
            </Field>
            <Field label="Email" id="email">
              <input
                id="email"
                type="email"
                value={profile.email}
                readOnly
                className={`${inputCls} opacity-50 cursor-not-allowed select-none`}
                title="Email cannot be changed here"
              />
            </Field>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          {detailsError && <p className="text-xs text-red-500">{detailsError}</p>}
          <button
            type="button"
            disabled={detailsStatus === "saving" || detailsStatus === "saved"}
            onClick={() =>
              runSave(
                "/api/account/profile/details",
                "PATCH",
                { first_name: firstName, last_name: lastName, display_name: displayName },
                setDetailsStatus,
                setDetailsError
              )
            }
            className={saveBtnCls}
          >
            {btnLabel(detailsStatus, "Save changes")}
          </button>
        </div>
      </section>

      {/* Contact */}
      <section className="rounded-2xl border border-line bg-surface p-7">
        <h2 className="text-lg font-medium tracking-tight text-ink mb-1">Contact</h2>
        <p className="text-sm text-muted mb-6">Shown on receipts if provided.</p>

        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Phone" id="phone">
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputCls}
                placeholder="+1 (555) 000-0000"
              />
            </Field>
            <Field label="Company" id="company">
              <input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className={inputCls}
                placeholder="Optional"
              />
            </Field>
          </div>
          <Field label="Website" id="website">
            <input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className={inputCls}
              placeholder="https://"
            />
          </Field>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          {contactError && <p className="text-xs text-red-500">{contactError}</p>}
          <button
            type="button"
            disabled={contactStatus === "saving" || contactStatus === "saved"}
            onClick={() =>
              runSave(
                "/api/account/profile/contact",
                "PATCH",
                { phone, company, website },
                setContactStatus,
                setContactError
              )
            }
            className={saveBtnCls}
          >
            {btnLabel(contactStatus, "Save changes")}
          </button>
        </div>
      </section>

      {/* Billing address */}
      <section className="rounded-2xl border border-line bg-surface p-7">
        <h2 className="text-lg font-medium tracking-tight text-ink mb-1">Billing address</h2>
        <p className="text-sm text-muted mb-6">Appears on order invoices.</p>

        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Address line 1" id="address1">
              <input
                id="address1"
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                className={inputCls}
                placeholder="Street address"
              />
            </Field>
            <Field label="Address line 2" id="address2">
              <input
                id="address2"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
                className={inputCls}
                placeholder="Apt, suite, etc. (optional)"
              />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="City" id="city">
              <input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="State / Province" id="state">
              <input
                id="state"
                value={billingState}
                onChange={(e) => setBillingState(e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Postcode / ZIP" id="postcode">
              <input
                id="postcode"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Country" id="country">
              <input
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={inputCls}
                placeholder="e.g. US, BD, GB"
              />
            </Field>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          {billingError && <p className="text-xs text-red-500">{billingError}</p>}
          <button
            type="button"
            disabled={billingStatus === "saving" || billingStatus === "saved"}
            onClick={() =>
              runSave(
                "/api/account/profile/billing",
                "PATCH",
                { address1, address2, city, state: billingState, postcode, country },
                setBillingStatus,
                setBillingError
              )
            }
            className={saveBtnCls}
          >
            {btnLabel(billingStatus, "Save changes")}
          </button>
        </div>
      </section>

      {/* Password */}
      <section className="rounded-2xl border border-line bg-surface p-7">
        <h2 className="text-lg font-medium tracking-tight text-ink mb-1">Password</h2>
        <p className="text-sm text-muted mb-6">Change your sign-in password.</p>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Current password" id="current-password">
            <input
              id="current-password"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="New password" id="new-password">
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
          <button
            type="button"
            disabled={passwordStatus === "saving" || passwordStatus === "saved"}
            onClick={() =>
              runSave(
                "/api/account/profile/password",
                "POST",
                { current_password: currentPassword, new_password: newPassword },
                setPasswordStatus,
                setPasswordError,
                () => { setCurrentPassword(""); setNewPassword(""); }
              )
            }
            className={outlineBtnCls}
          >
            {btnLabel(passwordStatus, "Update password")}
          </button>
        </div>
      </section>

      {/* Email preferences */}
      <section className="rounded-2xl border border-line bg-surface p-7">
        <h2 className="text-lg font-medium tracking-tight text-ink mb-1">Email preferences</h2>
        <p className="text-sm text-muted mb-6">
          Transactional emails (renewals, license issues) cannot be turned off.
        </p>
        <PreferenceRow
          label="Product updates"
          description="Release notes, new features, security advisories."
          checked={productEmails}
          onChange={setProductEmails}
        />
        <div className="my-4 border-t border-line" />
        <PreferenceRow
          label="Marketing"
          description="Tips, case studies, and the occasional special offer. Quarterly at most."
          checked={marketingEmails}
          onChange={setMarketingEmails}
        />
      </section>

    </div>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-mono uppercase tracking-[0.16em] text-muted mb-2"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function PreferenceRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6">
      <div>
        <div className="text-sm text-ink">{label}</div>
        <div className="mt-0.5 text-xs text-muted">{description}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex w-11 h-6 rounded-full focus-coral transition flex-none ${
          checked ? "bg-coral" : "bg-elevated border border-line"
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transform transition ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
