# Server Control Room Design

## Goal

Make the ALMikey portfolio feel like an operational interface for a Minecraft server developer while retaining the current five full-screen image-led chapters and concise Chinese content.

## Visual Direction

The site will use a restrained "server control room" language rather than adding generic decorative effects. A fixed desktop HUD will expose the active chapter and system state; each full-screen chapter will carry a subtle scan texture and a higher-contrast chapter marker. Existing green, gold, and coral accents remain the only active signal colors.

The imagery stays primary. Texture, glow, and motion remain low-opacity layers so that the Minecraft wallpaper is still fully legible.

## Interaction Design

- The existing module switcher remains the navigation control and continues to mark the most visible chapter.
- A visual-only HUD mirrors the current chapter label and ordinal. It is hidden from assistive technology because the module switcher already provides the semantic navigation.
- Scroll entry animation continues to replay. A short chapter signal animation is applied through the existing visible-state lifecycle.
- Project cards gain an explicit accessible button. Pressing it reveals a concise contribution, stack, and outcome record in the same card; pressing it again collapses the record. Buttons expose their state through `aria-expanded` and control their record using `aria-controls`.
- Hover emphasis remains limited to fine-pointer devices. `prefers-reduced-motion` keeps all content immediately visible and removes unnecessary transitions.

## Technical Boundaries

- Keep the static HTML/CSS/JavaScript architecture. Do not introduce an animation framework or a build pipeline.
- `index.html` owns the HUD markup and project record content.
- `styles.css` owns visual treatment, responsive layout, and motion reduction.
- `app.js` owns active-chapter HUD updates and project record toggle state.
- A Node contract test verifies the required semantic hooks without requiring a browser runner.

## Acceptance Criteria

1. Desktop users see a fixed control-room HUD that reflects the active chapter as they scroll or use module navigation.
2. Every visual chapter presents a subtle technical texture without obscuring the wallpaper or reducing text contrast.
3. Project cards can be expanded and collapsed with pointer and keyboard input, with correct accessible state.
4. The current module switcher, hero replay, hover effect, and reduced-motion behavior remain intact.
