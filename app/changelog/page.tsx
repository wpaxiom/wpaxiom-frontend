import type { Metadata } from 'next'
import { CHANGELOG } from '@/lib/changelog-data'
import { ChangelogHero } from '@/components/changelog/ChangelogHero'
import { ChangelogFilterBar } from '@/components/changelog/ChangelogFilterBar'
import { ChangelogTimeline } from '@/components/changelog/ChangelogTimeline'

export const metadata: Metadata = {
  title: 'Changelog — wpaxiom',
  description: "What's new across all wpaxiom plugins — Axiom Blocks, Cartick, and Specifico.",
}

export default function ChangelogPage() {
  return (
    <>
      <ChangelogHero />
      <ChangelogFilterBar activePlugin="all" />
      <ChangelogTimeline entries={CHANGELOG} />
    </>
  )
}
