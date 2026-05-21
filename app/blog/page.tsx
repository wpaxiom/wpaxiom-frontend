import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { getPosts, getPostCategory, getFeaturedImage, formatPostDate, estimateReadTime } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog — wpaxiom',
  description: 'Notes on building WordPress plugins — performance, developer experience, and the block editor.',
}

const POSTS_PER_PAGE = 9

type Props = {
  searchParams: Promise<{ page?: string }>
}

export default async function BlogPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10))

  let posts: Awaited<ReturnType<typeof getPosts>>['posts'] = []
  let total = 0
  let totalPages = 1
  let available = true

  try {
    const data = await getPosts(POSTS_PER_PAGE, page)
    posts = data.posts
    total = data.total
    totalPages = data.totalPages
  } catch {
    available = false
  }

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line/70">
        <div className="max-w-[1280px] mx-auto px-6 py-20">
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">// From the journal</div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">Blog</h1>
          <p className="mt-4 text-muted leading-relaxed max-w-xl">
            Notes on building WordPress plugins — performance, developer experience, and the block editor.
          </p>
          {total > 0 && (
            <p className="mt-2 text-xs font-mono text-subtle">{total} posts</p>
          )}
        </div>
      </section>

      {/* Grid — only rendered when posts are available */}
      {available && posts.length > 0 && (
        <section>
          <div className="max-w-[1280px] mx-auto px-6 py-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post) => {
                const image = getFeaturedImage(post)
                const category = getPostCategory(post)
                const date = formatPostDate(post.date)
                const readTime = estimateReadTime(post.content.rendered)
                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group rounded-2xl border border-line bg-base hover:border-muted/60 transition overflow-hidden flex flex-col"
                  >
                    <div className="aspect-[16/10] bg-elevated relative overflow-hidden">
                      {image ? (
                        <Image
                          src={image}
                          alt={post.title.rendered}
                          fill
                          className="object-cover group-hover:scale-[1.02] transition duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-mono text-xs text-subtle uppercase tracking-[0.2em]">
                            // {category}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-3 text-xs text-muted font-mono flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-elevated border border-line text-coral">
                          {category}
                        </span>
                        <span>·</span>
                        <span>{date}</span>
                        <span>·</span>
                        <span>{readTime}</span>
                      </div>
                      <h2
                        className="mt-4 text-lg font-semibold tracking-tight leading-snug group-hover:text-coral transition"
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                      />
                      <p
                        className="mt-2 text-sm text-muted leading-relaxed line-clamp-3 flex-1"
                        dangerouslySetInnerHTML={{ __html: post.excerpt.rendered.replace(/<[^>]+>/g, '') }}
                      />
                      <div className="mt-5 flex items-center gap-1 text-xs text-coral font-mono">
                        Read post <ArrowRight size={12} strokeWidth={2} className="mt-px" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-14 flex items-center justify-center gap-2">
                {page > 1 && (
                  <Link
                    href={`/blog?page=${page - 1}`}
                    className="px-4 py-2 rounded-lg border border-line text-sm text-muted hover:text-ink hover:border-muted transition font-mono"
                  >
                    ← Prev
                  </Link>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/blog?page=${p}`}
                    className={`w-9 h-9 rounded-lg border text-sm font-mono flex items-center justify-center transition ${
                      p === page
                        ? 'border-coral bg-coral/[0.06] text-coral'
                        : 'border-line text-muted hover:text-ink hover:border-muted'
                    }`}
                  >
                    {p}
                  </Link>
                ))}
                {page < totalPages && (
                  <Link
                    href={`/blog?page=${page + 1}`}
                    className="px-4 py-2 rounded-lg border border-line text-sm text-muted hover:text-ink hover:border-muted transition font-mono"
                  >
                    Next →
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  )
}
