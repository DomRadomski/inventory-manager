---
id: 05
title: Create lands on the record it made
status: ready
blocked_by: []
type: AFK
start_commit:
---

# 05: Create lands on the record it made

## What to build
Creating a category or item redirects to exactly the record that was inserted. The create queries return the inserted row, and the controller redirects using its id. The "get latest" query helpers have no other callers and are removed.

## Acceptance criteria
- [ ] As admin, `POST /categories/new` with a valid name → 302 to `/categories/category/<new id>`, and that page shows the submitted name
- [ ] As admin, `POST /inventory/items/new` with valid fields → 302 to `/inventory/items/item/<new id>`, and that page shows the submitted name, price and stock
- [ ] Creating an item with category "None" still works
- [ ] No remaining references to the "get latest" helpers

## Seams under test
- HTTP routes via `curl` as the test admin (status, `Location` header, rendered page)

## Notes
PRD stories 12–13. The concurrency guarantee comes from the design (one statement); it isn't tested with a race.
