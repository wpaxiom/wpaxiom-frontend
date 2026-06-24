import { notFound, redirect } from 'next/navigation'
import { DOC_NAV } from '@/lib/docs-nav'

type Props = { params: Promise<{ plugin: string }> }

export function generateStaticParams() {
  return Object.keys(DOC_NAV).map((plugin) => ({ plugin }))
}

// The plugin doc root (e.g. /docs/specifico) has no page of its own — send
// visitors to the plugin's first article so the URL doesn't 404.
export default async function PluginDocsIndex({ params }: Props) {
  const { plugin } = await params
  const nav = DOC_NAV[plugin]
  const firstSlug = nav?.categories[0]?.articles[0]?.slug

  if (!nav || !firstSlug) {
    notFound()
  }

  redirect(`/docs/${plugin}/${firstSlug}`)
}
