---
id: 07
title: Re-check everything on the live site
status: backlog
blocked_by: [01, 02, 03, 04, 05, 06]
type: HITL
start_commit:
---

# 07: Re-check everything on the live site

## What to build
Once the PRs for 01–06 are all merged into `main` and Render has deployed, the owner re-runs the brief's success criteria on the live site.

## Acceptance criteria
- [ ] Render's latest deploy from `main` succeeded
- [ ] On the live site: 400/404 error pages, category update redirect, delete-cancel link, delete redirects and create redirects all behave as in 01–05
- [ ] The app started on Render using `PORT`

## Seams under test
- Live site routes, checked by hand in a browser

## Notes
HITL: the owner's check on the live site. The docs in `.claude/docs/bugfix-pass/` stay in the repo as the record of this feature.
