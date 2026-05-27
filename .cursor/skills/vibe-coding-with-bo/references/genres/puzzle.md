# Archetype: puzzle

## Game design pattern

**State transformation:** legal moves only; immutable or copied state; win/lose predicates. No continuous physics — **event-driven** updates.

## Mode A stack

[vanilla-dom](../stacks/vanilla-dom.md) grid, or canvas for slide animations between discrete states.

## Mode B stack

[Vite](../stacks/vite-vanilla.md) + level JSON if many boards.

## Key structures

`board[][]`, `applyMove(dir) → board' | null`, `isWin(board)`, `moveCount`.

## Patterns

Move validation; undo stack optional (`history[]`).

## Escalate when

Level editor output, hundreds of levels — not for single 2048 board.
