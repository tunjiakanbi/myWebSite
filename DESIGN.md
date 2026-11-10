# Design system: tunjiakanbi.com

A dark, geometric portfolio. The character comes from three things: a deep violet ground,
flat geometric decoration (dots, hatches, circles, rounded blocks) and the Pirulen display face.
Everything else stays quiet so those three carry the look.

This file records the decisions. `css/style.scss` holds the same values as variables. Use the
names, not raw values.

_Direction is built from the existing site and its brand. It was not derived from a comparison
with other websites._

## Colour

One ground, one surface, three accents. Every colour has one job.

| Token | Value | Role |
|---|---|---|
| `$mediumBlue` | `#280078` | Page ground |
| `$darkBlue` | `#170046` | Surfaces that sit on the ground: nav, footer, cards, form panel, lightbox controls |
| `$white` | `#ffffff` | Body text, borders on cards |
| `$lime` | `#ebf3cd` | Brand name, quiet emphasis, icon strokes |
| `$torqoise` | `#66d6d4` | **Primary**: links, buttons, the selected state |
| `$gold` | `#c4b900` | **Accent**: labels, tech-stack lines, the keyboard focus ring |
| `$seaBlue` | `#64a7e9` | Second line of the role list and decoration only. Not for body copy: it reads as a link |
| `$green` `#66a293`, `$darkGray` `#707070`, `$myBlack` `#080909` | | Decoration blocks and the lightbox backdrop only |

Contrast on the ground (`#280078`): white 15.4, lime 13.4, torqoise 8.9, gold 7.6, seaBlue 6.1.
All pass 4.5:1. `$darkGray` (3.1) must never carry text.
Text placed on a torqoise or gold fill is `$darkBlue` (10.8 and 9.1).

There is one theme. No light mode.

## Typography

Two families.

| Family | Use | File |
|---|---|---|
| **Pirulen** (`$pirulen`) | Display only: role list on the home page, page titles (Gallery, Contact), short labels. Never for sentences longer than a line | `fonts/pirulen rg.ttf` |
| **Outfit** (`$font-sans`) | Everything else | `fonts/outfit-variable.woff2`, one variable file, weights 100 to 900, SIL Open Font License |

Both load with `font-display: swap`, so text is visible while fonts load.

Hierarchy comes from weight and size, not from more typefaces:

| Level | Font | Size | Weight | Notes |
|---|---|---|---|---|
| Project title | Outfit | 2.5em (40px) | 800 | torqoise |
| Page title | Pirulen | 1.15em | default | lime or white |
| Section title (About) | Outfit | 1.25em | 700 | uppercase, gold with a lime name |
| Brand (nav) | Outfit | 1.5em | 700 | uppercase, lime |
| Sub-heading (tech stack) | Outfit | 1.5em | 500 | gold |
| Body | Outfit | 16px | 400 | white, line-height 1.6, no letter-spacing, max width 34em (about 65 to 75 characters) |
| Nav links | Outfit | 16px | 400 | uppercase, torqoise |
| Label / caption | Outfit | 0.75em to 0.8em | 600 | uppercase, letter-spacing 0.04em to 0.12em |

Rules:
- Body text is never below 16px. Labels are never below 12px.
- No thin weights for body text on the dark ground.
- No letter-spacing on sentences. Letter-spacing is for short uppercase labels only.

## Spacing

Base unit 0.5em (8px). Use 0.5, 0.75, 1, 1.5, 2.5 and 5em.
Page gutters: 1.5em on phones, 2.5em from 1024px, 5em from 1366px.
Breakpoints: 576px, 1024px, 1366px. Tall-screen rules at 1080px height.

## Shape and depth

| Token | Value | Use |
|---|---|---|
| Card radius | 1em | Cards, panels, the photo frame, the gallery viewer |
| Control radius | 0.5em | Buttons, tabs, inputs, thumbnails |
| Round | 50% | Circular decoration and icon buttons only |

Borders are 1px white (or white at 20 to 35% for dividers). **No shadows, no gradients, no blur.**
Depth comes from the darker surface colour on the lighter ground.

## Components

- **Button (primary)**: one style for every button on the site ("View Project", "Submit",
  viewer controls). Outline in torqoise, torqoise text, control radius; on hover the fill turns
  torqoise and the text `$darkBlue`. Minimum 44px tall. _Shape awaiting sign-off: see the options
  sent with this change._
- **Tabs (gallery)**: same control radius as buttons; the selected tab is filled torqoise.
- **Links**: torqoise, no underline in navigation, underline on hover in body copy.
- **Inputs**: visible label above the field, 16px text, at least 44px tall, white bottom border,
  gold focus ring.
- **Focus**: 2px solid `$gold`, 2px offset, on every interactive element.
- **Cards**: `$darkBlue` fill, 1px white border, card radius.
- **Navigation**: `$darkBlue` bar, brand left, links right from 1366px, menu button below that.
- **Footer**: `$darkBlue`, social icons, copyright.

## Imagery and motion

- Decoration is the flat SVG set in `images/` (dots, hatches, lines, circles) in the palette
  colours. It sits behind content and never behind body text without a card under the text.
- Project screenshots are shown whole, never cropped mid-content.
- Motion: one short intro per page (about 4 seconds), ambient loops only while visible, and a
  plain fade for visitors who prefer reduced motion. See `js/app.js`.
