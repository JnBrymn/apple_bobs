# Archetype: top-down / maze

## Game design pattern

**Grid locomotion:** discrete or smooth movement; **blocking** layer; **trigger** cells (door, item, NPC). Fog of war = render mask from explored set.

## Mode A stack

Canvas tile grid **or** DOM grid — canvas if smooth movement + many entities; DOM if turn-based steps.

## Mode B stack

[Phaser tilemap](../stacks/phaser-2d.md) — Tiled export, collision layer, object layer for spawns.

## Key structures

`map[][]`, `player { tx, ty }` or float `x,y`, `flags`, `inventory`.

## Patterns

Tile grid; FSM for dialogue overlay; spatial grid if many pickups.

## Escalate when

Large maps from editor, pathfinding NPCs, lighting layers.
