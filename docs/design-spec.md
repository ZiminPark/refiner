# Design Specification

## Overview
This document captures the calm, editorial-inspired interface. The aim is to give every screen a “long-form newsletter” vibe: serif-driven body text, restrained palettes, and layout decisions that rely on whitespace rather than gradients or cards with heavy elevation.

## Foundations
### Typography
- **Body/Headings:** `Merriweather` (`font-serif`, weights 300/400/700) for all prose, with leading set around 1.5 for readability.
- **Accents & Navigation:** `Raleway` (`font-sans`, weights 400–600) reserved for uppercase labels, counts, and controls that need a subtle sans-serif contrast.
- **Usage Tips:** Keep uppercase tracking between `0.25em` and `0.35em` on nav + metadata. Headlines (H1/H2) should stay ≤ 3rem to avoid overpowering the text blocks.

### Color Palette
| Token | HSL | Usage |
| --- | --- | --- |
| `--background` | `0 0% 100%` | Page background |
| `--foreground` | `210 11% 15%` | Primary body text |
| `--primary` | `211 100% 50%` | Action blue (buttons, key links) |
| `--secondary` | `208 7% 46%` | Muted copy, timestamps, nav |
| `--accent` | `210 17% 96%` | Subtle fills on hover states |
| `--border` | `210 14% 89%` | Divider + card edges |
| `--muted` | `210 17% 96%` | Card backdrops and inert surfaces |
| `--accent-success/info/...` | Mirror existing design tokens for status messaging, but keep saturation low unless communicating errors. |

Dark mode mirrors these values with lighter text on deep slate backgrounds; avoid neon blues—stick to the same hue at higher lightness.

### Spacing & Shape
- **Cards:** Flat (`shadow-none`), squared corners (`radius: 0.25rem`), 1px borders.
- **Buttons:** Inline-flex pills with uppercase sans text. Default height `h-11`, `px-6`, `tracking-[0.3em]`.
- **Sections:** Use generous `py-10+` to maintain breathing room; rely on `border-t` / `border-b` separators rather than backgrounds.

## Patterns
1. **Header & Navigation**
   - Keep header height at 64px with border-bottom.
   - Brand label uses uppercase Raleway (“English Refiner”) with subtle tracking.
   - Section nav uses sans-serif uppercase text; no filled chips or heavy backgrounds.

2. **Sidebar**
   - Toggle button: outlined circle, no filled state.
   - Navigation items: 2px left border indicator; uppercase sans text.
   - Background should remain semi-transparent white with blur on desktop, simple white sheet on mobile.

3. **Cards & Content Blocks**
   - Titles uppercase or light-weight serif. Example: “Original” label uses uppercase sans.
   - Subcopy stays `text-secondary`. Callouts (Refined results) get `border-primary/30` to stand out.

4. **Form Inputs**
   - Inputs/Textareas: flat, white background, border `--border`. No drop shadows.
   - Focus state: `ring-1` with primary hue.

5. **CTAs**
   - Buttons rely on uppercase Raleway text and subtle border/hover shifts.
   - Secondary/ghost buttons should keep visible text color even when inactive; never default to `text-gray-400`.

## Implementation References
- **CSS Tokens:** `src/app/globals.css`
- **Tailwind Font Settings:** `tailwind.config.ts`
- **Surface Components:** `src/components/ui/{button,card,input,textarea}.tsx`
- **Pages using Spec:** `src/app/page.tsx`, `src/app/home/*`, `src/features/sentence/components/InputForm.tsx`

## Usage Checklist
1. Leveraged serif body text with sans-serif accents?
2. Sections separated with borders/spacing (not shaded cards)?
3. Buttons/links stay uppercase with adequate tracking and no default blue underline?
4. Inputs and cards use flat borders? (No drop shadows.)
5. Links or metadata have at least 4.5:1 contrast relative to background?

Document any deviations from this spec in PR descriptions so future contributors can track intentional shifts.***
