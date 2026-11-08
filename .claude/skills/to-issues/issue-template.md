---
id: NN
title: <Short descriptive title>
status: ready        # backlog | ready | in-progress | in-review | done
blocked_by: []       # e.g. [01, 03]
type: HITL           # HITL | AFK
start_commit:        # set by dev-flow when work starts
---

# NN: <Short descriptive title>

## What to build
<The end-to-end behaviour this issue makes work, from the user's point of view. Not a layer-by-layer task list.>

## Acceptance criteria
- [ ] <checkable by hand: "completing a lesson shows +10 on the dashboard">
- [ ] <…>

## Seams under test
- <where the behaviour is checked, taken from the PRD's Testing Decisions, e.g. "`POST /lessons/:id/complete` route", "dashboard render">

<!-- Seams, not test cases: tdd writes tests one red→green cycle at a time,
     each informed by the last. A pre-written test list pulls it towards
     writing all the tests up front. -->

## Notes
<optional: relevant PRD user stories (by number), prefactor reason, HITL reason>
