'use client'

import { useState } from 'react'

export function CodeBlock({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  const lang = className?.replace('language-', '') ?? 'code'

  function handleCopy() {
    const text =
      typeof children === 'string'
        ? children
        : (children as React.ReactElement<{ children?: unknown }>)?.props?.children ?? ''
    navigator.clipboard.writeText(String(text)).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="my-7 rounded-xl border border-[#2A2A2A] bg-[#141414] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#2A2A2A] bg-[#1E1E1E]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#555555]">// terminal</span>
          <span className="text-[11px] font-mono text-[#888888]">{lang}</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-mono text-[#888888] hover:text-[#F5F5F5] hover:bg-[#2A2A2A] border border-transparent hover:border-[#3A3A3A] transition focus-coral"
        >
          {copied ? (
            <>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 12 5 5L20 7" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-[#2A2A2A] [&::-webkit-scrollbar-thumb]:rounded">
        <pre className="font-mono text-[13.5px] leading-relaxed p-4 m-0 text-[#E5E5E5]">
          {children}
        </pre>
      </div>
    </div>
  )
}
