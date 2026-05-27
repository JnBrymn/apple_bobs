# Archetype: story / branching choices

## Game design pattern

**Directed graph:** nodes = scenes; edges = choices. **Flags** on `state` gate edges. Endings = terminal nodes or `endingId` tags.

## Mode A stack

[vanilla-dom](../stacks/vanilla-dom.md) — data-driven `scenes` object.

## Mode B stack

[Vite](../stacks/vite-vanilla.md) — `scenes.json`, optional TypeScript types for content.

## Key structures

```js
scenes: { id: { text, choices: [{ label, next, require?: flag }], setFlags?: {} } }
state: { flags: Set|object, endingSeen: [] }
```

## Patterns

Scene FSM; separate content from renderer ([design-patterns](../design-patterns.md)).

## Escalate when

Content >100 nodes, localization, conditional inline markup — not for 8-scene prototype.
