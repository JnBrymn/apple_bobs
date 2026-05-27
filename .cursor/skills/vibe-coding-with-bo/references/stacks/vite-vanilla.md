# Stack: Vite + vanilla (or light TS)

**Mode B** when logic splits across many files but **no** full game engine.

## Layout

```
modern/my-game/
  package.json
  vite.config.js
  src/main.js
  src/game/state.js
  src/game/render.js
  index.html          # entry, or dist/ copied for publish
```

## Config notes

- `base: './'` in Vite so GitHub Pages subpath works (`/apple_bobs/modern/my-game/`).
- Build: `npm run build` → deploy `dist/` contents to `modern/my-game/` (or symlink index).

## Patterns

Same as [design-patterns.md](../design-patterns.md); modules export `createGame()`, `update`, `render`.

## vs Phaser

Choose Vite vanilla when: no sprite sheet pipeline, no physics plugin, game is **data/UI heavy** (big story JSON, idle formulas).

Choose Phaser when: arcade physics, animations, tilemaps — [phaser-2d.md](phaser-2d.md).
