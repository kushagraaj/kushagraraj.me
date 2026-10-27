import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ThemeRuler } from '@/components/theme-ruler'
import { formatDate, getAllPosts, getPost } from '@/lib/blog'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await getAllPosts()).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug)
  return post ? { title: post.title.toLowerCase(), description: post.description } : {}
}

export default async function PostPage({ params }: Props) {
  const post = await getPost((await params).slug)
  if (!post) notFound()

  return (
    <article>
      <div className="flex items-center justify-between">
        <Link href="/blog" className="chip !ml-0 font-mono text-[11px]">
          ← writing
        </Link>
        <ThemeRuler />
      </div>
      <h1 className="mt-8 text-[22px] font-medium leading-tight tracking-[-0.02em]">{post.title}</h1>
      <p className="mt-2 flex gap-3 font-mono text-[11px]" style={{ color: 'var(--muted)' }}>
        <span>{formatDate(post.date)}</span>
        {post.tags.map((t) => (
          <span key={t}>#{t}</span>
        ))}
      </p>
      <div className="prose mt-8 text-[15px]" dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  )
}
