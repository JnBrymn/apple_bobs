# Game archetypes — stacks & patterns

Index by **design archetype**. Read [tech-stacks.md](../tech-stacks.md) and [design-patterns.md](../design-patterns.md) first, then the archetype file.

| Archetype | Design focus | Mode A stack | Mode B stack |
|-----------|--------------|--------------|--------------|
| [clicker-idle](clicker-idle.md) | Economy loop, producers/sinks | [vanilla-dom](../stacks/vanilla-dom.md) | Vite if huge |
| [arcade-reflex](arcade-reflex.md) | Game loop, collision, score | [vanilla-canvas](../stacks/vanilla-canvas.md) | Phaser |
| [platformer](platformer.md) | Gravity, platforms, goal | vanilla-canvas | Phaser arcade physics |
| [topdown-maze](topdown-maze.md) | Tile grid, blocking, triggers | canvas or DOM grid | Phaser tilemap |
| [shooter-defense](shooter-defense.md) | Entities, waves, range | vanilla-canvas | Phaser |
| [puzzle](puzzle.md) | Move validation, win check | vanilla-dom | Vite + JSON levels |
| [story-choices](story-choices.md) | Scene graph, flags | vanilla-dom | Vite + scene data |
| [sim-sandbox](sim-sandbox.md) | Grid world, inventory, craft | vanilla-canvas grid | Phaser / Three (3D) |

Pick archetype by **main loop** (what updates every frame or every turn).
