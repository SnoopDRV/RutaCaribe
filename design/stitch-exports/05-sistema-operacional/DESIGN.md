---
name: Transcaribe Operational System
colors:
  surface: '#f7f9ff'
  surface-dim: '#d2dbe6'
  surface-bright: '#f7f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#ecf4ff'
  surface-container: '#e6effa'
  surface-container-high: '#e0e9f4'
  surface-container-highest: '#dae3ef'
  on-surface: '#141c24'
  on-surface-variant: '#584237'
  inverse-surface: '#29313a'
  inverse-on-surface: '#e9f2fd'
  outline: '#8c7166'
  outline-variant: '#e0c0b2'
  surface-tint: '#a04100'
  primary: '#a04100'
  on-primary: '#ffffff'
  primary-container: '#f37021'
  on-primary-container: '#541f00'
  inverse-primary: '#ffb693'
  secondary: '#525f71'
  on-secondary: '#ffffff'
  secondary-container: '#d3e1f6'
  on-secondary-container: '#566475'
  tertiary: '#545f73'
  on-tertiary: '#ffffff'
  tertiary-container: '#8c97ad'
  on-tertiary-container: '#242f42'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcb'
  primary-fixed-dim: '#ffb693'
  on-primary-fixed: '#341000'
  on-primary-fixed-variant: '#7a3000'
  secondary-fixed: '#d6e4f9'
  secondary-fixed-dim: '#bac8dc'
  on-secondary-fixed: '#0f1c2c'
  on-secondary-fixed-variant: '#3a4859'
  tertiary-fixed: '#d8e3fb'
  tertiary-fixed-dim: '#bcc7de'
  on-tertiary-fixed: '#111c2d'
  on-tertiary-fixed-variant: '#3c475a'
  background: '#f7f9ff'
  on-background: '#141c24'
  surface-variant: '#dae3ef'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '800'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 26px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 22px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '800'
    lineHeight: 12px
    letterSpacing: 0.06em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

The design system embodies the civic utility and infrastructure of Cartagena’s public bus rapid transit network. The interface prioritizes rapid legibility, ruthless operational clarity, and immediate reassurance under intense, glare-heavy Caribbean ambient light. The target audience encompasses daily commuters, transit operators, and municipal dispatchers moving quickly through congested urban environments.

The visual style combines **High-Contrast Civic Utility** with structural minimalism. Visual elements eliminate decorative embellishments in favor of precise spatial boundaries, tabular alignments, and unambiguous informational hierarchy. The emotional signature is reliable, resilient, and direct—transforming complex, fast-changing transit data into split-second operational decisions.

## Colors

The palette is engineered for maximum perceptual contrast, combating high solar glare while maintaining strict accessibility standards:

- **Primary Transit Orange (`#F37021`)**: Serves as the primary operational accent, route indicator, action trigger, and system identifier. It communicates momentum and civic identity without degrading text contrast.
- **Deep Navy Slate (`#0D1B2A`)**: The anchor structural tone. Used for dominant headings, top navigation anchors, high-priority state chips, and solid high-contrast surfaces.
- **Secondary Slate (`#1E293B`)**: Applied to supporting architectural frameworks, tab bars, high-contrast borders, and secondary data readouts.
- **Neutral Tint (`#717A84`)**: Dedicated to tertiary metadata, boundary strokes, and subdued secondary body text.

### Operational Alert Signals
- **Critical Interruption / Urgent (`#D32F2F`)**: System stoppages, route closures, incident flags.
- **Operational Advisory / Warning (`#E65100`)**: Schedule deviations, heavy station congestion, approaching headways.
- **Clearance / Normal Operation (`#059669`)**: On-time arrival, active validation, operational payment gates.

## Typography

Typography relies entirely on **Inter** to maximize structural legibility, vertical symmetry, and numerical clarity. Data points, arrival times, and platform IDs leverage tabular figures (`tnum`) to eliminate micro-shifts during real-time GPS telemetry updates. Letter spacing is compressed on major headlines for commanding density, while small uppercase labels incorporate positive tracking (`0.04em`–`0.06em`) to preserve character separation under low-resolution conditions or direct sunlight.

## Layout & Spacing

The layout model is a dense, high-efficiency grid optimized for operational handheld devices and fixed transit kiosks:

