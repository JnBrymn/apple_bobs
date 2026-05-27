# Archetype: platformer

## Game design pattern

**Side-view kinematics:** gravity, horizontal accel, jump impulse, platform collision resolution. Win = reach goal flag. Optional: coyote time, jump buffer, moving platforms (velocity inheritance).

## Mode A stack

[vanilla-canvas](../stacks/vanilla-canvas.md) — platform segments array, not always uniform tiles.

## Mode B stack

[Phaser](../stacks/phaser-2d.md) — `arcade` physics, tilemap layers, sprite anims.

## Key structures

`player { x, y, vx, vy, onGround }`, `platforms[]`, `level { platforms, spawn, goal }`.

## Patterns

AABB + one-way platforms; state machine; tile grid if uniform blocks ([design-patterns](../design-patterns.md)).

## Escalate when

>1 scrolling level, animated tiles, slope physics — Phaser tilemap + colliders.
