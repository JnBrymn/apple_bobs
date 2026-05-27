# Archetype: clicker / idle / tycoon

## Game design pattern

**Economy loop:** producers (clicks, generators) → currency → sinks (upgrades) → feedback. Optional: prestige layer, multiple currencies, offline earnings (`Δt` since last visit).

## Mode A stack

[vanilla-dom](../stacks/vanilla-dom.md) — `state` object, `render()` syncs UI.

## Mode B stack

[Vite](../stacks/vite-vanilla.md) when formulas, trees, and save/load split across modules. Phaser **not** needed.

## Key structures

```js
{ currency, clickPower, autoRate, upgrades: [{ id, cost, effect }] }
```

## Patterns ([design-patterns](../design-patterns.md))

Economy loop; optional FSM (`PLAY` only). Tick idle on `requestAnimationFrame` or `visibilitychange` + timestamp.

## Escalate when

Save slots, 50+ upgrade nodes, modals — not when “needs animation.”
