# Global Visual Design System Specification

**Project**: Marye Agegn — Professional Biomedical Engineering & Research Portfolio  
**Architecture**: React 19 + Vite 6 + Vanilla CSS (Custom Properties)  
**Reference Document**: `DESIGN_SYSTEM.md`  

---

## 1. Design Philosophy

The visual language of this site is defined as a **Scientific-Clinical Hybrid**:
- **Intellectual Depth & Precision**: Emulates the restrained editorial clarity of a peer-reviewed academic publication and the instrument precision of a biomedical engineering laboratory.
- **Evidence Over Ornamentation**: Avoids generic software portfolio tropes (e.g., loud neon glows, excessive glassmorphism, floating decorative 3D objects, fake metrics, percentage skill bars).
- **Communication of Coherent Progression**: Clarifies the bridge between:
  $$\text{Engineering Practice} \longrightarrow \text{Healthcare Technology} \longrightarrow \text{Biomedical Research} \longrightarrow \text{Explainable AI} \longrightarrow \text{Clinical Translation}$$
- **Information Hierarchy**: Prioritizes legibility, structured reading rhythm, and whitespace to give complex technical pipelines room to breathe.

---

## 2. Typography System

The typography is built around high-density technical legibility and scientific reading comfort.

| Role | Font Family | Size Range | Weight | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Headings** | `Inter`, system sans | `1.5rem` – `3rem` | `700` (Bold) | Section titles, feature highlights |
| **Subheadings** | `Inter`, system sans | `1.125rem` – `1.25rem` | `600` (SemiBold) | Card headers, topic titles |
| **Body Text** | `Inter`, system sans | `1rem` (`16px`) | `400` (Regular) | Narrative prose, reading line-height `1.65` |
| **Lead Text** | `Inter`, system sans | `1.125rem` | `400` / `500` | Executive positioning statements |
| **Technical / Mono** | `JetBrains Mono`, monospace | `0.75rem` – `0.875rem` | `400` / `500` | Pipeline steps, dates, sensor parameters |
| **Metadata Labels** | `Inter`, system sans | `0.75rem` (`12px`) | `600` (SemiBold) | Uppercase badges, category chips |

- **Optimal Line Length**: Long-form text constrained to `max-width: 720px` (`--content-text-max-width`) to maintain 65–75 characters per line.
- **Heading Letter Spacing**: Tight tracking (`-0.025em` to `-0.03em`) for editorial cohesion.

---

## 3. Color System (Semantic Tokens)

The palette uses a technical darkroom foundation paired with precision clinical telemetry accents.

### Backgrounds & Surfaces
- `--color-bg`: `#0b0f17` (Deep slate/graphite base canvas)
- `--color-bg-subtle`: `#0f1624` (Subtle alternating section background)
- `--color-surface`: `#131b2a` (Card and structured container background)
- `--color-surface-elevated`: `#182337` (Interactive / hovered container state)

### Structural Boundaries
- `--color-border`: `#1e293b` (Primary 1px architectural divider)
- `--color-border-subtle`: `#182335` (Internal card separator)
- `--color-border-strong`: `#334155` (Emphasized border on active elements)

### Text & Contrast (WCAG 2.1 AAA Compliant)
- `--color-text-primary`: `#f8fafc` (95% luminance off-white for effortless legibility)
- `--color-text-secondary`: `#94a3b8` (Balanced neutral slate for paragraphs)
- `--color-text-muted`: `#64748b` (Timestamps, captions, fine print)

### Clinical Accents
- `--color-accent`: `#0284c7` (Standard link and interactive focus)
- `--color-accent-light`: `#38bdf8` (Telemetry cyan for badges, active status, highlights)
- `--color-accent-hover`: `#0369a1` (Interactive hover state)
- `--color-accent-subtle`: `rgba(14, 165, 233, 0.08)` (Background tint for chips)
- `--color-accent-border`: `rgba(56, 189, 248, 0.25)` (Border tint for badges)

### Status Tokens
- `--color-status-progress`: `#38bdf8` / `rgba(56, 189, 248, 0.1)` (Ongoing research)
- `--color-status-complete`: `#34d399` / `rgba(52, 211, 153, 0.1)` (Completed milestones)

---

## 4. Spacing System (8pt Modular Scale)

| Token | Rem Value | Pixel Value | Typical Application |
| :--- | :--- | :--- | :--- |
| `--space-1` | `0.25rem` | `4px` | Badge internal padding, micro gaps |
| `--space-2` | `0.5rem` | `8px` | Icon-to-text spacing, tag padding |
| `--space-3` | `0.75rem` | `12px` | Compact component gaps |
| `--space-4` | `1rem` | `16px` | Standard mobile gutter, card inner padding |
| `--space-6` | `1.5rem` | `24px` | Standard card padding, element stack gap |
| `--space-8` | `2rem` | `32px` | Desktop gutter, section sub-group gap |
| `--space-12`| `3rem` | `48px` | Mobile section vertical padding |
| `--space-16`| `4rem` | `64px` | Desktop section vertical rhythm |
| `--space-20`| `5rem` | `80px` | Major milestone breathing room |

- **Layout Max Width**: `1120px` (`--container-max-width`)
- **Card Corner Radius**: `8px` (`--radius-md`) for structured, architectural cards.

---

## 5. Responsive Breakpoints

| Device Category | Media Query Range | Layout Adjustments |
| :--- | :--- | :--- |
| **Mobile** | `< 640px` | Single column, `--space-4` padding, compact header |
| **Tablet** | `640px` – `1023px` | Multi-column grid (`2 columns`), `--space-6` padding |
| **Desktop** | `1024px` – `1279px` | Full navigation layout, `--space-8` padding, 1120px container |
| **Large Desktop** | `≥ 1280px` | Centered layout with generous margin breathing room |

---

## 6. Motion & Animation Principles

- **Policy**: Functional feedback only; zero purely decorative animations.
- **Timing**:
  - `--duration-fast`: `150ms` (hover states, link colors, button active feedback)
  - `--duration-normal`: `250ms` (drawer transitions, tab switching)
  - `--ease-standard`: `cubic-bezier(0.16, 1, 0.3, 1)`
- **Accessibility Guarantee**:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```

---

## 7. Component Foundations

1. **Containers & Cards (`.card-base`)**:
   - Background `--color-surface` with 1px border `--color-border`.
   - Subtle border color shift to `--color-border-strong` on hover.
2. **Technical Badges (`.badge-tag`, `.section-status-badge`)**:
   - Monospace or tight sans-serif with uppercase tracking and subtle tint border.
3. **Status Pills (`.status-pill-progress`, `.status-pill-complete`)**:
   - Pill-shaped badges communicating verifiable milestone status.
4. **Action Buttons (`.btn-primary`, `.btn-secondary`)**:
   - High contrast, accessible focus ring (`--focus-ring`) with 2px offset.
5. **Dividers (`.divider-subtle`)**:
   - Subdued 1px rule lines for structural separation.
6. **Skip Link (`.skip-to-content`)**:
   - Positioned off-screen and reveals on keyboard `Tab` focus for screen reader compliance.
