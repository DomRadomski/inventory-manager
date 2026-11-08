---
id: 03
title: Category update and delete-cancel land on the category
status: ready
blocked_by: []
type: AFK
start_commit:
---

# 03: Category update and delete-cancel land on the category

## What to build
Saving a category update lands on that category's page instead of "Page not found". The "No, take me back" link on the delete-category page returns to the category. Both use the canonical `/categories/category/:id` path, written inline.

## Acceptance criteria
- [ ] As admin, a valid `POST /categories/category/update/:id` → 302 with `Location: /categories/category/:id`, and that page returns 200 showing the new name
- [ ] The rendered delete-category page's cancel link `href` is `/categories/category/:id`
- [ ] Item update still redirects to `/inventory/items/item/:id` (unchanged)

## Seams under test
- HTTP routes via `curl` as the test admin (status, `Location` header, rendered link `href`)

## Notes
PRD stories 6–8.
