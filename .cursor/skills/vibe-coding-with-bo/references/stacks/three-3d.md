# Stack: Three.js (3D)

**Mode B** for 3D worlds, FPS-style movement, obbies, vehicle sims.

## Core graph

`Scene` → `Camera` + `Renderer` → `Mesh` objects with `Geometry` + `Material`.  
Loop: `renderer.render(scene, camera)` in RAF.

## Controls

`PointerLockControls` or simple WASD on `camera.position` + raycast ground.  
**Design pattern:** separate **camera rig** from **player avatar** mesh.

## Physics

Start with AABB on grid or simple `y` floor collision. Add **Rapier** / **cannon-es** only if Bo needs stacks, pushes, vehicles.

## Assets

`GLTFLoader` for models; keep poly count low for browser. Texture sizes ≤ 1024 for GitHub Pages bandwidth.

## Publish

Vite + three → build → `modern/<name>/` with `index.html` + `assets/`.  
`base: './'` in Vite config.

## vs Phaser

2D gameplay → Phaser. Any true 3D camera → Three.
