import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCustomerByEmail, listSubscriptions } from "@/lib/wp-api";
import { getPaddleClient } from "@/lib/paddle-server";

export async function POST() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const customer = await getCustomerByEmail(email);
    if (!customer) {
      return NextResponse.json({ error: "No subscription found" }, { status: 404 });
    }

    const wcSubs = await listSubscriptions({ customerId: customer.id, status: "any", perPage: 50 });

    let paddleCustomerId: string | null = null;
    const paddleSubIds: string[] = [];

    for (const sub of wcSubs) {
      for (const m of sub.meta_data) {
        if (m.key === "_paddle_customer_id" && m.value && !paddleCustomerId) {
          paddleCustomerId = String(m.value);
        }
        if (m.key === "_paddle_subscription_id" && m.value) {
          const sid = String(m.value);
          if (!paddleSubIds.includes(sid)) paddleSubIds.push(sid);
        }
      }
    }

    if (!paddleCustomerId) {
      return NextResponse.json({ error: "No Paddle billing account found" }, { status: 404 });
    }

    const paddle = getPaddleClient();
    const portalSession = await paddle.customerPortalSessions.create(
      paddleCustomerId,
      paddleSubIds
    );

    return NextResponse.json({ url: portalSession.urls.general.overview });
  } catch (e) {
    console.error("[subscriptions/portal] error:", e);
    return NextResponse.json({ error: "Failed to create billing portal session" }, { status: 500 });
  }
}
