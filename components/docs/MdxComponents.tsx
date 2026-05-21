import type { MDXComponents } from 'mdx/types'
import { Callout } from './Callout'
import { CodeBlock } from './CodeBlock'
import { Figure } from './Figure'
import { ContactCta } from './ContactCta'

export const mdxComponents: MDXComponents = {
  Callout,
  Figure,
  ContactCta,
  pre: ({ children, ...props }) => {
    const child = children as React.ReactElement<{ className?: string; children?: React.ReactNode }>
    const className = child?.props?.className ?? ''
    const code = child?.props?.children
    return <CodeBlock className={className}>{code}</CodeBlock>
  },
  table: ({ children }) => (
    <div className="my-7 overflow-x-auto rounded-xl border border-line">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-elevated/40">{children}</thead>,
  th: ({ children }) => (
    <th className="text-left font-medium text-ink px-4 py-3 border-b border-line border-l first:border-l-0 first:rounded-tl-xl last:rounded-tr-xl">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 border-b border-line border-l first:border-l-0 [tr:last-child_&]:border-b-0">
      {children}
    </td>
  ),
  blockquote: ({ children }) => (
    <blockquote>{children}</blockquote>
  ),
}
