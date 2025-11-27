# Design Refresh Plan: Calm, Analog-Inspired Look

## Goals
- Evoke an intelligent, editorial feel reminiscent of an analog book.
- Introduce a subtle beige backdrop with light paper texture while keeping readability and accessibility in focus.
- Align primary actions and accents with a softened, confident hue that complements the background.

## Palette Updates
- **Background:** Warm beige `#f7f1e8` (HSL 35, 35%, 93%) as the base page color.
- **Foreground/Text:** Deep ink `#1f2629` (HSL 200, 14%, 15%) to retain strong contrast.
- **Primary:** Soft navy `#264e70` (HSL 205, 48%, 30%) for CTA fills, focus rings, and key links.
- **Secondary/Muted:** Stone gray `#6d7378` for metadata; light stone `#ece7de` for borders and subtle fills.
- **Success/Warning/Error:** Keep existing status hues but desaturate by ~10% to stay in the calm spectrum.

## Background Texture Strategy
- Use a **tileable paper grain** SVG overlay at low opacity (4–6%) to avoid heavy noise while reinforcing the analog cue.
- Apply texture globally via `body::before` (fixed, pointer-events none) so content remains crisp and scrolling stays smooth.
- Provide a solid-color fallback for high-contrast or reduced-transparency modes.
- Keep the texture always on (no user toggle), but allow the `--texture-opacity` token to be tuned if we need to reduce weight globally.

## Component-Level Refresh
- **Layout Shell:** Update `src/app/layout.tsx` and `src/app/globals.css` tokens to use the beige background and texture layer; keep generous whitespace from the design spec.
- **Header + Sidebar:** Ensure borders remain hairline; use the soft navy for active states and underline indicators instead of filled blocks.
- **Cards & Surfaces:** Prefer border-only sections with `border-stone-200` equivalents; reserve muted fills for highlights (e.g., refined output states).
- **Inputs & Buttons:** Keep flat inputs. Shift primary buttons to the soft navy with subtle hover lightening; ghost buttons should inherit the ink text on beige.
- **Typography:** Maintain serif for body and sans for accents; tighten letter spacing on uppercase labels to ~0.25–0.3em to match the analog tone.

## Token & Theme Changes
- Update Tailwind CSS variables in `src/app/globals.css` to the new palette (background, foreground, primary, border, accent).
- Add a `--texture-opacity` custom property to control the paper grain strength; expose a `.texture-none` utility for internal QA even though there is no user-facing toggle.
- Adjust shadcn component tokens (buttons, cards, inputs) to reflect the soft navy primary and beige surfaces.

## Asset & Performance Notes
- Embed the paper texture as an inline SVG data URL to avoid extra requests; keep the pattern lightweight (~1–2 KB).
- Verify contrast ratios meet WCAG AA on beige background (body text vs. background ≥ 4.5:1, primary buttons ≥ 3:1 for large text).
- Keep dark mode on the current slate scheme for stronger contrast at night; do not introduce a beige paper variant there.

## Rollout Steps
1. **Token Update:** Refresh CSS variables and Tailwind theme to new palette; add texture variables and utility class.
2. **Global Shell:** Apply beige background and texture overlay in the root layout; confirm header/sidebar borders remain subtle.
3. **Components:** Update shadcn UI components (button, card, input/textarea) to use new tokens, hover states, and letter spacing.
4. **Pages:** Verify landing and home pages honor the new background and spacing; adjust any hard-coded colors to tokens.
5. **QA:** Run accessibility pass for contrast; test texture performance on mid-tier devices and high-DPI displays.

## Decisions (answered)
- **Dark mode:** Keep the current slate scheme for stronger contrast at night (no beige paper variant).
- **Texture toggle:** No user-facing toggle; rely on token-level adjustments if we need to lighten the texture globally.
