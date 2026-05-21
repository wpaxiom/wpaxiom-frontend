export function ContactCta({
  heading = "Still stuck? We're here to help.",
  description = 'Contact our support team with the error message from your Axiom Blocks dashboard and the site URL you are trying to activate on.',
  label = 'Contact support',
  href = '/contact',
}: {
  heading?: string
  description?: string
  label?: string
  href?: string
}) {
  return (
    <div className="not-prose my-10 rounded-xl border border-line bg-surface p-6">
      <p className="text-xs font-mono uppercase tracking-wider text-subtle mb-3">// Need help?</p>
      <p className="text-lg font-semibold text-ink tracking-tight mb-2">{heading}</p>
      <p className="text-sm text-muted leading-relaxed mb-5">{description}</p>
      <a
        href={href}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-coral hover:bg-coral-hover !text-white !no-underline text-sm font-medium transition focus-coral"
      >
        {label}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  )
}
