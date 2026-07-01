'use client'

import { useState } from 'react'

type Vote = 'yes' | 'no'

export function ArticleFeedback({ plugin, slug }: { plugin: string; slug: string }) {
  const [vote, setVote] = useState<Vote | null>(null)

  function submit(value: Vote) {
    if (vote) return
    setVote(value)
    // Fire-and-forget; feedback is best-effort and never blocks the UI.
    try {
      navigator.sendBeacon?.(
        '/api/docs/feedback',
        new Blob([JSON.stringify({ plugin, slug, vote: value })], { type: 'application/json' }),
      )
    } catch {
      // ignore — the thank-you state is shown regardless
    }
  }

  return (
    <section aria-label="Article feedback" className="mt-16 pt-8 border-t border-line">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-subtle mb-2">// Feedback</p>
          <p className="text-base text-ink m-0" aria-live="polite">
            {vote
              ? 'Thanks for your feedback!'
              : 'Was this article helpful?'}
          </p>
        </div>
        {!vote && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => submit('yes')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-line hover:border-coral/50 hover:bg-coral/[0.04] text-muted hover:text-ink text-sm transition focus-coral"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
                <path d="M7 10v12" />
              </svg>
              Yes
            </button>
            <button
              type="button"
              onClick={() => submit('no')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-line hover:border-coral/50 hover:bg-coral/[0.04] text-muted hover:text-ink text-sm transition focus-coral"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
                <path d="M17 14V2" />
              </svg>
              No
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
