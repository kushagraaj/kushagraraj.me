import type { Metadata } from 'next'
import Link from 'next/link'
import { PostList } from '@/components/post-list'
import { Section } from '@/components/section'
import { ThemeRuler } from '@/components/theme-ruler'
import { getAllPosts } from '@/lib/blog'

export const metadata: Metadata = { title: 'writing' }

export default async function BlogIndex() {
  const posts = await getAllPosts()
  return (
    <>
      <div className="flex items-center justify-between">
        <Link href="/" className="chip !ml-0 font-mono text-[11px]">
          ← home
        </Link>
        <ThemeRuler />
      </div>
      <Section title="Writing">
        <PostList posts={posts} />
      </Section>
    </>
  )
}
