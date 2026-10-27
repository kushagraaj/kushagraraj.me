import { Intro } from '@/components/intro'
import { LocationMap } from '@/components/location-map'
import { NowPlaying } from '@/components/now-playing'
import { PostList } from '@/components/post-list'
import { ProjectsTimeline } from '@/components/projects-timeline'
import { Section } from '@/components/section'
import { getAllPosts } from '@/lib/blog'

export default async function Home() {
  const posts = await getAllPosts()

  return (
    <>
      <Intro />

      <div className="mt-10 flex items-start gap-4 sm:gap-6">
        <LocationMap />
        <div className="flex min-w-0 flex-1 flex-col items-center gap-4 pt-1 sm:gap-6 sm:pt-2">
          <div className="min-w-0 max-w-full">
            <NowPlaying />
          </div>
        </div>
      </div>

      <Section title="Projects">
        <ProjectsTimeline />
      </Section>

      {posts.length > 0 && (
        <Section title="Writing">
          <PostList posts={posts} />
        </Section>
      )}
    </>
  )
}
