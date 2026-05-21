import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CHANGELOG, PLUGINS } from '@/lib/changelog-data'
import { ChangelogHero } from '@/components/changelog/ChangelogHero'
import { ChangelogFilterBar } from '@/components/changelog/ChangelogFilterBar'
import { ChangelogTimeline } from '@/components/changelog/ChangelogTimeline'

type Props = { params: Promise<{ plugin: string }> }

const PLUGIN_LABELS: Record<string, string> = {
  'axiom-blocks': 'Axiom Blocks',
  cartick: 'Cartick',
  specifico: 'Specifico',
}

export function generateStaticParams() {
  return PLUGINS.map((p) => ({ plugin: p.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { plugin } = await params
  const label = PLUGIN_LABELS[plugin]
  if (!label) return { title: 'Changelog — wpaxiom' }
  return {
    title: `${label} Changelog — wpaxiom`,
    description: `Release history for ${label}.`,
  }
}

export default async function PluginChangelogPage({ params }: Props) {
  const { plugin } = await params
  const validPlugins = PLUGINS.map((p) => p.id as string)
  if (!validPlugins.includes(plugin)) notFound()

  const entries = CHANGELOG.filter((e) => e.plugin === plugin)

  return (
    <>
      <ChangelogHero />
      <ChangelogFilterBar activePlugin={plugin} />
      <ChangelogTimeline entries={entries} />
    </>
  )
}
