# Stack: vanilla canvas + requestAnimationFrame

**Mode A default** for real-time 2D (arcade, platformer, shooter, small sim).

## Structure (single `index.html`)

```html
<canvas id="c"></canvas>
<script>
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
let last = 0;
const game = { player: {}, entities: [], keys: {} };

function update(dt) { /* physics, spawn, collision */ }
function render() { ctx.clearRect(0,0,canvas.width,canvas.height); /* draw */ }

function frame(t) {
  const dt = Math.min((t - last) / 1000, 0.05);
  last = t;
  update(dt);
  render();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
</script>
```

## Patterns to apply

[design-patterns.md](../design-patterns.md): game loop, input snapshot, entity list, AABB, tile grid, state machine.

## Resize

Set `canvas.width/height` from `clientWidth/Height` (and `devicePixelRatio` if crisp pixels needed).

## When to leave this stack

Tilemap editor workflow, sprite animations with atlas, built-in physics → Phaser ([phaser-2d.md](phaser-2d.md)).
