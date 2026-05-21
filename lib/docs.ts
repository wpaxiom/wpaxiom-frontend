import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CONTENT_DIR = path.join(process.cwd(), 'content/docs')

export type DocFrontmatter = {
  title: string
  category: string
  updatedAt: string
  readTime: number
  prev?: { title: string; slug: string }
  next?: { title: string; slug: string }
}

export type DocHeading = {
  level: 2 | 3
  text: string
  id: string
}

export async function getDoc(plugin: string, slug: string) {
  const filePath = path.join(CONTENT_DIR, plugin, `${slug}.mdx`)
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  return { frontmatter: data as DocFrontmatter, content }
}

export function getAllDocSlugs(): { plugin: string; slug: string }[] {
  if (!fs.existsSync(CONTENT_DIR)) return []
  const plugins = fs.readdirSync(CONTENT_DIR)
  const slugs: { plugin: string; slug: string }[] = []
  for (const plugin of plugins) {
    const pluginDir = path.join(CONTENT_DIR, plugin)
    if (!fs.statSync(pluginDir).isDirectory()) continue
    const files = fs.readdirSync(pluginDir)
    for (const file of files) {
      if (file.endsWith('.mdx')) {
        slugs.push({ plugin, slug: file.replace('.mdx', '') })
      }
    }
  }
  return slugs
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function extractHeadings(content: string): DocHeading[] {
  const headings: DocHeading[] = []
  const lines = content.split('\n')
  for (const line of lines) {
    const h2 = line.match(/^## (.+)/)
    const h3 = line.match(/^### (.+)/)
    if (h2) {
      headings.push({ level: 2, text: h2[1], id: slugify(h2[1]) })
    } else if (h3) {
      headings.push({ level: 3, text: h3[1], id: slugify(h3[1]) })
    }
  }
  return headings
}
