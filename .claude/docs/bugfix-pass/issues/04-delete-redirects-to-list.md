---
id: 04
title: Delete redirects to the list
status: ready
blocked_by: []
type: AFK
start_commit:
---

# 04: Delete redirects to the list

## What to build
After deleting a category or item, the admin is redirected to that resource's list (Post/Redirect/Get), so the URL is the list and a refresh doesn't re-submit. Deleting a record that no longer exists also just redirects to the list.

## Acceptance criteria
- [ ] As admin, `POST /categories/category/delete/:id` → 302 with `Location: /categories`; the category is gone from the list
- [ ] As admin, `POST /inventory/items/item/delete/:id` → 302 with `Location: /inventory/items`; the item is gone from the list
- [ ] Deleting a category leaves its items in place, now uncategorized (unchanged `ON DELETE SET NULL`)
- [ ] Deleting a non-existent id (`99999`) for either resource → 302 to its list, no error

## Seams under test
- HTTP routes via `curl` as the test admin (status, `Location` header, list body)

## Notes
PRD stories 9–11. No "Deleted X" message (out of scope).
