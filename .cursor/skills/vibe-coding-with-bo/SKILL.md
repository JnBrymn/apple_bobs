---
name: vibe-coding-with-bo
description: >-
  Helps Bo build games in apple_bobs. Tech: vanilla DOM/canvas (Mode A) or
  Phaser/Three/Vite (Mode B modern/). Design patterns and archetypes in
  references/. Save points = local git commits (ask Bo before saving). Use when
  vibe-coding games, picking stacks, or modern game.
---

# Vibe coding with Bo

**Bo** (~12) loves to vibe code. He does not know programming yet — keep explanations short (like for a ~7 year old). Use **BIG BOLD UPPERCASE** only when he must click or use the browser console.

**Pick a mode first** (see below). Do not mix Apple Bobs rules into a Modern game, or Modern rules into a normal Apple Bobs game.

For game music → [teach-bo-to-make-music-for-games](../teach-bo-to-make-music-for-games/SKILL.md).

---

## Save points

A **save point** is a snapshot of the game on disk. With Bo, always say **save** / **save point** — not “commit” or “git” unless he asks.

**Under the hood:** a save point is a **local git commit only**. Do **not** push. Do **not** run `./publish`. Publishing is separate from saving.

### When to save

After something **substantive** — a feature works, a big fix landed, a level or mechanic is in, a refactor that changed behavior, etc. — **ask Bo**:

> “Want to save a save point? We can come back to this if something breaks later.”

- Bo says **yes** → save (see below).
- Bo says **no** → keep going.
- Do **not** save silently. Do **not** skip asking when the milestone matters.

Good moments: first playable version, new enemy/weapon/level, bug fixed after a long hunt, “it feels done for today.”

### How to save

1. `git status` and `git diff` — know what changed.
2. Stage only game-related files for this session (not secrets).
3. Commit with a **clear message** Bo could read later in a list of saves:
   - What changed and **why** (not just file names).
   - Game name + feature in plain words, e.g. `stone_wars: add stone-throw attack and HP bar`.
   - One or two sentences max; future you (and Bo) should understand the save from the message alone.
4. Confirm briefly: “Saved. Save point: *\<short summary\>*.”

### When something breaks

If Bo says **“there’s a problem”**, **“there’s a bug”**, or **“I don’t know where it broke”**:

1. **Review save points** — `git log --oneline` (and `git log --oneline -- <game-folder>/` if the repo is busy). Read messages with Bo: *“Last save was when we added jumping — was jumping still working then?”*
2. **Compare saves** — checkout or diff between a good save and now; or `git show <save>` for what changed in one step.
3. **Bisect** when the break time is unclear — find which save introduced the bug (`git bisect` between last known-good and HEAD). Explain to Bo in save-point language: *“We’re checking the middle save to see if the bug was already there.”*
4. Fix forward from what you learn; **ask to save again** after the fix.

Save points are the safety net for vibe coding — use them often enough that going back one step is always possible.

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
- **`index.html`** is the home (HTML + shared CSS + glue). Start here.
- **Totally different parts** → new file in the **same folder**, loaded from `index.html`. Repeat for each new part. See `.cursor/rules/game-split-files.mdc`.

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
