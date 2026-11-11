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

- **Button**: one shape for every button on the site: a rounded rectangle with the control
  radius (0.5em), at least 44px tall, Outfit 600.
  - Outline (`.btn`): torqoise border and text. Used for "View Project".
  - Filled (`.btn--fill`): torqoise fill, `$darkBlue` text. Used for the main action on a page
    ("Send message").
  - While busy a button is disabled and its label says what is happening ("Sending…").
- **Tabs (gallery)**: plain uppercase labels, not buttons. The selected tab is torqoise with a
  3px gold underline; the others are lime. No border, fill or radius.
- **Links**: torqoise, no underline in navigation, underline on hover in body copy.
- **Inputs**: visible label above the field, 16px text, at least 44px tall, 1px border with the
  control radius, gold focus ring. Optional fields say "(optional)" in the label.
- **Form feedback**: shown on the page next to the button, never in a pop-up: a confirmation on
  success, a plain-language error with another way to get in touch on failure.
- **Focus**: 2px solid `$gold`, 2px offset, on every interactive element.
- **Cards**: `$darkBlue` fill, 1px white border, card radius.
- **About card (1024px and wider)**: the bio sits on one card, at most 1100px wide and centred,
  the same width as the gallery viewer. Two equal columns: the narrative on the left; the portrait
  with Core Capabilities and Education under it on the right. The decoration field sits behind
  the card and stays still while the card scrolls over it. Below 1024px there is no field and no
  card: text, then photo, on the page ground.
- **Navigation**: `$darkBlue` bar, brand left, links right from 1366px, menu button below that.
- **Footer**: `$darkBlue`, social icons, copyright.

## Imagery and motion

- Decoration is the flat SVG set in `images/` (dots, hatches, lines, circles) in the palette
  colours. It sits behind content and never behind body text without a card under the text.
- Project screenshots are shown whole, never cropped mid-content.
- Motion: one short intro per page (about 4 seconds), ambient loops only while visible, and a
  plain fade for visitors who prefer reduced motion. See `js/app.js`.
- Scroll colour (home): each project section arrives in a contrasting palette colour and resolves
  to its own background as you scroll to it: sea blue, then torqoise, then green. The stylesheet
  colour is always the destination. Only sea blue, green, torqoise and gold may be used as
  starting colours; lime and white make the torqoise titles and gold tech lines unreadable
  mid-change. The change is 65% complete when a section's text first appears.
- Scroll colour (about): the page opens on `$myBlack` and warms to its violet over the first 60%
  of a screen of scrolling. Its text is visible from the start, so only a dark starting colour
  keeps the gold, lime and white text readable.
  The colour is on `<main>`, so on desktop it is the ground behind the decoration field and card.
- Gallery viewer: rises in over 0.35s when opened (24px, 97% scale, fade) and fades out in 0.15s
  when closed. Thumbnails and video cards stagger in, top-left first, on open and on every tab
  change: 0.4s each, 0.05s apart, the whole stagger capped at 0.4s however many there are.
  Keyboard focus moves at once and is never delayed by motion. With reduced motion, or if GSAP
  is unavailable, everything simply appears. Timings are in `MOTION` in `js/gallery.js`.
- Project screenshots are inset on every screen size (1em on phones, more on wider screens), so
  the section colour frames them.
