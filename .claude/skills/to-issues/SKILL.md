---
name: "to-issues"
description: Break a PRD into vertical-slice (tracer-bullet) issues, written as local markdown files with blocking edges, HITL/AFK tags and a KANBAN.md board at .claude/docs/feature-slug/. The fourth step of the dev-flow pipeline (to-brief → grill-me → to-requirements → to-issues → tdd). Use when the user has a prd.md and wants it broken into tasks, tickets, issues, a backlog or a board, or says "plan the work", "slice this up" or "what do we build first", even if they don't say "issues".
---

# To Issues

Turn the PRD into a set of **issues**. Each issue is a **vertical slice**: a narrow but complete path through every layer the behaviour needs, which can be shown working or checked on its own.

## Why vertical, not horizontal

Systems have layers: database, service, API, frontend. Left to itself, an agent builds them one at a time, all of the schema, then all of the API, then all of the UI. Each layer gets built and tested on its own, and nobody finds out whether the feature actually works until the end, when integration bugs are most expensive and the human has had nothing to look at for days.

A vertical slice is like a **tracer bullet**: one thin round that goes the whole distance and shows straight away whether you're on target. Later slices thicken the path you've already proven.

> **Horizontal (avoid):** 01 Create points schema → 02 Build points service → 03 Add points API → 04 Show points on dashboard. Nothing works until 04.
>
> **Vertical (do):** 01 Award points when a lesson is completed **and show the total on the dashboard** (just enough schema, service and UI for that). 02 Show points per lesson in the history view. 03 Award a bonus for a 5-day streak. Each one can be demoed when it's finished.

## Inputs

- `.claude/docs/<feature>/prd.md`, passed as an `@` reference, or found in `.claude/docs/`.
- The PRD's **Testing Decisions** (the agreed seams). Issues reference these seams rather than inventing new ones.

If the PRD has **Open Questions** that affect how the work splits, raise them first. Slicing around an unknown usually means re-slicing later.

## Process

### 1. Explore (if needed)

If you haven't explored the codebase in this session, do so, ideally with a subagent that returns a short summary. Use the project's vocabulary (`CONTEXT.md`, if it exists) in issue titles. Look for **prefactoring** opportunities ("make the change easy, then make the easy change"). These become early issues that block the slices which need them.

### 2. Draft the slices

Rules:
- Each slice cuts through **every layer it needs, and no more**.
- A finished slice can be **demoed or checked on its own**.
- Each slice fits in **one fresh context window**. If you can't picture one session finishing it, split it.
- **Issue 01 is the tracer bullet**: the thinnest slice that goes all the way through the stack.
- Prefactoring comes first.

**Exception for wide refactors.** Some changes are a single mechanical edit that breaks call sites all over the codebase at once, e.g. renaming a column or retyping a shared symbol. No vertical slice can stay green through that. Sequence it as **expand → migrate → contract** instead: add the new form beside the old one, migrate callers in batches (one issue per batch, each blocked by the expand), then delete the old form in an issue blocked by every batch.

For each issue, decide:
- **Blocked by**: only issues that *genuinely* gate it. Extra edges stop work that could run in parallel.
- **Type**: `HITL` if it needs a human's judgement during the work (UI or visual taste, product calls, anything you'd want to watch), `AFK` if acceptance criteria and tests are enough. This is information only for now, but it's cheap to record at writing time and makes a later unattended loop possible.

### 3. Self-check

Before showing the user, look at each issue: **does it touch only one layer?** If so, either merge it into the slice that uses it, or keep it with a one-line reason, e.g. "prefactor: extract mailer behind an interface". A single-layer issue with no reason is the horizontal habit creeping back in.

### 4. Quiz the user

Present the breakdown as a numbered list, in dependency order:

```
01 Award points on lesson completion + show total on dashboard   [HITL]
   Blocked by: none
   Delivers: completing a lesson adds 10 points; dashboard shows the total
02 Points history per lesson                                      [AFK]
   Blocked by: 01
   ...
```

Then ask:
- Is the granularity right (too coarse / too fine)?
- Are the blocking edges right?
- Should anything be merged or split?
- Do the HITL/AFK tags look right?

Iterate until the user approves. Don't write files before then, because rewriting ten files is more expensive than editing a list.

### 5. Write the files

- One file per issue: `.claude/docs/<feature>/issues/NN-<slug>.md`, numbered from `01` in dependency order (blockers first). Use [issue-template.md](issue-template.md).
- Initial `status`: `ready` if nothing blocks it, otherwise `backlog`.
- Write `.claude/docs/<feature>/KANBAN.md` using [kanban-format.md](kanban-format.md).

Each issue file is the **only** place its status is stored. `KANBAN.md` is a generated view that `dev-flow` rebuilds from the issue files, so it's never edited by hand. Two copies of the status would soon disagree.

In issues, describe behaviour and decisions, **not file paths or code**. They go out of date fast.

### 6. Hand off

> N issues written to `.claude/docs/<feature>/issues/`, board at `KANBAN.md`. Next: start a **fresh session** and run `/dev-flow` (or `/tdd @.claude/docs/<feature>/issues/01-…md`).

A fresh session matters. The planning conversation is long by now, and implementation works best inside the smart zone.
