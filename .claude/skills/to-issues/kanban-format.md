# KANBAN.md format

`KANBAN.md` is a **generated view** of the `status:` fields in `issues/*.md`. Rebuild it from scratch each time instead of editing it in place.

## Rules

- **Columns**, in this order: Backlog, Ready, In Progress, In Review, Done.
- Each card is `[NN Title](issues/NN-slug.md)`, followed by ` · HITL` or ` · AFK`.
- Backlog cards also show what's still blocking them: ` · blocked by 01, 03`. Only list blockers that aren't `done` yet.
- **Promotion:** while building the board, any `backlog` issue whose blockers are all `done` should be set to `ready` in its issue file first.
- Under the Ready column, a "Can run in parallel" line lists Ready issues that don't block each other.
- The header shows counts per column.

## Example

```markdown
# Board: points-for-lessons

_Generated from issues/*.md. Don't edit by hand._
**Backlog 2 · Ready 2 · In Progress 0 · In Review 0 · Done 1**

## Backlog
- [04 Streak bonus](issues/04-streak-bonus.md) · AFK · blocked by 02, 03
- [05 Leaderboard](issues/05-leaderboard.md) · HITL · blocked by 04

## Ready
- [02 Points history per lesson](issues/02-points-history.md) · AFK
- [03 Level badges on profile](issues/03-level-badges.md) · HITL

_Can run in parallel: 02, 03_

## In Progress
_(none)_

## In Review
_(none)_

## Done
- [01 Award points + dashboard total](issues/01-award-points.md) · HITL
```
