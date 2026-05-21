export type StatItem = {
  value: string
  label: string
  emphasis?: boolean
}

export const SITE_STATS: StatItem[] = [
  { value: '3', label: 'Plugins' },
  { value: 'Free', label: 'Core plugin, always' },
  { value: '<14kb', label: 'Median JS payload' },
  { value: '99 / 100', label: 'PageSpeed mobile' },
]

export const WP_PROFILE_URL = 'https://profiles.wordpress.org/wpaxiom/'
