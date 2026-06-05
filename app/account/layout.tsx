import { createHash } from "crypto";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { AccountSidebar, AccountTabBar } from "@/components/account/AccountSidebar";

function initialsFrom(name: string | null | undefined, email: string | null | undefined): string {
  if (name && name.trim().length > 0) {
    const parts = name.trim().split(/\s+/);
    const a = parts[0]?.[0] ?? "";
    const b = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (a + b).toUpperCase() || "U";
  }
  return (email?.[0] ?? "U").toUpperCase();
}

function gravatarUrl(email: string): string {
  const hash = createHash("md5").update(email.toLowerCase().trim()).digest("hex");
  // d=404 so onError fires and we fall back to initials when no Gravatar is set
  return `https://secure.gravatar.com/avatar/${hash}?s=80&d=404`;
}

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?from=/account");
  }
  if (session.error === "WPTokenExpired") {
    await signOut({ redirectTo: "/login?expired=1" });
  }

  const email = session.user.email ?? "";
  const sidebarUser = {
    name: session.user.name ?? email ?? "Account",
    email,
    initials: initialsFrom(session.user.name, email),
    avatarUrl: email ? gravatarUrl(email) : "",
  };

  return (
    <div className="max-w-[1440px] mx-auto px-0 md:px-6">
      <AccountTabBar />
      <div className="md:flex md:gap-8 md:py-10">
        <AccountSidebar user={sidebarUser} />
        <main className="flex-1 min-w-0 px-4 md:px-0 py-8 md:py-0">
          {children}
        </main>
      </div>
    </div>
  );
}

