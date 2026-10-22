# Learning workspace

An interactive learning-platform prototype built around a tutorial-style document with two contextual side panels: **Ask** (an AI-style chat assistant) and **Documentation** (a live, themeable workspace where the user can author their own notes).

The focus is on micro-interactions: every state change, panel transition, and small affordance is hand-tuned. This README documents what's in the build and how it behaves.

---

## Stack

- React 18 (StrictMode)
- Vite 5
- Framer Motion 11
- Plain CSS, scoped per component + a small global token layer

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

---

## Layout

```
┌──────────────┬──────────────────────────────┬─────────────────────┐
│              │                              │                     │
│  Ask panel   │       Document (body)        │  Documentation      │
│  (left)      │                              │  panel (right)      │
│              │                              │                     │
└──────────────┴──────────────────────────────┴─────────────────────┘
                          ┌───────────────┐
                          │   MenuBar     │
                          └───────────────┘
```

Both side panels:
- Slide in from their respective edges with a spring (stiffness 280, damping 32).
- Are independently resizable via a thin handle on their inner edge.
- Frosted blurred headers (`rgba(255,255,255,0.3)` + `backdrop-filter: blur(8px)`) that float over the scrolling content underneath.

## Keyboard shortcuts

- `Ctrl/⌘ + ◄`: toggle the Ask panel
- `Ctrl/⌘ + ►`: toggle the Documentation panel
- `Esc`: close whichever panel is currently open

The shortcut symbols render reliably across Windows + Mac (chose filled triangles after a font-fallback test on Windows).

Any printable key pressed while the Ask panel is open and no input is focused auto-focuses the Ask input and appends the character: a small but useful "just start typing" affordance.

---

## MenuBar

Floating dark pill at the bottom-center of the viewport.

- Tab buttons (Ask, Projects, Documentation) with icon + label.
- **Tap scale** is driven from the button's `onPointerDown` (not Framer's built-in `whileTap`), so pressing anywhere inside the button's padded area: not just on the icon/text: triggers the 0.95 scale. `onPointerLeave` and `onPointerCancel` reset it so it never sticks.
- Tooltips on hover with each tab's keyboard shortcut. Tooltips are **suppressed for all items when any tab is active**: once you've made a choice, no more nagging.
- Tooltip distance accounts for the MenuBar's 32px box-shadow halo (`gap={16}`).

---

## Ask panel

Chat-style assistant with a clarifying-questions modal.

### Welcome state
- Animated Sparkle icon rotates `-540°` to `0°` over 1.6s easeInOut on first open.
- Four suggestion chips below the welcome message: each has a downward-right arrow icon, the label, and on click prefills the composer (not auto-sent: the user can edit before sending).
- Suggestion chips hide automatically when a quoted text is pending (i.e. user clicked "Ask" from a document selection: they already have an intent).

### Composer
- Auto-growing `<textarea>` (max-height 200px).
- `Enter` sends, `Shift+Enter` newline.
- Native placeholder is `user-select: none` to prevent drag-select interactions.
- Send button is a 42px dark-gray circle with an up-arrow icon, disabled when the input is empty.
- Quoted text from a document selection appears as a chip *above* the input, rounded only at the top corners so it visually fuses with the composer.

### Messages
- User messages: dark bubble, right-aligned.
- Assistant messages: light bubble, left-aligned.
- **Word-by-word streaming** for the latest assistant message:
  - Each word fades from `opacity: 0` / `filter: blur(2px)` to `1` / `blur(0)` over 0.25s.
  - Per-word delay scales inversely with word count: short replies feel deliberate, long replies don't drag. Target total time clamps between 0.8s and 3s.
  - ±60% random jitter per word so it never feels metronomic.
- A "jump to bottom" button (dark pill with chevron) fades in when the user has scrolled away from the latest message.
- The thinking indicator: three dots with staggered bounce (`@keyframes ask-bounce`).

### Clarifying questions modal
After sending a message, the assistant streams a "I need more context" reply, and **only after the streaming completes** does the question modal slide up from the composer.

