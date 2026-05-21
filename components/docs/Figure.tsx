export function Figure({ caption }: { caption?: string }) {
  return (
    <figure className="my-8">
      <div className="rounded-xl border border-line bg-surface overflow-hidden">
        <div className="aspect-video w-full bg-elevated/60 relative grid place-items-center">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
          <div className="relative text-center">
            <div className="inline-flex bg-surface border border-line p-3 rounded-lg mb-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
              </svg>
            </div>
            {caption && (
              <p className="text-xs font-mono uppercase tracking-wider text-muted m-0">// screenshot</p>
            )}
          </div>
        </div>
      </div>
      {caption && (
        <figcaption className="mt-3 text-xs font-mono text-subtle">{caption}</figcaption>
      )}
    </figure>
  )
}
