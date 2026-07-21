# Lenix Enterprise Page Design Guide

Production standard for all marketing and product UI pages. This is an **enterprise platform**, not an MVP landing page or startup pitch deck.

**Reference implementations:** Homepage (`src/app/[locale]/page.tsx`), About, Contact, Solutions (after copy pass), Crypto Recovery (glass variant).

**Design tokens:** `src/lib/home-styles.ts` (default), `src/lib/recovery-styles.ts` (forensic/recovery flows only).

**Voice reference:** `messages/en/common.json` → `Home.Hero`, `Home.Pillars`, `Home.Merchant`.

---

## 1. Mandatory workflow (before any page UI or copy change)

Do not write code or copy until this workflow is complete.

### Step 1 — Define page purpose

Answer in writing (in PR, task notes, or commit context):

| Question | Example (Recovery page) |
|----------|-------------------------|
| What is this page for? | Intake and explain asset recovery services |
| Who lands here? | Victims of theft, compliance leads, legal counsel |
| Primary action? | Submit recovery case |
| Secondary action? | Contact team / read process |
| What must NOT happen? | False recovery guarantees, seed phrase requests |

### Step 2 — Research target users and problems

Use web search before writing copy. Document briefly:

- **Who** uses this product area (role, organization type, jurisdiction if relevant)
- **What problem** they have when they arrive (urgency, fear, compliance pressure, treasury pain)
- **What they tried** that failed (banks, police, other “recovery” scams)
- **What they need to hear** (process, boundaries, next step, timeline honesty)

Search examples:

- `crypto asset recovery victim enterprise workflow`
- `institutional cross-border crypto settlement compliance`
- `collateralized crypto lending enterprise requirements`

Do not invent user pain from generic AI knowledge alone when building or rewriting a page.

### Step 3 — Map problems → Lenix response

For each user problem, one concrete platform response. No vague “we provide solutions.”

| User problem | Lenix response (specific) |
|--------------|---------------------------|
| “I don’t know if recovery is possible” | Initial assessment before engagement; no upfront recovery fee narrative where applicable |
| “I need evidence for my lawyer” | Trace reports formatted for counsel and exchanges |
| “Treasury can’t see payment status” | Status from wallet initiation through beneficiary delivery |

If Lenix does not solve a problem, **say so** or omit the claim.

### Step 4 — Audit existing codebase

- Read current page components and `messages/en/*.json` for that route
- Reuse `HomeSectionHeader`, `home` tokens, existing section patterns
- Do not introduce a third visual system

### Step 5 — Write copy, then humanize

1. Draft copy in `messages/en/<page>.json` (preferred) or aligned with existing namespaces
2. Read and apply the **humanizer** skill (`~/.agents/skills/humanizer/SKILL.md`)
3. Calibrate voice to **Home.Hero** — direct, bounded, operator-led (not sales hype)

### Step 6 — Build and review

