---
id: 07
title: Open PR, merge, re-check on the live site
status: backlog
blocked_by: [01, 02, 03, 04, 05, 06]
type: HITL
start_commit:
---

# 07: Open PR, merge, re-check on the live site

## What to build
The fixes reach production. A PR from `claude/sleepy-allen-6mmsf7` into `main` (one commit per fix) is opened. The owner merges it, Render deploys, and the owner re-runs the brief's success criteria on the live site.

## Acceptance criteria
- [ ] PR open into `main`, describing each fix
- [ ] Owner has merged it and the Render deploy succeeded
- [ ] On the live site: 400/404 error pages, category update redirect, delete-cancel link, delete redirects and create redirects all behave as in 01–05
- [ ] The app started on Render using `PORT`

## Seams under test
- Live site routes, checked by hand in a browser

## Notes
HITL: the owner's merge and their check on the live site. Afterwards, decide whether to delete `.scratch/bugfix-pass/` and gitignore `.scratch/`.
