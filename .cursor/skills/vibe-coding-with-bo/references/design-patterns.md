# Game design & code patterns

Reusable patterns across stacks. Names match common gamedev vocabulary so parent/agent can communicate precisely.

## Core runtime

### Game loop (real-time)

`requestAnimationFrame` → `dt` → `update(dt)` → `render()`.  
Separate **simulation** from **drawing**. Fixed timestep optional for physics-heavy games.

### Input snapshot

Per frame, read keys/pointer into `input = { left, right, jump, click }` — avoids missed keydown during one frame.

### Entity list

`entities[]` with `{ x, y, vx, vy, w, h, type, dead }`. Update all → filter dead → draw all. Bullets/enemies/pickups are entities.

### AABB collision

Axis-aligned boxes: overlap if `a.x < b.x+b.w && a.x+a.w > b.x` (same for y). Use for platform feet, hitboxes, triggers.

### Spatial grid (optimization)

Divide world into cells; only check collisions in same/adjacent cells when entity count > ~30.

## World representation

### Tile grid

`map[row][col]` of integers; 0 = empty, 1 = wall. Rendering: `fillRect(col*T, row*T, T, T)`.  
**Design:** layer for background, foreground, collision (same index or separate arrays).

### Platform segments

Array of `{ x, y, w, h }` — not always tile-aligned. One-way platforms: collide only when `vy >= 0` and previous y above platform.

### Scene / state machine

States: `MENU | PLAY | PAUSE | GAME_OVER`. Only handle input in PLAY. Transitions on events (`lives === 0` → GAME_OVER).

### Branching narrative (story)

`scenes[id] = { body, choices: [{ text, next }] }`. **Flags:** `state.hasKey` gates choices. Separate **content** (data) from **renderer** (DOM).

## Gameplay systems

### Economy loop (clicker / idle)

`currency`, `clickPower`, `upgrades[]` with `{ cost, multiplier }`.  
Pattern: **producer** (click) → **sink** (shop) → **feedback** (DOM update). Idle: `setInterval` or `lastTick` + `dt` on visibility.

### Wave spawner (shooter / defense)

`wave`, `spawnTimer`, `enemyTemplate`. Timer decrements → push enemy → when empty and no enemies, `wave++`. Difficulty scales spawn interval or HP.

### Tower placement (TD)

Grid cell → validate (path not blocked, afford cost) → `towers.push({ cell, range, dps })`. Enemies on **path waypoints**; towers query range each tick.

### Move validation (puzzle)

`applyMove(state) → newState | null`. Never mutate without validating. Win: `isWin(state)`, Lose: `isLose(state)`.

### Crafting (sim)

`recipes = [{ in: { iron: 2 }, out: { pick: 1 } }]`. Inventory map `id → count`. Craft = subtract inputs, add outputs if `canCraft`.

## Feel (design, not library-specific)

- **Coyote time / jump buffer** — platformers: grace frames after leaving ledge / before landing.
- **Fast restart** — arcade: death → reset state in &lt;300ms, no full page reload.
- **Juice** — screen shake, flash, scale punch on hit (canvas transform or CSS).

## Anti-patterns

| Avoid | Prefer |
|-------|--------|
| Giant `if` per object type in one update | Entities + `type` switch or small behavior table |
| `setInterval` for game sim at 60fps | `requestAnimationFrame` + `dt` |
| Mixing DOM and canvas for same moving objects | One renderer for world |
| Global variables for everything | One `game` object / module scope |
| Building Phaser for a 2048 clone | DOM grid |
