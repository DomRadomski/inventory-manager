# PRD: Bug-fix pass

**Slug:** `bugfix-pass` · **Date:** 2026-11-08 · **Brief:** [brief.md](brief.md)

## Problem Statement
Pages in the inventory manager that look finished misbehave. Bad or unknown ids show a generic "Something went wrong" 500 page instead of a clear 400/404. Saving a category update lands on "Page not found". The cancel link on the delete-category page is broken. Deleting leaves the browser on the delete URL, so a refresh re-submits the delete. Creating a record can redirect to someone else's record if two creates happen at once. The server ignores the host's `PORT`.

## Solution
Every existing page and form behaves the way the README describes. Users get the correct error page and status for bad input and missing records. Every link and redirect lands on a real page. Every write follows Post/Redirect/Get. A create always lands on the record it made. The app listens on whatever port the host provides.

## User Stories
1. As a user, when I visit a category or item URL with a non-numeric id, I want to see "Invalid category id" / "Invalid item id" with status 400, so that I know the link is malformed.
2. As a user, when I visit a category or item that doesn't exist, I want to see "Category not found" / "Item not found" with status 404, so that I know it was removed or never existed.
3. As a user, I want stories 1–2 to also hold for the update and delete pages of both resources, so that every id-based page reports errors consistently.
4. As an admin, when I submit an update form with invalid input for a record that doesn't exist, I want a 404 "not found" page rather than a crash, so that the error makes sense.
5. As an admin, when I submit an update form with invalid input for a record that exists, I want the form shown again with the validation errors (unchanged behaviour), so that I can correct it.
6. As an admin, after saving a category update, I want to land on that category's page, so that I can see my change.
7. As an admin, after saving an item update, I want to land on that item's page (unchanged behaviour), so that I can see my change.
8. As an admin, when I click "No, take me back" on the delete-category page, I want to return to that category's page, so that cancelling works.
9. As an admin, after deleting a category, I want to be redirected to the categories list, so that the URL is the list and a refresh doesn't re-submit.
10. As an admin, after deleting an item, I want to be redirected to the items list, for the same reason.
11. As an admin, when I delete a category or item that no longer exists, I want to be redirected to the list without an error, so that a stale tab or double submit is harmless.
12. As an admin, after creating a category, I want to land on the category I just created, even if someone else creates one at the same moment.
13. As an admin, after creating an item, I want to land on the item I just created, under the same guarantee.
14. As the operator, I want the app to listen on `PORT` when it's set and on 6969 when it isn't, so that it runs correctly on Render and locally.
15. As a non-admin, I want POST writes to keep returning the 403 page (unchanged behaviour), so that permissions aren't weakened by this pass.

## Implementation Decisions
- **Error helper:** the `renderError` util keeps its named export. Both resource controllers change to import it by name, matching the app entry and the auth middleware. The helper's signature (`req, res, message, status`) is unchanged.
- **Category routes:** the update success redirect and the delete-cancel link both target the canonical category view path, `/categories/category/:id`. Paths stay written inline; no URL-builder helper is added.
- **Delete handlers (both resources):** after deleting, they redirect to the resource's list route instead of rendering the list. They don't check whether the record existed, so deleting a missing record also redirects to the list.
- **Update handlers (both resources), validation-failure path:** they re-fetch the record. If it's missing, they render the shared error page with 404 and the resource's "not found" message. Otherwise they re-render the form with the errors, as now.
- **Query modules:** `createCat` and `createItem` return the inserted row (via `RETURNING *`). Controllers redirect using that row's id. `getLatestCat` and `getLatestItem` are deleted along with their exports; they have no other callers.
- **App entry:** the listen port is `process.env.PORT`, falling back to 6969.
- **No schema changes, no new dependencies, no changes to auth or validation rules.**
- **Delivery:** one commit per fix on `claude/sleepy-allen-6mmsf7`, then a PR into `main`. The owner merges it, which triggers the Render deploy.

## Testing Decisions
- **Seam under test:** the HTTP routes of the running app, exercised with `curl` against a throwaway Postgres in the dev container (schema and seed from the existing auth DB setup script). A test user registers through the app and is promoted to admin with a hand-run SQL `UPDATE`. Write requests use that user's session cookie.
- **What each check asserts:** status code, `Location` header for redirects, and the error message or link `href` in the rendered body. Port is checked by starting the app with a non-default `PORT` and requesting `/`.
- **What makes a good test here:** behaviour through public routes, not implementation details. No unit tests on query functions or the error helper.
- **Prior art:** none; the repo has no test suite. After merge, the owner re-checks the success criteria on the live site.

## Out of Scope
- CSRF protection
- Automated tests (Supertest or otherwise)
- Admin-only GET routes / hiding admin buttons from non-admins
- Populating `CatCreatedById` / `ItemCreatedById`
- The `imageurl` field
- Async pbkdf2
- A "Deleted X" flash message
- A make-admin script
- README and `package.json` cleanup

## Open Questions
- None.
