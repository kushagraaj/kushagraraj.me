import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { marked } from 'marked'

const DIR = path.join(process.cwd(), 'content', 'blog')

export type PostMeta = { slug: string; title: string; date: string; description?: string; tags: string[] }

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
}

function toMeta(slug: string, data: Record<string, unknown>): PostMeta {
  return {
    slug,
    title: String(data.title ?? slug),
    date: new Date((data.date as string) ?? 0).toISOString(),
    description: data.description ? String(data.description) : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
  }
}

export async function getAllPosts(): Promise<PostMeta[]> {
  let files: string[] = []
  try {
    files = await fs.readdir(DIR)
  } catch {
    return []
  }
  const posts = await Promise.all(
    files
      .filter((f) => f.endsWith('.md'))
      .map(async (file) => {
        const { data } = matter(await fs.readFile(path.join(DIR, file), 'utf8'))
        return toMeta(file.replace(/\.md$/, ''), data)
      }),
  )
  return posts.sort((a, b) => b.date.localeCompare(a.date))
}

export async function getPost(slug: string) {
  if (!/^[a-z0-9-]+$/i.test(slug)) return null
  try {
    const raw = await fs.readFile(path.join(DIR, `${slug}.md`), 'utf8')
    const { data, content } = matter(raw)
    let html = await marked.parse(content)
    // open outside links in a new tab
    html = html.replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"')
    html = html.replace(/<img /g, '<img loading="lazy" referrerpolicy="no-referrer" ')
    return { ...toMeta(slug, data), html }
  } catch {
    return null
  }
}
