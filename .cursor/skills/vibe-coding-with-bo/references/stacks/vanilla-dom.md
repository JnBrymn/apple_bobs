# Stack: vanilla DOM

**Mode A default** for clicker, story, puzzle (grid of divs), menus, shops.

## Structure

- `#app` container; `innerHTML` or `createElement` for panels.
- State in plain objects; `render()` syncs DOM to state (simple **React-like** pattern without framework).

```js
const state = { coins: 0, upgrades: [...] };
function render() {
  document.getElementById('coins').textContent = state.coins;
}
```

## Patterns

- **Economy loop** — [design-patterns.md](../design-patterns.md)
- **Scene FSM for story** — hide/show sections or rebuild choice buttons from `scenes[id]`
- **Puzzle grid** — CSS `display: grid` on wrapper; cell `data-r` `data-c`

## Events

`onclick` on buttons; for keyboard puzzles `keydown` on `window` with `preventDefault` for arrows.

## When to leave

Hundreds of dynamic nodes per frame, canvas effects, or complex animations → canvas or Vite ([vite-vanilla.md](vite-vanilla.md)).
