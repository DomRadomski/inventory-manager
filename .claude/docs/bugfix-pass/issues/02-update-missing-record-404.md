---
id: 02
title: Failed-validation update on a missing record returns 404
status: backlog
blocked_by: [01]
type: AFK
start_commit:
---

# 02: Failed-validation update on a missing record returns 404

## What to build
When an admin submits an update form with invalid input for a category or item that doesn't exist, they get the "not found" 404 page instead of a crash. When the record does exist, the form is shown again with the validation errors, as now.

## Acceptance criteria
- [ ] As admin, `POST /categories/category/update/99999` with an empty name → 404, body contains "Category not found"
- [ ] As admin, `POST /inventory/items/item/update/99999` with an empty name → 404, body contains "Item not found"
- [ ] As admin, an empty name for an existing category or item → 200, form re-rendered with "name is required" error
- [ ] Valid update of an existing record still succeeds

## Seams under test
- HTTP routes via `curl` as the test admin (status code + rendered body)

## Notes
PRD stories 4–5. Blocked by 01 because the 404 depends on the error helper working.
