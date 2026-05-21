import { ReactNode } from 'react'

type CalloutType = 'tip' | 'warning' | 'info'

const VARIANTS: Record<
  CalloutType,
  {
    border: string
    bg: string
    iconWrap: string
    labelColor: string
    label: string
    icon: ReactNode
  }
> = {
  tip: {
    border: 'border-coral/30',
    bg: 'bg-coral/[0.06]',
    iconWrap: 'bg-coral/15 border border-coral/30',
    labelColor: 'text-coral',
    label: '// Tip',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8593C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 4 12.7c-.6.6-1 1.4-1 2.3v1H9v-1c0-.9-.4-1.7-1-2.3A7 7 0 0 1 12 2Z" />
      </svg>
    ),
  },
  warning: {
    border: 'border-warn/30',
    bg: 'bg-warn/[0.05]',
    iconWrap: 'bg-warn/15 border border-warn/30',
    labelColor: 'text-warn',
    label: '// Important',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.41 0Z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
    ),
  },
  info: {
    border: 'border-info/30',
    bg: 'bg-info/[0.06]',
    iconWrap: 'bg-info/15 border border-info/30',
    labelColor: 'text-info',
    label: '// Note',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 16v-5M12 8h.01" />
      </svg>
    ),
  },
}

export function Callout({ type = 'info', children }: { type?: CalloutType; children: ReactNode }) {
  const v = VARIANTS[type]
  return (
    <aside
      role="note"
      className={`my-7 rounded-xl border ${v.border} ${v.bg} p-5 flex gap-4`}
    >
      <div className={`flex-none w-8 h-8 rounded-lg ${v.iconWrap} flex items-center justify-center`}>
        {v.icon}
      </div>
      <div className="min-w-0">
        <p className={`text-xs font-mono uppercase tracking-wider ${v.labelColor} mb-1`}>{v.label}</p>
        <div className="text-ink/95 [&>p]:m-0 [&>p]:text-[15px] [&>p]:leading-relaxed">{children}</div>
      </div>
    </aside>
  )
}