- **Mobile Viewports (< 640px)**: 4-column fluid layout, `0.75rem` gutters, `1rem` lateral screen margins. Compact vertical padding prioritizes displaying arrival streams and active alerts above the fold without requiring immediate scrolling.
- **Tablet / In-Vehicle Terminals (640px - 1024px)**: 8-column layout, `1rem` gutters, `1.5rem` outer margins. Utilizes split-view arrangements (e.g., live route diagram paired with scheduled stops).
- **Desktop / Dispatch Screens (> 1024px)**: 12-column layout capped at `1440px`, `1rem` gutters, `1.5rem` outer margins. Enables concurrent data dense telemetry grids.

Spacing follows an uncompromising, rhythmically tight `0.25rem` (4px) scale to pack critical context into single screen viewports without visual clutter.

## Elevation & Depth

To avoid visual degradation and muddy rendering under direct tropical sun, this system eschews soft, diffused ambient shadows and translucent blurs. Visual layering is achieved exclusively through **Tonal Surface Stacking** and **Crisp Structural Borders**:

1. **Base Foundation**: Crisp pure canvas (`#FFFFFF`) or tinted neutral foundation (`#F8FAFC`).
2. **Component Panels & Route Containers**: Flat surfaces demarcated by high-contrast `1px` or `2px` solid borders (`#E2E8F0` or `#0D1B2A`), ensuring structural boundaries remain distinct at all viewing angles.
3. **Floating Controls & Modals**: Layered with a high-contrast offset: `0px 4px 0px 0px #0D1B2A` or a sharp, low-blur black drop shadow (`0px 4px 12px rgba(13, 27, 42, 0.16)`).
4. **Active/Pressed States**: Elements snap inward flush with the container boundary, providing tactile confirmation for field touchscreens.

## Shapes

The design system enforces a **Soft** border curvature (`roundedness: 1` / `0.25rem` base, `0.5rem` for cards, `0.75rem` for floating modules). This geometric precision mirrors industrial vehicle design, physical platform signage, and metallic infrastructure. Interactive components use slight, controlled softening to optimize touch-target recognition while maintaining an authoritative municipal identity. Fully round pill shapes are reserved exclusively for compact status badges, line codes, and transfer chips.

## Components

### Buttons
- **Primary Operational Action**: Solid Transit Orange (`#F37021`) background with high-contrast White text. `0.25rem` radius, bold uppercase label (`label-lg`), zero shadow, min-height `48px` to guarantee physical touch accessibility.
- **Secondary / Administrative**: Deep Navy Slate (`#0D1B2A`) background with White text, or pure White background with `2px` solid `#0D1B2A` border.
- **Destructive**: Deep Red (`#D32F2F`) solid or crisp `2px` border with matching red label.

### Route Badges & Status Chips
- **Bus Line Identifiers (e.g., T101, X104, T103)**: High-density rounded capsules (`0.25rem` or full pill). Inverted styling: `#0D1B2A` fill with white tabular text, or route-designated color fills with crisp, high-contrast borders.
- **Status Indicators**: Compact chips carrying an operational state (e.g., "ON TIME", "CONGESTED", "OUT OF SERVICE"). Fixed height `24px`, bold uppercase typography (`label-sm`), strictly adhering to the semantic alert palette.

### Station & Arrival Lists
- Rows feature fixed minimal heights, separated by sharp `1px` hairline rules (`#E2E8F0`).
- Real-time arrival readouts are right-aligned, rendered in bold `Inter` with tabular figures (e.g., `3 min`, `12 min`) paired with live pulse status dots.

### Input Fields & Search Bars
- Background set to neutral white with an explicit `1.5px` solid border (`#1E293B`).
- Active focus state increases stroke to `2px` solid Transit Orange (`#F37021`) with no fuzzy outer glow.
- Embedded trailing clear buttons and transit icon adornments use solid high-contrast monochrome fills.

### Transit Cards
- Surfaces maintain flat white or very light slate (`#F8FAFC`) fills framed by structural `1px` borders (`#CBD5E1`).
- Card headers utilize integrated Deep Navy ribbons or direct orange route striping along the left edge (thickness: `4px`) to visually group lines and terminal designations instantly.

### Checkboxes & Segmented Selectors
- Checkboxes use square, sharp boundaries (`0.125rem` radius) with high-contrast Navy checked fills.
- Segmented mode toggles (e.g., "Troncal" vs. "Pretroncal" vs. "Alimentador") feature edge-to-edge container tabs with high-contrast active tabs in `#0D1B2A` and white typography.