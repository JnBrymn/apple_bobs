# Technology stacks

Constraint: **Apple Bobs** = static **GitHub Pages**. `./publish` registers any `**/index.html` except repo root. No server, no backend unless parent adds external hosting later.

## Mode A — default (top-level `<game>/index.html`)

| Stack | Use when | Build |
|-------|----------|-------|
| **Vanilla DOM** | UI-heavy, turn-based, clicker, story, puzzle grids as divs | None — open HTML in browser |
| **Vanilla canvas + RAF** | Real-time 2D: movement, collision, particles | None |
| **Inline Web Audio API** | SFX/music without files | Oscillators / short buffers in JS |
| **`<audio>` + files** | Bo has `.mp3`/`.mid` in folder | Rare in Mode A (extra files) |

**Avoid in Mode A:** npm, bundlers, TypeScript, multiple modules (unless Bo explicitly wants files), frameworks that expect a build step.

## Mode B — modern (`modern/<game>/`)

| Stack | Use when | Build / deploy |
|-------|----------|----------------|
| **Vite + vanilla TS/JS** | Large logic, many files, no physics engine | `npm run build` → copy `dist/index.html` + assets into publish path |
| **Phaser 3** | 2D sprites, tilemaps, physics, scenes, arcade games | CDN in thin `index.html` *or* Vite + phaser → ship built `index.html` |
| **Three.js** | 3D camera, meshes, FPS/adventure | Vite + three; watch bundle size |
| **Kaboom.js** | Bo wants code-y 2D fast; smaller API than Phaser | Script tag or Vite |
| **p5.js** | Procedural art, toys, education | Script tag in single file possible |

Parent runs `npm install` / build. Always end with a **playable `index.html`** under `modern/<name>/` for the menu.

## Stack ladder (pick the **lowest** that fits)

```
DOM UI  →  canvas + game loop  →  Vite multi-file  →  Phaser / Kaboom  →  Three.js
```

Escalate when Mode A hits: **>800 lines**, tilemap editor needs, built-in physics, 3D, or asset pipelining (sprite sheets, atlases).

## Genre → default stacks

See [genres/README.md](genres/README.md). Summary:

| Archetype | Mode A | Mode B |
|-----------|--------|--------|
| Clicker / idle | DOM | Vite if economy tree huge |
| Arcade / reflex | Canvas RAF | Phaser |
| Platformer | Canvas RAF | Phaser + arcade physics |
| Top-down / maze | Canvas or DOM grid | Phaser tilemap |
| Shooter / defense | Canvas RAF | Phaser |
| Puzzle | DOM or canvas | Usually Mode A |
| Story / choices | DOM + scene object | Vite + JSON scenes |
| Sim / sandbox | Canvas grid | Phaser or Three (3D) |

## Engine guides

- [stacks/vanilla-canvas.md](stacks/vanilla-canvas.md)
- [stacks/vanilla-dom.md](stacks/vanilla-dom.md)
- [stacks/vite-vanilla.md](stacks/vite-vanilla.md)
- [stacks/phaser-2d.md](stacks/phaser-2d.md)
- [stacks/three-3d.md](stacks/three-3d.md)

## Cross-cutting patterns

[design-patterns.md](design-patterns.md) — loop, collision, FSM, entities, grid. Compose with any stack.
