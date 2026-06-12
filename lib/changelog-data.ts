export type ChangeType = 'Added' | 'Improved' | 'Fixed' | 'Removed'

export type ChangeItem = {
  type: ChangeType
  text: string
}

export type ChangelogEntry = {
  plugin: 'axiom-blocks' | 'cartick' | 'specifico'
  version: string
  date: string
  latest?: boolean
  summary: string
  changes: ChangeItem[]
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    plugin: 'axiom-blocks',
    version: '1.0.1',
    date: '2026-06-12',
    latest: true,
    summary: 'Five new blocks and an opt-in deactivation feedback form',
    changes: [
      { type: 'Added', text: 'Advanced Heading block — highlight spans, an optional sub-heading above or below, an accent line, and independent typography control on both the heading and sub-heading' },
      { type: 'Added', text: 'Icon block — pick from the icon library or paste your own SVG, with size, color, rotation, hover color, shape backgrounds, border, and link options' },
      { type: 'Added', text: 'Icon List block — a per-row icon for features, benefits, or checklists, in vertical or horizontal layout, with optional dividers and independent icon and text styling' },
      { type: 'Added', text: 'Advanced Button block — leading or trailing icons, an optional sub-caption, style and size presets, hover states, shadows, an icon-only mode, and row or stack layout with alignment and gap controls when you add more than one' },
      { type: 'Added', text: 'Optional, opt-in deactivation feedback form — nothing is sent unless you choose a reason and submit, and no personal data or site content is ever collected' },
    ],
  },
  {
    plugin: 'axiom-blocks',
    version: '1.0.0',
    date: '2026-06-10',
    summary: 'Initial release — 12 blocks for the WordPress block editor',
    changes: [
      { type: 'Added', text: 'Tabs block — horizontal and vertical orientations, four style presets, keyboard navigation, and ARIA tab roles' },
      { type: 'Added', text: 'Pricing Table block — parent/child pair with plan cards, recommended highlight, feature lists, and per-plan CTAs' },
      { type: 'Added', text: 'Advanced Section block — full-width container with background image, video, gradient, overlay, and min-height controls' },
      { type: 'Added', text: 'Before/After Slider block — drag handle, click-to-jump, keyboard support, and CSS custom property theming' },
      { type: 'Added', text: 'Countdown Timer block — target date, four display units, expired state (message, hide, or redirect)' },
      { type: 'Added', text: 'Copy to Clipboard block — button-only and input+button modes, customisable copied label, icon position' },
      { type: 'Added', text: 'Star Rating block — full, half, and any precision; numeric value and review count display' },
      { type: 'Added', text: 'Shape Divider block — five SVG shapes with flip, height, and color controls' },
      { type: 'Added', text: 'Device Visibility block — show or hide inner blocks per breakpoint (desktop, tablet, mobile)' },
      { type: 'Added', text: 'Reading Progress Bar block — fixed top/bottom position, ARIA progressbar, escapes CSS containing blocks' },
      { type: 'Added', text: 'Trust Badges block — preset badge groups, custom badge support, grid/horizontal layout, brand and monochrome color modes' },
      { type: 'Added', text: 'Free Shipping Progress block — WooCommerce cart integration, auto or custom threshold, live updates via REST' },
      { type: 'Added', text: 'Pro license system — activate, deactivate, and background auto-resync from the Axiom Blocks Settings tab' },
    ],
  },
  {
    plugin: 'cartick',
    version: '1.0.2',
    date: '2024-02-02',
    latest: true,
    summary: 'High-Performance Order Storage (HPOS) support',
    changes: [
      { type: 'Added', text: 'Enabled High-Performance Order Storage (HPOS) compatibility' },
    ],
  },
  {
    plugin: 'specifico',
    version: '1.0.1',
    date: '2026-05-17',
    latest: true,
    summary: 'Editable inherited values, inline Add / Edit, and admin polish',
    changes: [
      { type: 'Added', text: 'Per-product value overrides when inheriting from a mapping — labels stay locked to the mapping while values are editable for each product' },
      { type: 'Added', text: 'Show / Hide toggle on the product metabox so inherited fields stay collapsed by default' },
      { type: 'Added', text: 'Start over link in Customize mode to swap between starting blank or copying an existing table after a choice has been made' },
      { type: 'Improved', text: 'Add / Edit Specification now uses an inline panel matching the Groups screen — no more modal' },
      { type: 'Improved', text: 'Cancel button on Add / Edit forms; Save is disabled until the title is filled' },
      { type: 'Improved', text: 'Row action menu now has pencil / trash icons, closes on outside click, and auto-closes after picking an action' },
      { type: 'Improved', text: 'Themed multi-select chips, dropdown options, and focus states to match the plugin palette; redundant clear-all X removed (per-chip X kept)' },
      { type: 'Improved', text: 'Pagination simplified to "1-10 of N" with chevron prev / next controls' },
      { type: 'Improved', text: 'Mapping page rows now have placeholder hints, larger fields, and a properly sized delete button' },
      { type: 'Improved', text: 'Semibold table headers and dashed separators between Add / Edit form sections' },
      { type: 'Fixed', text: 'Plugin styles no longer leak into the WordPress dashboard — buttons no longer briefly show an unexpected border on first load of unrelated admin pages' },
      { type: 'Fixed', text: 'Add / Edit form fields no longer carry the previously edited title when switching from Edit to Add' },
      { type: 'Fixed', text: 'Row action dropdown now closes after clicking Edit (no more lingering menu behind the form)' },
      { type: 'Fixed', text: 'Dashed row separators on Mapping and Add Group screens render correctly' },
      { type: 'Fixed', text: 'Toggle switch knob now visually slides when toggled' },
    ],
  },
  {
    plugin: 'specifico',
    version: '1.0.0',
    date: '2024-12-22',
    summary: 'Initial release',
    changes: [
      { type: 'Added', text: 'Initial release' },
    ],
  },
  {
    plugin: 'cartick',
    version: '1.0.1',
    date: '2024-01-22',
    summary: 'Bug fix release',
    changes: [
      { type: 'Fixed', text: 'Fixed data type declaration issue' },
    ],
  },
  {
    plugin: 'cartick',
    version: '1.0.0',
    date: '2024-01-20',
    summary: 'Initial release',
    changes: [
      { type: 'Added', text: 'Initial release' },
    ],
  },
]

export const PLUGINS = [
  { id: 'axiom-blocks', label: 'Axiom Blocks' },
  { id: 'cartick', label: 'Cartick' },
  { id: 'specifico', label: 'Specifico' },
] as const
