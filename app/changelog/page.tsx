import { CHANGELOG } from '@/lib/changelog-data'
import { createPageMetadata } from '@/lib/seo'
import { ChangelogHero } from '@/components/changelog/ChangelogHero'
import { ChangelogFilterBar } from '@/components/changelog/ChangelogFilterBar'
import { ChangelogTimeline } from '@/components/changelog/ChangelogTimeline'

export const metadata = createPageMetadata({
  title: 'Changelog — wpaxiom',
  description: "What's new across all wpaxiom plugins — Axiom Blocks, Cartick, and Specifico.",
  path: '/changelog',
})

export default function ChangelogPage() {
  return (
    <>
      <ChangelogHero />
      <ChangelogFilterBar activePlugin="all" />
      <ChangelogTimeline entries={CHANGELOG} />
    </>
  )
}
