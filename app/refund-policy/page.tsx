import type { Metadata } from "next";
import { LegalPage, Section } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Refund Policy — wpaxiom",
  description: "Refund Policy for wpaxiom WordPress plugins.",
};

export default function RefundPolicyPage() {
  return (
    <LegalPage label="Legal" title="Refund Policy" updatedAt="May 21, 2026">
      <Section title="Our Commitment">
        <p>
          We stand behind our Products. If you are not satisfied with your purchase, we offer a full
          refund within 30 days — no questions asked.
        </p>
      </Section>

      <Section title="Eligibility">
        <ul className="list-disc pl-5 space-y-1">
          <li>Refund requests must be submitted within 30 days of the original purchase date.</li>
          <li>Applies to all paid plugins and apps sold through wpaxiom.com.</li>
          <li>One refund per product per customer.</li>
          <li>Donations made via the &quot;Buy me a coffee&quot; page are non-refundable.</li>
        </ul>
      </Section>

      <Section title="How to Request a Refund">
        <p>
          Email{" "}
          <a
            href="mailto:support@wpaxiom.com"
            className="text-ink underline underline-offset-4 hover:text-coral transition"
          >
            support@wpaxiom.com
          </a>{" "}
          with the subject line <span className="font-mono text-ink">Refund Request</span> and
          include your order ID. We process refunds the same business day we receive your request.
        </p>
        <p>
          Refunds are issued back to the original payment method via Paddle. Processing time depends
          on your bank or card issuer but is typically 5–10 business days.
        </p>
      </Section>

      <Section title="After a Refund">
        <p>
          Once a refund is processed, your license will be deactivated and you will lose access to
          future updates and support for that Product. You are required to remove the Product from
          your sites.
        </p>
      </Section>

      <Section title="Renewals">
        <p>
          Annual license renewals can be cancelled and refunded within 7 days of the renewal charge
          if you no longer wish to continue. Email us with your order ID within that window.
        </p>
      </Section>

      <Section title="Exceptions">
        <p>We reserve the right to decline a refund if:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>The 30-day window has passed</li>
          <li>There is clear evidence of abuse of the refund policy</li>
          <li>The request is for a second refund on the same product</li>
        </ul>
      </Section>

      <Section title="Contact">
        <p>
          Questions about a refund? Reach us at{" "}
          <a
            href="mailto:support@wpaxiom.com"
            className="text-ink underline underline-offset-4 hover:text-coral transition"
          >
            support@wpaxiom.com
          </a>
          . We respond within 4 hours on business days.
        </p>
      </Section>
    </LegalPage>
  );
}
