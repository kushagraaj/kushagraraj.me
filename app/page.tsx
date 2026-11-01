import { AuraDeckLazy } from '@/components/aura-deck-lazy'
import { Intro } from '@/components/intro'
import { LocationMap } from '@/components/location-map'
import { NowPlaying } from '@/components/now-playing'
import { PostList } from '@/components/post-list'
import { Timeline } from '@/components/projects-timeline'
import { Section } from '@/components/section'
import { getAllPosts } from '@/lib/blog'
import { site } from '@/lib/site'

export default async function Home() {
  const posts = await getAllPosts()

  return (
    <>
      <Intro />

      {/* phones: map and card deck side by side, music centred underneath.
          desktop: map on the left, music above the deck on the right. */}
      <div className="mt-10 grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-4 gap-y-8 sm:items-start sm:gap-x-6 sm:gap-y-6">
        <div className="col-start-1 row-start-1 sm:row-span-2">
          <LocationMap />
        </div>
        <div className="col-start-2 row-start-1 flex justify-center sm:row-start-2">
          <AuraDeckLazy />
        </div>
        <div className="col-span-2 row-start-2 flex min-w-0 justify-center sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:pt-2">
          <div className="min-w-0 max-w-full">
            <NowPlaying />
          </div>
        </div>
      </div>

      <Section title="Projects">
        <Timeline items={site.projects} />
      </Section>

      {posts.length > 0 && (
        <Section title="Writing">
          <PostList posts={posts} />
        </Section>
      )}
    </>
  )
}
