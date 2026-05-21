import type { Metadata } from "next";
import { LegalPage, Section } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service — wpaxiom",
  description: "Terms of Service for wpaxiom WordPress plugins.",
};

export default function TermsPage() {
  return (
    <LegalPage label="Legal" title="Terms of Service" updatedAt="May 21, 2026">
      <Section title="1. Acceptance of Terms">
        <p>
          By purchasing, downloading, or using any product offered by wpaxiom (&quot;we&quot;, &quot;us&quot;, or
          &quot;our&quot;), you agree to be bound by these Terms of Service. If you do not agree, do not use
          our products.
        </p>
      </Section>

      <Section title="2. Products">
        <p>
          wpaxiom offers WordPress plugins (&quot;Products&quot;). Free products are
          distributed under the GNU General Public License v2 (GPLv2). Pro or paid extensions are
          licensed under a commercial license as described at the time of purchase.
        </p>
        <p>
          We reserve the right to modify, suspend, or discontinue any Product at any time with
          reasonable notice.
        </p>
      </Section>

      <Section title="3. License Grant">
        <p>
          Upon purchase, we grant you a non-exclusive, non-transferable license to install and use the
          Product on the number of sites specified in your plan. You may not resell, sublicense,
          redistribute, or share the Product with third parties unless explicitly permitted.
        </p>
        <p>
          Free plugins on WordPress.org are licensed under GPLv2 and may be used, modified, and
          redistributed in accordance with that license.
        </p>
      </Section>

      <Section title="4. Restrictions">
        <p>You agree not to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Use any Product for unlawful purposes</li>
          <li>Reverse engineer or attempt to extract source code from compiled portions</li>
          <li>Remove or alter any proprietary notices or labels</li>
          <li>Use the Products to build a competing product or service</li>
        </ul>
      </Section>

      <Section title="5. Payments and Billing">
        <p>
          All payments are processed by Paddle.com, our authorized reseller and Merchant of Record.
          Paddle handles order processing, payment collection, receipts, and applicable taxes on our
          behalf. By completing a purchase you also agree to{" "}
          <a
            href="https://www.paddle.com/legal/terms"
            className="text-ink underline underline-offset-4 hover:text-coral transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            Paddle&apos;s Terms of Service
          </a>
          .
        </p>
        <p>
          Prices are listed in USD and may be subject to local taxes collected by Paddle at checkout.
        </p>
      </Section>

      <Section title="6. Updates and Support">
        <p>
          Paid licenses include updates and support for the duration of the license period. Free
          plugins receive updates via WordPress.org. We do not guarantee a specific update schedule
          or support response time for free users.
        </p>
      </Section>

      <Section title="7. Disclaimer of Warranties">
        <p>
          Products are provided &quot;as is&quot; without warranties of any kind, either express or implied,
          including but not limited to warranties of merchantability, fitness for a particular
          purpose, or non-infringement. We do not warrant that the Products will be error-free or
          uninterrupted.
        </p>
      </Section>

      <Section title="8. Limitation of Liability">
        <p>
          To the maximum extent permitted by law, wpaxiom shall not be liable for any indirect,
          incidental, special, consequential, or punitive damages arising from your use of or
          inability to use our Products. Our total liability shall not exceed the amount you paid for
          the Product in the twelve months preceding the claim.
        </p>
      </Section>

      <Section title="9. Governing Law">
        <p>
          These Terms are governed by and construed in accordance with applicable law. Any disputes
          shall be resolved through good-faith negotiation before pursuing formal legal proceedings.
        </p>
      </Section>

      <Section title="10. Changes to Terms">
        <p>
          We may update these Terms at any time. Continued use of our Products after changes are
          posted constitutes acceptance of the revised Terms. We will update the &quot;Last updated&quot; date
          at the top of this page.
        </p>
      </Section>

      <Section title="11. Contact">
        <p>
          For questions about these Terms, contact us at{" "}
          <a
            href="mailto:support@wpaxiom.com"
            className="text-ink underline underline-offset-4 hover:text-coral transition"
          >
            support@wpaxiom.com
          </a>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
