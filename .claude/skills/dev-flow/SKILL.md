---
name: "dev-flow"
description: Guide the user step by step through the whole AI-assisted development flow (to-brief → grill-me → to-requirements → to-issues → tdd → optional code-review), working out where they are from the files in .claude/docs/<feature-slug>/ and doing the next step. Use whenever the user starts or resumes a feature, says "what's next", "pick up where we left off", "next issue", "start a new feature", "let's build X", or runs /dev-flow in a fresh session.
---

# Dev Flow

You're the conductor, not a player. The other skills do the work. Your job is to work out **where the user is**, **say what comes next and why**, and **run it** with the user confirming between stages. Planning runs in one flow. Implementation runs **one issue per fresh session**, because each issue deserves a clean context inside the smart zone (well under ~100k tokens).

Keep your own footprint small. Read issue **frontmatter**, not whole files, and don't load the PRD unless a step needs it. Every token you spend on orchestration is a token the real work can't use.

## Where the plan lives

This repo carries its own workflow: the skills are in `.claude/skills/` and every planning document is in `.claude/docs/<feature>/` (`brief.md`, `prd.md`, `issues/NN-*.md`, `KANBAN.md`). Both are committed.

Cloud sessions are always a **fresh clone on a new branch cut from the default branch** (`main`). So anything a fresh session needs must be **on `main`**:
- **Planning (stages 1–4)** happens on one branch. When the board is written, commit `.claude/docs/<feature>/`, push, and open a **planning PR** into `main` (ask before opening it if the repo's rules say so). The user merges it before building starts.
- **Building (stage 5)**: every issue is done in its own fresh session, on that session's own branch, and lands on `main` through its **own PR**. The issue's status changes are committed in the same PR as its code.
- **Never gitignore `.claude/docs/`**, and decline if a sub-skill offers to. **Don't delete finished docs**; they stay as the record of the feature.
- `KANBAN.md` is generated. If two PRs conflict on it, don't hand-merge it: take either side and regenerate it from the issue files.

## The flow

| Stage | Skill | Produces |
|---|---|---|
| 1. Brief | `to-brief` | `brief.md` |
| 2. Align | `grilling` | shared understanding |
| 3. Destination | `to-requirements` | `prd.md` |
| 4. Plan | `to-issues` | `issues/NN-*.md` + `KANBAN.md`, then planning PR |
| 5. Build | `tdd`, one issue per session | code + checks, one PR per issue |
| 6. Review (optional) | `code-review` | fixes, plus new issues |

Use the **project skills** in `.claude/skills/` (they show up unprefixed, e.g. `to-brief`, `grilling`). If an account-level skill with the same name also appears (e.g. `anthropic-skills:to-brief`), prefer the project one: it writes to `.claude/docs/`. **Invoke them yourself** when the user confirms a gate; never hand back a slash command for the user to type.

Sub-skills end with their own hand-off lines ("Next: run `/x`"). Those are for standalone use. Under dev-flow, ignore them and follow this flow's gates and the plan rules above.

## 1. Work out where we are

Look in `.claude/docs/` on the current branch (which starts as a copy of `main`).

Ignore any feature folder whose issues are **all `done`**: it's finished. Of the rest:
- **None** → new feature. Go to Planning, stage 1.
- **One** → use it.
- **Several** → list them with a one-line status each and ask which one.

Then find the stage from the files present:

| Found | Stage |
|---|---|
| no `brief.md` | 1 Brief |
| `brief.md`, no `prd.md` | 2 Align (ask whether grilling is already done in this conversation; if so, go to 3) |
| `prd.md`, no `issues/` | 4 Plan |
| `issues/` with any status other than `done` | 5 Build |
| every issue `done` | 6 Review / wrap up |

If `.claude/docs/` has nothing for the feature the user means, the plan may still be on an unmerged planning branch. Run `git fetch origin` and check `git ls-tree -r --name-only origin/<branch> .claude/docs` on recent branches. If you find it, tell the user its planning PR needs merging first (or offer to open one).

Tell the user in one line: *"`points-for-lessons`: 2 of 5 issues done, 03 is next."*

## 2. Planning (stages 1–4): drive it

Stay on the branch this session was given (cloud sessions name it for you), or follow the repo's branching convention elsewhere.

Run each stage's skill in turn. **Between stages, stop and confirm**, e.g. "Brief look right? Ready to grill?". These gates exist because each stage builds on the last, so a wrong brief makes a wrong PRD, which makes wrong issues. A ten-second check now is cheaper than re-slicing later.

At stage 2, once the user confirms the brief, **invoke `grilling` yourself in the same turn** (`grill-me` is only a user-typed alias for it). If `domain-modeling` or `grill-with-docs` is installed, mention once that they also write a `CONTEXT.md` glossary and decision records (ADRs), which `tdd` uses for naming: more tokens, but worth it once for a repo you'll stay in.

After stage 4, commit `.claude/docs/<feature>/`, push, and open the planning PR (see "Where the plan lives"). Then **stop**. The planning conversation is long, so tell the user:
> Board's ready. Merge the planning PR into `main`, then open a **fresh session** on this repo and run `/dev-flow` to start issue 01.

## 3. Build (stage 5): one issue per session

### a. Rebuild the board
Regenerate `KANBAN.md` from the issue files using [kanban-format.md](kanban-format.md). This also moves to Ready any backlog issue whose blockers are all done.

### b. Close out anything in review
`in-review` on `main` means the issue's PR was merged and is **waiting for the user's manual QA**. Passing checks don't prove the feature works the way a person would use it. For each one, ask: *"Did 02 pass your QA?"*
- **Yes** → set it to `done`.
- **No** → record what they found. A small fix to the same behaviour goes back to `in-progress` with a note, and is resumed in this session. Anything new becomes a new issue (next number, `blocked_by` as appropriate).

Rebuild the board if anything changed. These status changes are committed with this session's work.

### c. Check for work in flight
Issues being built in other sessions aren't on `main` yet, so they still look `ready` here. Before picking, run `git fetch origin` and, for each remote branch other than `main`, check whether it changes any issue file in this feature:

```bash
git diff --name-only origin/main...origin/<branch> -- .claude/docs/<feature>/issues
```

Treat any issue a branch changes as **taken**. Mention it in one line ("04 is in flight on `<branch>`, PR not merged yet") and don't pick it.

### d. Pick
Pick a `ready` issue that isn't taken: the lowest number, unless another unblocks more work. Say which one and why in one line, and confirm.

### e. Implement
1. Set the issue to `status: in-progress`. Record `start_commit: <current HEAD sha>` in its frontmatter, so review has a fixed point.
2. Run `tdd` with the issue file. Its **Seams under test** are already agreed, so confirming seams should be a quick "as the issue says". Its acceptance criteria are what the checks prove.
3. Run the feedback loops: tests, type check, lint, whatever the repo has, plus the issue's own checks.
4. Commit (one commit or a few) with the issue number in the message.
5. Set `status: in-review`, rebuild the board, commit the status change, push, and open the issue's PR into `main` (ask first if the repo's rules say so).

### f. Hand off
> 03 is done and its PR is open: <link>. To QA it: <one line on what to try by hand>. Merge it when you're happy, then open a **fresh session** and run `/dev-flow`. I'll ask about QA, then pick up the next issue.

Don't start the next issue in this session, even if the user is keen. The context is already used up, and a fresh start is what keeps quality steady across the board.

## 4. Review (stage 6): optional, and run once

Review isn't run per issue, to save tokens. Offer it:
- **When every issue is `done`**: one review across the whole feature.
- **Halfway through**, only if the feature has **more than 6 issues**: catch drift before it spreads.

The user can also run `/code-review` themselves at any point.

If they accept, run `code-review`, using the earliest issue's `start_commit` as the fixed point and `prd.md` as the spec. Then:
- **Small fixes and refactors** → apply them in this session, keeping checks green, and open a PR.
- **Anything bigger** → a new issue on the board.

Be honest about the trade-off when offering: `tdd` leaves refactoring out of its loop, so skipping review means skipping refactoring.

## 5. Wrap up

When the board is all `done` (and review is done or declined), make sure the final `done` statuses and board are merged to `main`. Leave `.claude/docs/<feature>/` in place as the record of the feature: step 1 ignores finished folders, so it won't be picked up again.
