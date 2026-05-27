# Stack: Phaser 3 (2D)

**Mode B** for platformers, shooters, TD, tilemaps, sprite animation.

## Scenes (state machine)

`Boot` → `Menu` → `Game` → `GameOver`. Each scene: `preload`, `create`, `update(time, delta)`.

## Physics

- **Arcade** — `this.physics.add.sprite`, velocity, `collider`/`overlap` (platformer, arcade).
- **Matter** — ropes, constraints (only if Bo needs it).

## World

- **Tilemap** — Tiled JSON export; layers: ground, collision, decor.
- **Sprites** — atlas in `preload`; `anims.create` for walk/jump.

## Apple Bobs publish

Option A: Vite + `phaser` npm, build to `dist`, copy to `modern/<name>/index.html`.  
Option B: CDN Phaser in single `index.html` for smaller games (still Mode B folder if multi-scene files).

## Design patterns mapping

| Pattern | Phaser feature |
|---------|----------------|
| Entity list | Group `this.enemies`, `children.iterate` |
| Waves | Timer events + spawn callback |
| Platformer | Tilemap layer + arcade collider |
| TD | Path curve or waypoint list + overlap for range |

## Anti-patterns

Using Phaser for pure DOM clicker or static story — use [vanilla-dom.md](vanilla-dom.md).
