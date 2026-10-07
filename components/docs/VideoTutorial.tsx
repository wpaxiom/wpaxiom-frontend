type VideoTutorialProps = {
  videoId: string
  title: string
}

export function VideoTutorial({ videoId, title }: VideoTutorialProps) {
  return (
    <figure className="my-8">
      <div className="aspect-video overflow-hidden rounded-xl border border-line bg-surface">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={title}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      <figcaption className="mt-3 text-sm text-muted">
        {title} — WPAxiom on YouTube
      </figcaption>
    </figure>
  )
}
