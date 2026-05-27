# Archetype: arcade / reflex

## Game design pattern

**Skill loop:** input → short feedback window → fail state → instant restart. Score = time or distance. Difficulty = speed / spawn rate ramp (**design pattern:** dynamic difficulty adjustment via timers).

## Mode A stack

[vanilla-canvas](../stacks/vanilla-canvas.md) — RAF loop, `dt`-based movement.

## Mode B stack

[Phaser 3](../stacks/phaser-2d.md) — sprites, particles, multiple obstacle prefabs.

## Key structures

`player`, `obstacles[]`, `gameState: MENU|PLAY|DEAD`, `score`, `speedMultiplier`.

## Patterns

Game loop, input snapshot, AABB collision, entity list (obstacles as entities), fast restart FSM.

## Escalate when

Many animated sprites, parallax layers, mobile touch plugins — not for “one pipe gap” clone.
