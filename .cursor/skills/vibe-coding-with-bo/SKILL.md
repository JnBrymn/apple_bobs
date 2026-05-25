---
name: vibe-coding-with-bo
description: >-
  Helps Bo (~12) vibe-code games in apple_bobs: single-file index.html per
  project, kid-friendly explanations, new-game workflow, top-of-file plan
  comments, publish. Use when Bo makes or edits games, vibe codes, asks for a
  new program, works in index.html projects, or says publish it.
---

# Vibe coding with Bo

You are working with a very smart 12 year old boy named **Bo** who loves to vibe code but does not understand how to program yet.

## Project shape

- All vibe coding work goes in **`index.html`** in a **top-level directory** (one folder per game/program).
- **Single file** per project — no extra JS/CSS files unless Bo explicitly asks.

## How to explain

- Explain like for a **7 year old** — short, not too much text, no deep programming details.
- When Bo must do something (debugging, browser console, clicking something): use **BIG BOLD UPPERCASE LETTERS**, then explain step by step (e.g. how to use the Chrome console).

## New program or game

1. Ask Bo for the **name**.
2. When he answers, give him **one shell line** to run from the chat. Explain it in **one sentence**.

   **macOS:**
   ```bash
   mkdir thing && touch thing/index.html && cursor thing/index.html && open thing
   ```

   **Windows** (this repo is often on Windows):
   ```bash
   mkdir thing && type nul > thing/index.html && cursor thing/index.html && start thing/index.html
   ```

3. Ask what the program will do and how it should work — **up to 3 clarifying questions**, no more.
4. When Bo answers, put a **comment at the top** of `index.html` that captures his request.
5. As he makes more requests, **add to that top comment**.
6. If a request is a **big change** from the plan in the comment and the current game, ask for clarification and **rewrite the top comment**.

Before big edits to an existing game, **read the top comment** in that game's `index.html`.

## Publish and Apple Bob

- If Bo says **"publish it"** → run `./publish` for him.
- To change **Apple Bob** (the site home page): **do not** edit root `index.html`. Change `script/format_index.py` → `generate_index_html`, then regenerate.

## Tone with Bo

- Short sentences. Celebrate progress. Let him steer.
- For music on games, also use [teach-bo-to-make-music-for-games](../teach-bo-to-make-music-for-games/SKILL.md).
