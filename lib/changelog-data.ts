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
    version: '1.0.6',
    date: '2026-08-06',
    latest: true,
    summary: 'Every block’s settings redesigned around the parts you can see — with hover states and a consistent styling stack',
    changes: [
      { type: 'Improved', text: 'Redesigned block settings across every block. Each block’s sidebar is now split into Settings (what the block does) and Styles (how it looks), and the Styles tab is organised by the parts you can see — a Tab, a Card, an Icon, a Heading — instead of one long list of options. Border, shadow, and typography open in focused popovers, and each row shows its current value at a glance' },
      { type: 'Added', text: 'Normal / Hover / Active states on styleable parts — hover colors, backgrounds, and borders are now real controls rather than something baked into a preset' },
      { type: 'Added', text: 'A consistent styling stack on every part: colors, background (including gradients), border, radius, shadow, padding, size, and gap, with per-device values where it makes sense. Many parts that previously offered only a color now offer the full set' },
      { type: 'Improved', text: 'Every style control now shows the block’s actual shipped default instead of “None”, so resetting returns you to the original look rather than clearing the style' },
      { type: 'Removed', text: 'Tabs “Tab style” presets (Default / Pills / Underline / Boxed). Every look they produced is now built from the Styles rows on the Tab bar, Tab, and Panel parts. Existing tabs are converted once into those rows, so the design is preserved and now fully editable' },
      { type: 'Removed', text: 'Pricing Table “Card style” presets (Bordered / Filled / Minimal). Card styling now comes from the Styles → Cards rows, with a Featured tab for the highlighted plan. Tables using Filled or Minimal revert to the Bordered look and need restyling' },
      { type: 'Added', text: 'Tabs — Tab padding, Tab shadow, and per-state Tab border controls, a “Tab bar fits content” layout option, a fully-round radius range, and separate gap controls for tab-to-tab spacing, icon-to-label spacing, and the gap between the tab bar and the panel' },
      { type: 'Improved', text: 'Trust Badges — the “Card background” and “Card border” toggles are gone; both are now ordinary Styles rows on the Card part. Existing badges keep their appearance' },
      { type: 'Added', text: 'Reading Progress Bar — the fill accepts a gradient, and the block now supports HTML anchors' },
      { type: 'Improved', text: 'Testimonials — avatar/monogram size and weight moved to the block’s Monogram part, so one setting styles every card' },
      { type: 'Fixed', text: 'Advanced Button — outline-style buttons flickered on hover and showed the wrong border width, because the button changed size between its normal and hover states and shifted the layout out from under the pointer' },
      { type: 'Fixed', text: 'Reading Progress Bar dropped a custom CSS class added in the editor' },
      { type: 'Fixed', text: 'Table of Contents ignored per-device typography settings' },
      { type: 'Fixed', text: 'Border controls read “None” when a block’s shipped border applies to only one side' },
    ],
  },
  {
    plugin: 'axiom-blocks',
    version: '1.0.5',
    date: '2026-07-11',
    summary: 'Two new blocks — Content Slider and Table of Contents — and a redesigned colour picker',
    changes: [
      { type: 'Added', text: 'Content Slider block — a slider/carousel that holds any blocks per slide, with slide, fade, and coverflow effects, autoplay with loop and pause-on-hover, arrows and pagination (dots, fraction, or progress bar), drag and swipe, keyboard control, vertical orientation, responsive slides-per-view for desktop/tablet/mobile, adaptive height, and an optional click-to-zoom lightbox' },
      { type: 'Added', text: 'Table of Contents block — auto-built from your page headings, with numbered, bullet, or plain markers, nesting by heading level, smooth scroll with an adjustable offset, active-section highlight, a sticky sidebar that scrolls internally, a collapsible panel, a per-section reading-progress rail, copy-link on each heading, back-to-top, a mobile dock bar, and light or dark colour schemes' },
      { type: 'Improved', text: 'Redesigned colour picker on every colour control — an HSV canvas, the theme palette, Hex / RGB / HSL inputs, alpha, an eyedropper, and recent colours' },
    ],
  },
  {
    plugin: 'axiom-blocks',
    version: '1.0.4',
    date: '2026-06-29',
    summary: 'Responsive per-device controls, a shared custom icon library, and full deactivation survival',
    changes: [
      { type: 'Added', text: 'Responsive controls — set typography, columns, gap, alignment, spacing, and sizes independently for desktop, tablet, and mobile, with live previews that follow the editor’s device switcher' },
      { type: 'Added', text: 'Shared custom icon library — upload an SVG once and reuse it across any icon-supporting block (Icon, Icon List, Accordion, Notice, Counter, and Advanced Button); Advanced Button now draws from the full icon library' },
      { type: 'Improved', text: 'Deactivation survival — content authored in Axiom blocks stays visible on the front end even if the plugin is deactivated, across every block that previously depended on plugin markup' },
      { type: 'Improved', text: 'Advanced Section focal point picker replaced with native Axiom range controls for a consistent look' },
      { type: 'Fixed', text: 'Conditional-assets gate — eight blocks no longer render unstyled when used as the only Axiom block on a page' },
      { type: 'Fixed', text: 'Testimonials continuous marquee layout and Shape Divider transform rendering' },
      { type: 'Fixed', text: 'Color picker reset links now match each field’s default value, and spacing and typography reset buttons behave consistently' },
    ],
  },
  {
    plugin: 'axiom-blocks',
    version: '1.0.3',
    date: '2026-06-19',
    summary: 'New Info Box block — a styled container for an icon, heading, text, and button',
    changes: [
      { type: 'Added', text: 'Info Box block — a styled box that holds an Icon, Advanced Heading, text, and Advanced Button as fully editable blocks, with predefined Default / Bordered / Card / Accent styles and a live inserter preview. A single gap control sets the spacing between items, with stack or row direction, alignment, and box background, border, corner radius, and shadow presets' },
    ],
  },
  {
    plugin: 'axiom-blocks',
    version: '1.0.2',
    date: '2026-06-18',
    summary: 'Four new blocks — Accordion, Notice / Alert, Counter, and Testimonials',
    changes: [
      { type: 'Added', text: 'Accordion block — collapsible panels for FAQs and disclosures, with single-open mode, first-panel-open, heading level, icon position and rotation, expand/collapse all, deep linking, and optional FAQ schema (JSON-LD) for rich results' },
      { type: 'Added', text: 'Notice / Alert block — info, success, warning, or error styles with a matching icon, optional title, dismiss button, and custom colors, border radius, and typography' },
      { type: 'Added', text: 'Counter block — animated count-up statistics that run when scrolled into view, with icons, labels, prefixes and suffixes, custom decimal and thousands separators, per-stat cards, hover colors, and label positioning in a responsive row' },
      { type: 'Added', text: 'Testimonials block — social proof in a grid, carousel, or continuous marquee, with avatars or initials fallback, star ratings, quote icons, verified source badges, read-more clamping, and opt-in review schema (AggregateRating)' },
    ],
  },
  {
    plugin: 'axiom-blocks',
    version: '1.0.1',
    date: '2026-06-12',
    summary: 'Four new blocks and an opt-in deactivation feedback form',
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
    version: '1.0.5',
    date: '2026-07-07',
    latest: true,
    summary: 'Side-by-side product comparison, custom table and button styling, and full localization',
    changes: [
      { type: 'Added', text: 'Product comparison — shoppers add products to a compare tray and view their specification tables side by side in a slide-in drawer, with differing rows highlighted. Compared specs reuse the same mapping resolution as the Specifications tab, so what shoppers compare always matches what each product shows' },
      { type: 'Added', text: '“Add to compare” buttons for the single product page and the shop / archive loop, each independently toggled from Settings, plus a configurable maximum (2–4) of products per comparison' },
      { type: 'Added', text: '[specifico_compare ids="1,2,3"] shortcode and block to embed a comparison table on any page, and an optional dedicated compare page the drawer links to' },
      { type: 'Added', text: 'Custom appearance controls — pick a “Custom” style for the specification table and for the compare button, then set per-property values (padding, radius, colours, borders) that render as CSS custom properties; unset values fall back to sensible defaults' },
      { type: 'Improved', text: 'Full localization support — all remaining strings are translatable and the specifico.pot template is regenerated on build' },
    ],
  },
  {
    plugin: 'specifico',
    version: '1.0.4',
    date: '2026-06-30',
    summary: 'Export / import, migration from other specification plugins, and a redesigned admin UI',
    changes: [
      { type: 'Added', text: 'Export — download all your specification tables, groups, mapping rules, and settings (optionally including per-product specification data) as a single JSON file for backup or moving to another site' },
      { type: 'Added', text: 'Import — upload a Specifico export to restore it on any site; tables, groups, and products are matched by slug, so re-importing is safe and never creates duplicates' },
      { type: 'Added', text: 'Import from other specification plugins — upload a compatible JSON export and Specifico auto-detects the format and imports its tables, groups, and per-product specifications' },
      { type: 'Improved', text: 'Redesigned admin UI across every screen — cleaner layout, refined typography, an updated colour palette, consistent field heights, and better spacing' },
    ],
  },
  {
    plugin: 'specifico',
    version: '1.0.3',
    date: '2026-06-25',
    summary: 'Schema.org structured data for product specifications',
    changes: [
      { type: 'Added', text: 'Schema.org structured data — each product’s specifications are added to its existing Product structured data (JSON-LD) as additionalProperty entries, helping search engines understand the specs. It enriches WooCommerce’s structured data rather than adding a separate block, so there is only one Product entity per page, and the output mirrors the specifications shown on the page. Developers can adjust or disable it with the new specifico_structured_data filter' },
    ],
  },
  {
    plugin: 'specifico',
    version: '1.0.2',
    date: '2026-06-24',
    summary: 'Template overrides, developer hooks, a shortcode, and new display settings',
    changes: [
      { type: 'Added', text: 'Theme template override support — copy the specification table template into your theme to fully customize its markup' },
      { type: 'Added', text: 'Developer hooks (filters and actions) to rename the tab, reshape or hide rows and groups, add CSS classes, wrap the table, and format individual labels and values' },
      { type: 'Added', text: '[specifico] shortcode to display a product’s specification table anywhere — posts, pages, widgets, or the block editor — with an optional product ID' },
      { type: 'Added', text: 'Setting to customize the Specifications tab title' },
      { type: 'Added', text: 'Setting to keep, always remove, or remove only when specifications exist for WooCommerce’s default Additional information tab' },
      { type: 'Added', text: 'Documentation link on the Plugins screen' },
      { type: 'Fixed', text: 'Mapping screen no longer locks the Values field — existing mappings are editable, and changing the Type refreshes the available values' },
      { type: 'Improved', text: 'Consistent field and button heights, dashed section separators, and focus styles across all admin screens' },
    ],
  },
  {
    plugin: 'specifico',
    version: '1.0.1',
    date: '2026-06-23',
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
