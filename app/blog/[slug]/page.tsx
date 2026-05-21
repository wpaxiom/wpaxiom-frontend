import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getPost, getPostSlugs, getPostCategory, getFeaturedImage, formatPostDate, estimateReadTime } from '@/lib/blog'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try {
    const slugs = await getPostSlugs()
    return slugs.map((slug) => ({ slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params
    const post = await getPost(slug)
    if (!post) return { title: 'Blog — wpaxiom' }
    const excerpt = post.excerpt.rendered.replace(/<[^>]+>/g, '').trim()
    return {
      title: `${post.title.rendered.replace(/<[^>]+>/g, '')} — wpaxiom`,
      description: excerpt.slice(0, 160),
    }
  } catch {
    return { title: 'Blog — wpaxiom' }
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  let post: Awaited<ReturnType<typeof getPost>>
  try {
    post = await getPost(slug)
  } catch {
    notFound()
  }

  if (!post) notFound()

  const image = getFeaturedImage(post)
  const category = getPostCategory(post)
  const date = formatPostDate(post.date)
  const readTime = estimateReadTime(post.content.rendered)
  const author = post._embedded?.author?.[0]

  return (
    <>
      {/* Breadcrumb nav */}
      <div className="border-b border-line/70 bg-surface/40">
        <div className="max-w-[1280px] mx-auto px-6 py-3">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-ink transition"
          >
            <ArrowLeft size={12} strokeWidth={2} />
            All posts
          </Link>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6">
        <div className="max-w-[760px] mx-auto py-12">
          {/* Category + meta */}
          <div className="flex items-center gap-3 text-xs font-mono text-muted mb-6 flex-wrap">
            <span className="px-2 py-0.5 rounded bg-elevated border border-line text-coral">
              {category}
            </span>
            <span>·</span>
            <time dateTime={post.date}>{date}</time>
            <span>·</span>
            <span>{readTime}</span>
          </div>

          {/* Title */}
          <h1
            className="text-4xl sm:text-5xl font-semibold tracking-[-0.025em] leading-[1.08] text-ink"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />

          {/* Author */}
          {author && (
            <div className="mt-6 flex items-center gap-3">
              {author.avatar_urls?.['48'] && (
                <Image
                  src={author.avatar_urls['48']}
                  alt={author.name}
                  width={36}
                  height={36}
                  className="rounded-full border border-line"
                />
              )}
              <span className="text-sm text-muted">{author.name}</span>
            </div>
          )}

          {/* Featured image */}
          {image && (
            <div className="mt-10 rounded-2xl overflow-hidden border border-line aspect-[16/9] relative bg-elevated">
              <Image
                src={image}
                alt={post.title.rendered.replace(/<[^>]+>/g, '')}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}

          {/* Content */}
          <article
            className="article-body mt-10"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />

          {/* Footer nav */}
          <div className="mt-16 pt-8 border-t border-line">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition"
            >
              <ArrowLeft size={14} strokeWidth={2} />
              Back to all posts
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