- `npm run build` must pass
- Run the [Pre-ship checklist](#7-pre-ship-checklist) below

---

## 2. Visual system

### Default: `home` tokens (most pages)

```ts
import { home } from "@/lib/home-styles";
import { HomeSectionHeader } from "@/app/[locale]/components/home/home-section-header";
```

| Token | Use |
|-------|-----|
| `home.section` / `home.sectionMuted` | Section padding; alternate `bg-black` and `neutral-950` |
| `home.container` | `max-w-screen-xl mx-auto` |
| `home.eyebrow` | Small label above titles |
| `home.title` / `home.titleCenter` | Section headings (`text-3xl` → `lg:text-5xl`, `font-semibold`) |
| `home.lead` | Body intro (`text-base`, `neutral-400`) |
| `home.card` | Image containers, content panels |
| `home.btnPrimary` / `home.btnSecondary` | CTAs — `rounded-md`, no glow |
| `home.textLink` | Inline links — yellow, sparingly |

**Yellow accent:** CTAs, text links, bullet markers only. Not full headlines, not icon backgrounds, not section borders.

### Forensic flows only: `glass` tokens

Use `src/lib/recovery-styles.ts` only on recovery/forensics intake pages where glassmorphism is already established. Do not mix `home` and `glass` on the same page without explicit reason.

### Approved section patterns (reuse, do not reinvent)

Copy layout patterns from the homepage — do not clone the same pattern four times on one page.

| Pattern | Source | When to use |
|---------|--------|-------------|
| Text hero | Contact hero | Page intro — no grid, no fake UI |
| Split + image | `Home.Merchant` | One or two deep-dive sections per page max |
| 4-card grid + image band | `Home.Pillars` | Overview / wayfinding |
| 3-column cards | `Home.CaseWorkflow` | Process or capabilities |
| Wide banner + text columns | `Home.CaseStudy` | Single showcase section |
| Centered CTA | `Home.Cta` | Page footer |

**Layout rule:** If a page needs more than two split (50/50) sections, insert a different pattern (grid, banner, or 3-col) between them.

### Forbidden UI patterns

These read as AI template or startup demo — **never** use on production pages:

- Fake product dashboards (traffic lights, “SCANNING…”, progress bars, mock transaction UIs)
- Hero grid patterns, pulsing blur orbs, glow shadows on buttons/cards
- Decorative SVG section dividers
- `min-h-screen` heroes unless the page is a dedicated landing with no content below fold
- Icon-in-circle cards for every feature
- `rounded-full` primary buttons with shadow glow
- Hover scale/zoom on cards
- Yellow span inside every H1 (“Recover Your **Lost Assets**”)
- Stacking four identical 2-column layouts on one page
- Gradient yellow CTA bands
- Placeholder or tokenomics images unrelated to the section topic

### Images

- Use real assets from `/public/assets/img/`
- `next/image` with meaningful `alt` text
- Aspect ratios: `4/3` for split sections, `16/10` for card bands, `21/9` for wide banners

---

## 3. Content voice — enterprise, not startup

Lenix copy should sound like an **operator explaining how the product works**, not a pitch deck.

### Voice model (follow this)

From `Home.Hero`:

> “Lenix traces funds across chains and prepares evidence packages for exchanges, regulators, and counsel.”  
> “We do not promise recovery. We tell you what the chain shows and what paths may exist before you commit.”

Properties: **specific**, **honest about limits**, **verb-led**, **no hype adjectives**.

### Write for a role

Name who the section is for when it helps:

- Compliance officer, treasury ops, incident response lead, general counsel, retail victim with large loss

### Do

- Lead with outcome or action the user can take
- State what happens first, second, what we need from them
- Use plain terms: trace, settle, freeze, collateral, evidence package
- Keep CTAs consistent: “Start a recovery case”, “Contact us”, “Learn more”
- Put copy in `messages/en/<page>.json` and wire with `next-intl`
- Apply humanizer skill — remove AI vocabulary (see below)

### Do not (startup / robot tells)

| Avoid | Why |
|-------|-----|
| “Institutional-grade”, “cutting-edge”, “seamless”, “revolutionary” | Empty pitch language |
| “Leverage our platform to unlock…” | SaaS template |
| “Comprehensive suite of solutions” | Says nothing |
| Unverified SLAs, “immutable logs”, “military-grade” | Credibility risk |
| “Select a capability to review delivery model” | UX placeholder copy |
| “94% success rate” unless sourced and approved | Legal/trust issue |
| “Contact sales” mixed with “Explore” / “View” on same page | Inconsistent funnel |
| Three parallel adjectives on every bullet | AI rule-of-three |
| Em dash overuse — stacked clauses — fake depth | Humanizer flag |

### Humanizer skill (required for all new/edited copy)

Before merging page copy:

1. Read `~/.agents/skills/humanizer/SKILL.md`
2. Scan for AI patterns: significance inflation, -ing filler phrases, vague attributions, rule-of-three bullets, promotional tone
3. Rewrite to **natural enterprise prose** — for Lenix, that means **neutral, direct, and credible**, not casual blog voice
4. Match homepage rhythm: mix short and medium sentences; one idea per bullet

**Enterprise exception:** Do not add humor, hot takes, or first-person filler on legal/compliance pages. “Human” here means **written by a knowledgeable person**, not chatty.

---

## 4. Page structure templates

### Standard marketing page

```
Header
Hero (text-first, compact)
Optional: overview grid OR anchor nav (not both in hero)
2–4 content sections (mixed patterns)
CTA (centered, Home.Cta pattern)
Footer
```

### Service / intake page (e.g. recovery)

```
Header
Hero (split optional; real image, no mock UI)
Process / capabilities
Social proof or stats (factual only)
FAQ (honest answers)
Intake form
Footer
```

### i18n

- Add `messages/en/<page>.json`
- Register in `src/i18n/request.ts` with English fallback for other locales
- Never hardcode long strings in components if the page is user-facing

---

## 5. Component conventions

- **Server components** + `getTranslations` from `next-intl/server` for static marketing pages
- **Client components** only when hooks/interactivity required
- Shared section header: `HomeSectionHeader`
- One primary CTA per section; secondary CTA optional, same style system
- Forms: `rounded-md` fields, `neutral-950` backgrounds, no glowing submit buttons

---

## 6. Anti-patterns from past iterations (learned)

| Mistake | Fix |
|---------|-----|
| Same 2-col layout × 4 | Mix pillars grid, 3-col, banner between splits |
| Casual humanizing (“bank queue”, “sales script”) | Enterprise direct tone per §3 |
| Over-humanizing into startup voice | Boundaries + specificity like Home.Hero |
| Gimmick variants (metrics/steps/cards per section) | Reuse homepage patterns only |
| Service grid inside hero | Hero = intro only; grid is its own section |
| Removing glass on recovery | Keep `glass` on forensic pages only |

---

## 7. Pre-ship checklist

Before considering a page done:

**Research & content**

- [ ] Page purpose and primary user action documented
- [ ] Target user research noted (search or cited inputs)
- [ ] Problem → Lenix mapping is specific
- [ ] Copy humanizer pass completed
- [ ] Voice matches `Home.Hero` (no startup pitch)
- [ ] Claims are truthful and bounded
- [ ] Copy lives in `messages/en/*.json`

**UI**

- [ ] Uses `home` or `glass` tokens consistently
- [ ] No forbidden patterns (§2)
- [ ] Section layout variety where page has 3+ sections
- [ ] Real images with alt text
- [ ] Yellow accent used sparingly
- [ ] Responsive at sm / lg breakpoints
- [ ] `npm run build` passes

**Accessibility**

- [ ] Semantic headings (one H1 per page)
- [ ] Keyboard-accessible interactive elements
- [ ] Sufficient contrast on text and buttons

---

## 8. Quick reference — good vs bad copy

**Hero — bad (startup):**

> Complete Crypto Solutions for the Modern Digital Economy. Leverage institutional-grade infrastructure to unlock seamless value across the ecosystem.

**Hero — good (enterprise):**

> Blockchain forensics and recovery for stolen digital assets. Lenix traces funds across chains and prepares evidence for exchanges and counsel — before you commit to an engagement.

**Feature bullet — bad:**

> Harnessing cutting-edge blockchain analytics to deliver unparalleled traceability across the evolving digital asset landscape.

**Feature bullet — good:**

> Tracing across major EVM networks, Bitcoin, and commonly used stablecoins.

**CTA — bad:** “Explore the future of finance →”  
**CTA — good:** “Start a recovery case” / “Contact us”

---

## 9. File locations

| Item | Path |
|------|------|
| Default design tokens | `src/lib/home-styles.ts` |
| Glass tokens (forensic) | `src/lib/recovery-styles.ts` |
| Section header | `src/app/[locale]/components/home/home-section-header.tsx` |
| English copy | `messages/en/*.json` |
| i18n loader | `src/i18n/request.ts` |
| Humanizer skill | `~/.agents/skills/humanizer/SKILL.md` |
| This guide | `docs/enterprise-page-design-guide.md` |

---

*Last updated: project standard for Microsoft-tier production pages. When in doubt, match the homepage — not a Dribbble crypto template.*
