const WP_API = process.env.WORDPRESS_API_URL ?? 'https://api.wpaxiom.com/wp-json'

export type WPPost = {
  id: number
  slug: string
  status: string
  date: string
  modified: string
  title: { rendered: string }
  excerpt: { rendered: string }
  content: { rendered: string }
  featured_media: number
  categories: number[]
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
      alt_text: string
      media_details: {
        sizes: Record<string, { source_url: string; width: number; height: number }>
      }
    }>
    'wp:term'?: Array<
      Array<{ id: number; name: string; slug: string; taxonomy: string }>
    >
    author?: Array<{ name: string; avatar_urls: Record<string, string> }>
  }
}

async function wpFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${WP_API}${path}`, {
    next: { revalidate: 3600 },
    headers: { 'User-Agent': 'wpaxiom-frontend/1.0' },
  })
  if (!res.ok) throw new Error(`WP API error: ${res.status} ${path}`)
  return res.json()
}

export async function getPosts(perPage = 10, page = 1): Promise<{ posts: WPPost[]; total: number; totalPages: number }> {
  const res = await fetch(
    `${WP_API}/wp/v2/posts?per_page=${perPage}&page=${page}&_embed&status=publish`,
    {
      next: { revalidate: 3600 },
      headers: { 'User-Agent': 'wpaxiom-frontend/1.0' },
    }
  )
  if (!res.ok) throw new Error(`WP API error: ${res.status}`)
  const all: WPPost[] = await res.json()
  const posts = all.filter((p) => p.status === 'publish')
  const total = parseInt(res.headers.get('X-WP-Total') ?? '0', 10)
  const totalPages = parseInt(res.headers.get('X-WP-TotalPages') ?? '1', 10)
  return { posts, total, totalPages }
}

export async function getPost(slug: string): Promise<WPPost | null> {
  const posts = await wpFetch<WPPost[]>(`/wp/v2/posts?slug=${slug}&_embed&status=publish`)
  const post = posts.find((p) => p.status === 'publish') ?? null
  return post
}

export async function getPostSlugs(): Promise<string[]> {
  const posts = await wpFetch<WPPost[]>(`/wp/v2/posts?per_page=100&fields=slug,status&status=publish`)
  return posts.filter((p) => p.status === 'publish').map((p) => p.slug)
}

export function getPostCategory(post: WPPost): string {
  const categories = post._embedded?.['wp:term']?.[0]?.filter((t) => t.taxonomy === 'category')
  return categories?.[0]?.name ?? 'Journal'
}

export function getFeaturedImage(post: WPPost): string | null {
  const media = post._embedded?.['wp:featuredmedia']?.[0]
  return (
    media?.media_details?.sizes?.['medium_large']?.source_url ??
    media?.media_details?.sizes?.['large']?.source_url ??
    media?.source_url ??
    null
  )
}

export function formatPostDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function estimateReadTime(content: string): string {
  const words = content.replace(/<[^>]+>/g, '').split(/\s+/).length
  const minutes = Math.max(1, Math.round(words / 200))
  return `${minutes} min read`
}
