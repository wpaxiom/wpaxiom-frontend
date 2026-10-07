export type StatItem = {
  value: string
  label: string
  emphasis?: boolean
}

export const SITE_STATS: StatItem[] = [
  { value: '3', label: 'Focused plugins' },
  { value: 'GPLv2', label: 'Open-source license' },
  { value: '49', label: 'Documentation guides' },
  { value: 'Native', label: 'WordPress foundation' },
]

export const WP_PROFILE_URL = 'https://profiles.wordpress.org/wpaxiom/'
