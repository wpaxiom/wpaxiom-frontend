import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { getProfileForCurrentUser } from "@/lib/account-profile";
import { ProfileForm } from "@/components/account/ProfileForm";

export const metadata: Metadata = {
  title: "Profile — wpaxiom account",
};

export default async function ProfilePage() {
  const [session, profile] = await Promise.all([
    auth(),
    getProfileForCurrentUser(),
  ]);

  const fallbackProfile = {
    displayName: session?.user?.name ?? "",
    firstName: "",
    lastName: "",
    email: session?.user?.email ?? "",
    website: "",
    avatarUrl: "",
    phone: "",
    company: "",
    billing: {
      address1: "",
      address2: "",
      city: "",
      state: "",
      postcode: "",
      country: "",
    },
  };

  return (
    <>
      <div className="mb-8">
        <div className="text-xs font-mono uppercase tracking-[0.18em] text-muted mb-2">// Account</div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">Profile</h1>
        <p className="mt-2 text-sm text-muted">
          Account details, billing address, and email preferences.
        </p>
      </div>

      <ProfileForm profile={profile ?? fallbackProfile} />
    </>
  );
}
