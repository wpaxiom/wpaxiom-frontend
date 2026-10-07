import { LegalPage, Section } from "@/components/layout/LegalPage";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Editorial Policy — wpaxiom",
  description:
    "How wpaxiom documentation, changelogs, tutorials, and product information are written, sourced, reviewed, and corrected.",
  path: "/editorial-policy",
});

export default function EditorialPolicyPage() {
  return (
    <LegalPage label="Editorial" title="Editorial Policy" updatedAt="October 7, 2026">
      <Section title="1. Scope">
        <p>
          This policy covers product documentation, changelogs, tutorials, blog posts, and product
          information published on wpaxiom.com. Its purpose is to keep technical guidance accurate,
          traceable to a release, and useful without overstating what a plugin does.
        </p>
      </Section>

      <Section title="2. Authorship and maintenance">
        <p>
          Documentation is published by the wpaxiom organization. The plugins are released through the
          verified WPAxiom WordPress.org account, with public source and contribution history available
          through WordPress.org and GitHub.
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Publisher: {" "}
            <a
              href="https://profiles.wordpress.org/wpaxiom/"
              className="text-ink underline underline-offset-4 hover:text-coral transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              WPAxiom on WordPress.org
            </a>
          </li>
          <li>
            Listed contributor: {" "}
            <a
              href="https://profiles.wordpress.org/shuvo586/"
              className="text-ink underline underline-offset-4 hover:text-coral transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              shuvo586 on WordPress.org
            </a>
          </li>
          <li>
            Source organization: {" "}
            <a
              href="https://github.com/wpaxiom"
              className="text-ink underline underline-offset-4 hover:text-coral transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              wpaxiom on GitHub
            </a>
          </li>
        </ul>
        <p>
          Individual author or reviewer names are shown only when that role has been explicitly assigned.
          An organization byline does not imply that every listed contributor reviewed every article.
        </p>
        <p>
          Documentation is authored under the WPAxiom organization byline and technically reviewed by
          Shuvo. Each article records its latest review date in the visible article details and structured
          metadata.
        </p>
      </Section>

      <Section title="3. Sources and verification">
        <p>Technical content is based on one or more of the following:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>the released plugin and its user-visible behavior;</li>
          <li>the plugin source code and bundled readme;</li>
          <li>official WordPress.org release records;</li>
          <li>wpaxiom changelog entries; and</li>
          <li>first-party WPAxiom video tutorials.</li>
        </ul>
        <p>
          Product claims, compatibility statements, and instructions should not be added from assumptions.
          When a fact cannot be verified, the documentation should say so or omit it until evidence is
          available.
        </p>
      </Section>

      <Section title="4. Versions and dates">
        <p>
          Documentation articles display an updated date and the current product version to which the
          instructions apply. Release-specific statements identify the version that introduced the change.
          Changelog dates follow the public plugin release record.
        </p>
        <p>
          A current version label means the article applies to that release; it does not claim that every
          sentence was independently re-tested on the displayed date.
        </p>
      </Section>

      <Section title="5. Changelogs">
        <p>
          Changelogs describe shipped behavior, not planned features. Material additions, improvements,
          fixes, and removals are grouped by release. When a release needs a longer explanation, its entry
          links to the corresponding documentation.
        </p>
      </Section>

      <Section title="6. Tutorials and external media">
        <p>
          First-party WPAxiom tutorials may be embedded beside the relevant written instructions. Embedded
          YouTube videos use the privacy-enhanced youtube-nocookie.com player and are also identified by
          title so readers can open the original tutorial directly.
        </p>
      </Section>

      <Section title="7. Corrections">
        <p>
          Report inaccurate, unclear, or outdated content to {" "}
          <a
            href="mailto:support@wpaxiom.com"
            className="text-ink underline underline-offset-4 hover:text-coral transition"
          >
            support@wpaxiom.com
          </a>
          . Confirmed errors are corrected in the source documentation and the article&apos;s updated date is
          changed when the correction materially affects the guidance.
        </p>
      </Section>
    </LegalPage>
  );
}