- Random selection of 2–4 questions from a pool of 10.
- One question per step, with direction-aware slide transitions (`direction: +1`/`-1` passed as `custom` to Framer Motion variants).
- Persistent body wrapper with `layout` for smooth height animation when question height changes.
- Single/multi-select radio buttons + an optional free-text field per question.
- Back button hidden on the first question; Submit replaces Next only on the final question.
- When the modal opens, the messages area auto-scrolls to bottom so the assistant's last message stays visible behind the modal.

### Text selection → Ask
- Selecting text in the document body shows a floating popup (above the selection) with **Ask** and **Highlight** buttons.
- "Ask" opens the Ask panel and seeds the composer with a quote chip: selection popup stays visible until the user manually clicks elsewhere.
- Popup uses a **hover triangle hit area** (cursor → popup's bottom corners): moving the cursor diagonally toward the popup won't dismiss it even if you pass over un-highlighted text or a different highlight. Triangle expires after 400ms of cursor inactivity.
- Mode swap (Highlight ↔ Remove highlight) uses `AnimatePresence mode="popLayout"` with a soft 2px blur in/out and a shared 0.08s easeOut. The popup's `layout` prop tweens its width as the button label changes.

### Highlights
- Selected text wraps in `<mark class="doc__highlight">` (gainsboro background).
- Cross-block selections are wrapped per-block to avoid weird padding gaps.
- Hovering a highlight reshows the popup, now with "Remove highlight" replacing "Highlight".
- Clicking "Remove highlight" unwraps the marks **and restores the text selection** so the user can immediately re-highlight or hit Ask again. Character-offset tracking survives the DOM `normalize()` call that merges the unwrapped text nodes.

---

## Documentation panel

A live editable mock with 6 color themes and 4 typography themes.

### Theme toolbar
- Always-rendered when the panel opens (default state).
- Pin button in the header toggles its visibility: when hidden, the toolbar collapses with a 0.25s easeOut height + opacity animation.
- Pin button has an active state (gainsboro background) when the toolbar is shown.

### Color themes (6)
Light, Bold Accent, Marigold, Bookshelf, Dark, Graphite. Each defined as a scoped CSS variable set in `styles/documentation-themes/colors/`.

### Typography themes (4)
- **Modern**: Inter / IBM Plex Sans
- **Display**: Bricolage Grotesque / Geist
- **Editorial**: Fraunces / Source Serif 4
- **Technical**: Space Grotesk / Geist

Each defines its own scale, weights, line-heights, and tracking (tighter for sans-serif, looser for serif).

### Randomize button
Cube icon + "Randomize" label, positioned to the right with `space-between` so it aligns to the bottom edge of the swatch rows. Picks a different color + typography combination than the current one (no-op picks excluded).

### Mock content
The mock renders the proof-of-work data (`src/data/proofOfWork.js`):
- Hero (eyebrow, title, author, date)
- 5 sections each with: number, eyebrow, title, body, image placeholder

**Inline editing**: the author name and each section body are `contentEditable`.
- **Hover state**: 6% `currentColor`-tinted background: theme-aware (dark on light themes, light on dark themes) via `color-mix(in srgb, currentColor 6%, transparent)`.
- **Click to edit**: cursor lands in the field; a "Click to edit" tooltip below the element (suppressed once focused).
- **Enter** commits, **Shift+Enter** newline, **Escape** reverts.
- **Session persistence**: a module-level `sessionStore` Map keeps edits across panel close/reopen within the same browser session.
- `:focus-visible` (keyboard) shows a soft 40%-currentColor outline; mouse clicks don't show the outline.

---

## Document (the tutorial body)

Static long-form tutorial content. Contains:

### Checklist
- Two visual variants: `linen` (default, for white-smoke backgrounds) and `white-smoke` (for white backgrounds).
- Items toggle on click. Checkbox fills with dark-gray, an SVG tick draws in via `pathLength: 0 → 1` over 0.12s.
- Strike-through line on the text scales horizontally from `scaleX: 0 → 1` over 0.1s.
- Row hover background subtly tinted by variant.

### Quiz
- Multiple choice with A/B/C/D options.
- Clicking "Check answer" shows a circular spinner inside the button for 1–2s (random) before revealing the result.
- Feedback container is always mounted at the same spot: only opacity + background transitions on submit.
- Right padding springs in from 0 to 16px (300ms cubic-bezier overshoot curve) when the feedback reveals.
- "Check answer" → "Try again": same button, same size, label and behavior swap. "Try again" is an outline variant of the same button.
- Correct: green-tinted bg, check badge. Wrong: red-tinted bg, cross badge.

### Code blocks
- Sticky header with language label + copy button.
- Copy button shows a "Copy" tooltip on top; switches to "Copied" with an animated check icon (`pathLength` draw) for 1.6s after a successful clipboard write.
- Inner `<pre>` allows `user-select: text` (so users can manually copy snippets) while the header is `user-select: none`.

### Quote callouts
- Decorative quote-mark icon, title, and body: styled distinctly from regular paragraphs.

---

## Global details

### Focus management
- All clickable elements get `2px solid stone-gray` `:focus-visible` outline with 2px offset.
- Outlines are *not* shown on click focus, only on keyboard nav.
- Outline-offset animates over 120ms ease-out for a subtle "pop in" on Tab.

### Buttons
- `cursor: pointer`, no native border/background, `user-select: none` globally.
- Tap scale 0.95–0.98 on most actionable buttons via Framer Motion `whileTap`.

### Tooltips
- React portal to `<body>`: escapes all parent stacking contexts and clipping.
- Positioned via `getBoundingClientRect()`, repositions on scroll + resize.
- Configurable `gap` (distance from trigger) and `disabled` (suppress while still tracking hover).
- Bubble: 11px, dark-gray background, white text, 6px radius.

### Scrollbars
- Custom thin (6px) scrollbars across the app, gainsboro thumb on transparent track.

### Selection
- Text selection uses gainsboro background + dark-gray foreground (`::selection`).

---

## Project structure

```
src/
├── App.jsx / App.css           # Top-level layout, panel orchestration, shortcuts
├── main.jsx                    # React mount + global style imports
├── components/
│   ├── MenuBar.jsx + .css      # Floating bottom nav
│   ├── Tooltip.jsx + .css      # Portal-based tooltip
│   ├── icons/Icons.jsx         # All SVG icons
│   ├── ask/                    # Ask panel feature
│   │   ├── AskPanel.jsx + .css
│   │   ├── AskComposer.jsx
│   │   ├── AskInputRow.jsx
│   │   ├── AskMessages.jsx
│   │   ├── AskModal.jsx
│   │   ├── AskModalOption.jsx
│   │   ├── StreamedText.jsx
│   │   └── clarifyQuestions.js
│   ├── document/               # Tutorial body
│   │   ├── Document.jsx + .css
│   │   ├── Checklist.jsx + .css
│   │   ├── Quiz.jsx + .css
│   │   ├── CodeBlock.jsx
│   │   └── Quote.jsx
│   ├── documentation/          # Documentation side panel
│   │   ├── DocumentationPanel.jsx + .css
│   │   ├── DocumentationMock.jsx + .css
│   │   ├── DocThemeToolbar.jsx + .css
│   │   └── Editable.jsx
│   └── selection/
│       └── SelectionPopup.jsx + .css
├── data/
│   └── proofOfWork.js          # Documentation mock content
└── styles/
    ├── tokens.css              # Global design tokens (colors, type scale)
    ├── global.css              # Resets + focus rules
    ├── fonts.css               # Geist + Inter import
    └── documentation-themes/   # Scoped color + typography themes
        ├── index.css
        ├── fonts.css           # Theme-specific font imports
        ├── colors/             # 6 color themes
        └── typography/         # 4 typography themes
```

---

## Notes

- **`StrictMode`** is on: components are written defensively (no animations stored in state, refs for things that must persist across double-renders).
- **Memory**: `Editable` uses a module-level `Map` for session persistence: survives panel unmount but not page refresh.
- **No backend**: assistant replies are LOREM-ipsum with random delays (1–2s) to simulate AI thinking.
