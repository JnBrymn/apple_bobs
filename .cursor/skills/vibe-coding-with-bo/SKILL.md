---
name: vibe-coding-with-bo
description: >-
  Helps Bo build games in apple_bobs. Tech: vanilla DOM/canvas (Mode A) or
  Phaser/Three/Vite (Mode B modern/). Design patterns and archetypes in
  references/. Use when vibe-coding games, picking stacks, or modern game.
---

# Vibe coding with Bo

**Bo** (~12) loves to vibe code. He does not know programming yet — keep explanations short (like for a ~7 year old). Use **BIG BOLD UPPERCASE** only when he must click or use the browser console.

**Pick a mode first** (see below). Do not mix Apple Bobs rules into a Modern game, or Modern rules into a normal Apple Bobs game.

For game music → [teach-bo-to-make-music-for-games](../teach-bo-to-make-music-for-games/SKILL.md).

---

## Which mode?

| Bo says / situation | Mode |
|---------------------|------|
| New game, tweak game, “publish it”, normal vibe coding | **Apple Bobs game** (default) |
| **“Modern game”** (or parent says modern) | **Modern game** |
| Unsure | Ask once: *“Apple Bobs game (one file in the browser) or a modern game (bigger project)?”* Default to **Apple Bobs** if he does not care. |

---

## Mode A — Apple Bobs game (default, most projects)

Single browser games published on **GitHub Pages** via `./publish`. The site lists every `**/index.html` except the repo root.

### Shape

- One **top-level folder** per game (e.g. `perfect mine/`).
- **One file:** `index.html` (HTML + CSS + JS together). No extra files unless Bo explicitly asks.

### New game

1. Ask the **name**.
2. Give **one shell line** (one sentence what it does):

   **macOS:** `mkdir thing && touch thing/index.html && cursor thing/index.html && open thing`

   **Windows:** `mkdir thing && type nul > thing/index.html && cursor thing/index.html && start thing/index.html`

3. Ask what it does — **up to 3 questions**, no more.
4. **Stack & patterns** — [references/tech-stacks.md](references/tech-stacks.md) → [references/design-patterns.md](references/design-patterns.md) → archetype in [references/genres/README.md](references/genres/README.md) → stack guide in [references/stacks/](references/stacks/).
5. Put Bo’s plan in a **comment at the top** of `index.html`; update it as ideas change.
6. Big plan change → ask Bo, then **rewrite** the top comment.

Before large edits, **read that top comment**.

### Publish & home page

- **“publish it”** → run `./publish` from repo root.
- Change **Apple Bob** menu/site chrome → edit `scripts/format_index.py` (`generate_index_html`), not root `index.html`.

---

## Mode B — Modern game

When Bo wants a **modern game**, **ignore** Mode A limits (single file, vanilla-only, etc.). Use the **best approach for his idea** — engine, structure, and tools that fit the game.

### Shape

- Project lives under **`modern/<game-name>/`** (use Bo’s name; lowercase folder with spaces OK if he insists, match existing repo style).
- **Subfolders/files as needed** (src, assets, config, build output, etc.).
- **Must still be playable on Apple Bobs** when he publishes: GitHub Pages needs a reachable **`index.html`** under that folder (built `dist/` copied in, or a thin `index.html` that loads the game). `./publish` only discovers games via `**/index.html`.

### Workflow

1. **Archetype + stack** — [references/tech-stacks.md](references/tech-stacks.md), [references/design-patterns.md](references/design-patterns.md), matching [references/genres/](references/genres/) file, then [references/stacks/](references/stacks/) for Phaser/Three/Vite.
2. **Project** — `modern/<name>/`; build must output playable `index.html` ([references/modern-games.md](references/modern-games.md)).
3. Parent runs `npm` when needed. After first use of an engine, extend the matching stack doc if something repo-specific was learned.

---

## Tone

Short sentences. Let Bo steer. Celebrate wins.
