# Archetype: shooter / tower defense

## Game design pattern

**Shooter:** entity list + projectile pool + spawn timer. **TD:** path waypoints + tower list + range query each tick + wave table.

## Mode A stack

[vanilla-canvas](../stacks/vanilla-canvas.md).

## Mode B stack

[Phaser](../stacks/phaser-2d.md) — groups, overlap, bullet pool plugin pattern.

## Key structures

Shooter: `player`, `bullets[]`, `enemies[]`, `spawnCooldown`.  
TD: `path[]`, `towers[]`, `enemies[]`, `waveIndex`, `gold`.

## Patterns

Entity list, wave spawner, AABB or circle distance for hit/range ([design-patterns](../design-patterns.md)).

## Escalate when

10+ tower types, status effects, projectile arcs — engine groups help.
