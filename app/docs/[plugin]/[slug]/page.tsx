import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { getDoc, getAllDocSlugs, extractHeadings } from '@/lib/docs'
import { DOC_NAV, findArticleInNav } from '@/lib/docs-nav'
import { mdxComponents } from '@/components/docs/MdxComponents'
import { DocSidebar } from '@/components/docs/DocSidebar'
import { TableOfContents } from '@/components/docs/TableOfContents'
import { ArticleFeedback } from '@/components/docs/ArticleFeedback'

type Props = { params: Promise<{ plugin: string; slug: string }> }

export async function generateStaticParams() {
  return getAllDocSlugs()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { plugin, slug } = await params
  try {
    const { frontmatter } = await getDoc(plugin, slug)
    return {
      title: `${frontmatter.title} — Documentation — wpaxiom`,
      description: `${frontmatter.category} · ${DOC_NAV[plugin]?.label ?? ''}`,
    }
  } catch {
    return { title: 'Documentation — wpaxiom' }
  }
}

export default async function DocArticlePage({ params }: Props) {
  const { plugin, slug } = await params

  let doc: Awaited<ReturnType<typeof getDoc>>
  try {
    doc = await getDoc(plugin, slug)
  } catch {
    notFound()
  }

  const { frontmatter, content } = doc
  const headings = extractHeadings(content)
  const pluginNav = DOC_NAV[plugin]
  const articleMeta = findArticleInNav(plugin, slug)

  const updatedDate = new Date(frontmatter.updatedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <>
      {/* Mobile docs nav */}
      <div className="lg:hidden border-b border-line/70 bg-surface/40">
        <details className="group">
          <summary className="max-w-[1280px] mx-auto px-6 py-3 flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-ink">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M3 12h18M3 18h12" />
              </svg>
              Documentation menu
            </span>
            <span className="font-mono text-xs text-muted">
              {pluginNav?.label} · {articleMeta?.categoryLabel}
            </span>
          </summary>
          <div className="max-w-[1280px] mx-auto px-6 py-5 border-t border-line/60">
            <p className="text-xs font-mono uppercase tracking-wider text-subtle mb-3">// On this page</p>
            <ul className="space-y-2 text-sm text-muted">
              {headings.map((h) => (
                <li key={h.id} className={h.level === 3 ? 'pl-4' : ''}>
                  <a href={`#${h.id}`} className="hover:text-ink">{h.text}</a>
                </li>
              ))}
            </ul>
          </div>
        </details>
      </div>

      {/* Three-column layout */}
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid lg:grid-cols-[260px,minmax(0,1fr)] xl:grid-cols-[260px,minmax(0,1fr),220px] gap-10 xl:gap-14">
          <DocSidebar plugin={plugin} currentSlug={slug} />

          <main className="py-10 lg:py-12 max-w-[760px]">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-muted mb-6 flex-wrap">
              <Link href="/docs" className="hover:text-ink transition">Docs</Link>
              <span className="text-subtle">/</span>
              <Link href={`/docs/${plugin}/${pluginNav?.categories[0]?.articles[0]?.slug ?? ''}`} className="hover:text-ink transition">
                {pluginNav?.label}
              </Link>
              <span className="text-subtle">/</span>
              <span className="text-muted">{articleMeta?.categoryLabel}</span>
              <span className="text-subtle">/</span>
              <span className="text-ink">{frontmatter.title}</span>
            </nav>

            {/* Article header */}
            <header className="mb-10">
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-[-0.025em] leading-[1.05] text-ink">
                {frontmatter.title}
              </h1>
              <div className="mt-6 flex items-center gap-x-5 gap-y-2 flex-wrap text-xs font-mono text-muted">
                <span className="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 8v4l3 2" /><circle cx="12" cy="12" r="9" />
                  </svg>
                  <span>Updated <time dateTime={frontmatter.updatedAt}>{updatedDate}</time></span>
                </span>
                <span className="text-subtle">·</span>
                <span className="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19V5a2 2 0 0 1 2-2h14v18H6a2 2 0 0 1 0-4h14" />
                  </svg>
                  ~{frontmatter.readTime} min read
                </span>
              </div>
            </header>

            {/* Article body */}
            <article className="article-body">
              <MDXRemote
                source={content}
                components={mdxComponents}
                options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }}
              />
            </article>

            {/* Feedback */}
            <ArticleFeedback plugin={plugin} slug={slug} />

            {/* Prev / Next */}
            {(frontmatter.prev || frontmatter.next) && (
              <nav aria-label="Article navigation" className="mt-12 grid sm:grid-cols-2 gap-4">
                {frontmatter.prev ? (
                  <Link href={`/docs/${plugin}/${frontmatter.prev.slug}`} className="group rounded-xl border border-line bg-surface p-5 hover:border-muted transition focus-coral">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-subtle flex items-center gap-1.5">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </div>
                    <p className="mt-2 text-base font-medium text-ink group-hover:text-coral transition tracking-tight m-0">{frontmatter.prev.title}</p>
                  </Link>
                ) : <div />}
                {frontmatter.next && (
                  <Link href={`/docs/${plugin}/${frontmatter.next.slug}`} className="group rounded-xl border border-line bg-surface p-5 hover:border-muted transition focus-coral text-right">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-subtle flex items-center justify-end gap-1.5">
                      Next
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                    <p className="mt-2 text-base font-medium text-ink group-hover:text-coral transition tracking-tight m-0">{frontmatter.next.title}</p>
                  </Link>
                )}
              </nav>
            )}
          </main>

          <TableOfContents headings={headings} />
        </div>
      </div>
    </>
  )
}
