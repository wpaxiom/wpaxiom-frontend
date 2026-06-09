import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSubscriptionById } from "@/lib/wp-api";
import { getPaddleClient } from "@/lib/paddle-server";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ wcSubId: string }> }
) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { wcSubId: wcSubIdStr } = await params;
  const wcSubId = parseInt(wcSubIdStr, 10);
  if (!Number.isFinite(wcSubId)) {
    return NextResponse.json({ error: "Invalid subscription ID" }, { status: 400 });
  }

  try {
    const sub = await getSubscriptionById(wcSubId);
    if (!sub) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    if (sub.billing.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const paddleSubIdMeta = sub.meta_data.find((m) => m.key === "_paddle_subscription_id");
    const paddleSubId = paddleSubIdMeta?.value ? String(paddleSubIdMeta.value) : null;
    if (!paddleSubId) {
      return NextResponse.json({ error: "Paddle subscription ID not found" }, { status: 404 });
    }

    const paddle = getPaddleClient();
    await paddle.subscriptions.cancel(paddleSubId, { effectiveFrom: "next_billing_period" });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(`[subscriptions/cancel] error for WC sub ${wcSubId}:`, e);
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
  }
}
