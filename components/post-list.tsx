import Link from 'next/link'
import { formatDate, type PostMeta } from '@/lib/blog'

export function PostList({ posts }: { posts: PostMeta[] }) {
  return (
    <>
      {posts.map((post) => (
        <Link key={post.slug} href={`/blog/${post.slug}`} className="row text-[15px]">
          <span className="min-w-0 truncate">{post.title}</span>
          <span className="row-muted ml-auto shrink-0 font-mono text-[11px]">{formatDate(post.date)}</span>
        </Link>
      ))}
    </>
  )
}
