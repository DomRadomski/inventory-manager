---
id: 01
title: Error pages show the right message and status
status: ready
blocked_by: []
type: AFK
start_commit:
---

# 01: Error pages show the right message and status

## What to build
A bad or unknown id on any category or item page shows the shared error page with the right message and status, instead of the generic 500 "Something went wrong". The cause is that both resource controllers import the error helper the wrong way; they should import it by name, as the app entry and auth middleware do.

This is the tracer bullet. It also sets up the throwaway Postgres (schema and seed from the auth DB setup script) and a registered test user promoted to admin by hand-run SQL. Later issues reuse that setup.

## Acceptance criteria
- [ ] `GET /categories/category/abc` → 400, body contains "Invalid category id"
- [ ] `GET /categories/category/99999` → 404, body contains "Category not found"
- [ ] `GET /inventory/items/item/abc` → 400 "Invalid item id"; `/inventory/items/item/99999` → 404 "Item not found"
- [ ] The same 400/404 results on the update and delete GET pages for both resources
- [ ] A logged-in non-admin POSTing to a category or item create route still gets 403
- [ ] A valid id still renders its page with 200

## Seams under test
- HTTP routes of the running app via `curl` (status code + rendered body), logged in with a session cookie jar

## Notes
PRD stories 1–3, 15. Throwaway DB setup lives in the container only and isn't committed.
