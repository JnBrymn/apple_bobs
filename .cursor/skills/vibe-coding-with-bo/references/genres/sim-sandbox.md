# Archetype: sim / sandbox

## Game design pattern

**Cellular world + inventory:** break/place rules on grid; recipe graph for craft; optional tick simulation (growth, machines). Scope explodes — ship **minimal** slice: dig, place, 3 blocks.

## Mode A stack

[vanilla-canvas](../stacks/vanilla-canvas.md) — `world[][]`, `inventory{}`, click pick/place.

## Mode B stack

2D: [Phaser](../stacks/phaser-2d.md) tilemap. 3D voxel/mine: [Three.js](../stacks/three-3d.md) + chunked meshes later.

## Key structures

`world[w][h]`, `blockTypes`, `recipes[]`, `player.selectedSlot`.

## Patterns

Tile grid, crafting pattern, spatial grid for entities (mobs) ([design-patterns](../design-patterns.md)).

## Escalate when

3D camera, chunk streaming, multiplayer — Three / modern only; never one-file for full Minecraft clone.
