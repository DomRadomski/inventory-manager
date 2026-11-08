---
id: 06
title: App listens on PORT
status: ready
blocked_by: []
type: AFK
start_commit:
---

# 06: App listens on PORT

## What to build
The app listens on the `PORT` environment variable when it's set, and on 6969 when it isn't, so it runs correctly on Render and locally.

## Acceptance criteria
- [ ] Started with `PORT=7777`, `GET http://localhost:7777/` → 200
- [ ] Started without `PORT`, `GET http://localhost:6969/` → 200
- [ ] The startup log shows the actual port

## Seams under test
- HTTP `GET /` on the running app via `curl`

## Notes
PRD story 14. Single-layer on purpose: it's a config-only fix, so there's nothing else for it to slice through.
