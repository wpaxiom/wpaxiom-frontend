import type { Metadata } from "next";
import { LegalPage, Section } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — wpaxiom",
  description: "Privacy Policy for wpaxiom WordPress plugins.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage label="Legal" title="Privacy Policy" updatedAt="May 21, 2026">
      <Section title="1. Overview">
        <p>
          wpaxiom (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) respects your privacy. This policy explains what
          information we collect, how we use it, and your rights regarding it. It applies to
          wpaxiom.com and all Products we offer.
        </p>
      </Section>

      <Section title="2. Information We Collect">
        <p>We collect the following types of information:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <span className="text-ink font-medium">Purchase information</span> — name, email address,
            and billing details collected by Paddle at checkout. We receive your email and order
            details but never store your payment card information.
          </li>
          <li>
            <span className="text-ink font-medium">Account information</span> — email address and
            password if you create an account on wpaxiom.com.
          </li>
          <li>
            <span className="text-ink font-medium">Usage data</span> — anonymized page visit data
            collected by Vercel Speed Insights (no cookies, no cross-site tracking).
          </li>
          <li>
            <span className="text-ink font-medium">Support communications</span> — messages you send
            to support@wpaxiom.com.
          </li>
        </ul>
      </Section>

      <Section title="3. How We Use Your Information">
        <p>We use collected information to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Fulfill and manage your purchases and licenses</li>
          <li>Send transactional emails (order confirmation, license keys, renewal reminders)</li>
          <li>Respond to support requests</li>
          <li>Improve our Products using anonymized usage data</li>
        </ul>
        <p>We do not sell, rent, or share your personal data with third parties for marketing.</p>
      </Section>

      <Section title="4. Third-Party Services">
        <p>We use the following third-party services that may process your data:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <span className="text-ink font-medium">Paddle</span> — payment processing and tax
            collection. Paddle is our Merchant of Record and handles all payment data under their own{" "}
            <a
              href="https://www.paddle.com/legal/privacy"
              className="text-ink underline underline-offset-4 hover:text-coral transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
            .
          </li>
          <li>
            <span className="text-ink font-medium">Vercel</span> — hosting and anonymized analytics
            (Speed Insights). No cookies are set.
          </li>
          <li>
            <span className="text-ink font-medium">Resend</span> — transactional email delivery.
          </li>
        </ul>
      </Section>

      <Section title="5. Cookies">
        <p>
          wpaxiom.com does not use tracking or advertising cookies. We use a single session cookie
          for authenticated account sessions only. Vercel Speed Insights does not use cookies.
        </p>
      </Section>

      <Section title="6. Data Retention">
        <p>
          We retain your account and purchase data for as long as your account is active or as
          required by law. Support communications are retained for up to 2 years. You may request
          deletion at any time.
        </p>
      </Section>

      <Section title="7. Your Rights">
        <p>You have the right to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Withdraw consent where processing is based on consent</li>
        </ul>
        <p>
          To exercise any of these rights, email{" "}
          <a
            href="mailto:support@wpaxiom.com"
            className="text-ink underline underline-offset-4 hover:text-coral transition"
          >
            support@wpaxiom.com
          </a>
          . We will respond within 30 days.
        </p>
      </Section>

      <Section title="8. Security">
        <p>
          We use industry-standard measures to protect your data, including encrypted connections
          (HTTPS) and hashed passwords. No method of transmission over the internet is 100% secure,
          and we cannot guarantee absolute security.
        </p>
      </Section>

      <Section title="9. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. We will update the &quot;Last updated&quot;
          date at the top of this page and, for significant changes, notify account holders by email.
        </p>
      </Section>

      <Section title="10. Contact">
        <p>
          For privacy-related questions, contact us at{" "}
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
