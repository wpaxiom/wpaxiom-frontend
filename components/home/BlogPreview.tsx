import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getPosts, getPostCategory, getFeaturedImage, formatPostDate, estimateReadTime } from "@/lib/blog";

export async function BlogPreview() {
  let posts = []
  try {
    const data = await getPosts(3)
    posts = data.posts
  } catch {
    return null
  }

  if (posts.length === 0) return null

  return (
    <section className="border-b border-line/70 bg-surface/30">
      <div className="max-w-[1280px] mx-auto px-6 py-24">
        <div className="flex items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-coral mb-3">
              // From the journal
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Notes on building plugins.</h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink transition"
          >
            View all posts <ArrowRight size={14} strokeWidth={2} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
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
                  <div className="flex items-center gap-3 text-xs text-muted font-mono">
                    <span className="px-2 py-0.5 rounded bg-elevated border border-line text-coral">
                      {category}
                    </span>
                    <span>·</span>
                    <span>{date}</span>
                    <span>·</span>
                    <span>{readTime}</span>
                  </div>
                  <h3
                    className="mt-4 text-lg font-semibold tracking-tight leading-snug group-hover:text-coral transition"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                  <p
                    className="mt-2 text-sm text-muted leading-relaxed line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered.replace(/<[^>]+>/g, '') }}
                  />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
