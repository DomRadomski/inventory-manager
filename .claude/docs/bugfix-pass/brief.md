# Brief: Bug-fix pass

**Slug:** `bugfix-pass` · **Date:** 2026-11-08 · **Owner:** Dom Radomski

## Background
The inventory manager (Express + EJS + Postgres, deployed on Render with Neon) just had auth merged in. A review of the codebase found several bugs in pages that look finished, so the next step is a short fix pass before adding any new features.

## Problem
- Both controllers import `renderError` the wrong way (`require(...)` instead of `{ renderError }`), so every intended 400/404 crashes into the generic 500 page.
- Updating a category redirects to `/categories/:id`, which isn't a route, so the user lands on "Page not found". The "No, take me back" link on the delete-category page has the same problem.
- The delete POST handlers render the list page instead of redirecting. The URL stays on `/…/delete/:id` and a refresh re-submits the delete, which contradicts the Post/Redirect/Get approach the README describes.
- Create runs an insert and then a `getLatest*` lookup, which can return someone else's record if two creates happen at once.
- The port is hardcoded to 6969 instead of read from `PORT`.

## Goal
Every existing page and form behaves as the README describes: correct error pages and statuses, no broken links, and Post/Redirect/Get on every write.

## Users / stakeholders
- **Users:** logged-in users and admins of the inventory app
- **Stakeholders:** Dom (solo project; signs off and deploys)

## Scope
**In:**
- Fix the `renderError` import in both controllers
- Fix the category update redirect and the delete-cancel link
- Redirect after category and item delete
- Use `RETURNING` on create instead of the `getLatest*` lookups
- Read the port from `process.env.PORT`, falling back to 6969

**Out (later briefs):**
- CSRF protection
- Automated tests
- Admin-only GET routes / hiding admin buttons from non-admins
- Setting `CatCreatedById` / `ItemCreatedById`
- The `imageurl` field
- Async pbkdf2
- README and `package.json` cleanup

## Constraints
- Existing stack only, no new dependencies
- Render deploys automatically from `main`; DB on Neon
- Verified by hand (no test suite yet)

## Success criteria
- `/categories/category/abc` shows "Invalid category id" with status 400; `/categories/category/99999` shows "Category not found" with status 404; the same for items
- Updating a category lands on that category's page
- "No, take me back" on the delete-category page returns to the category
- After deleting a category or item, the URL is the list page and a refresh doesn't re-submit
- Creating a category or item lands on the record just created
- The app starts on Render using the `PORT` environment variable

## Risks & open questions
- Without tests, regressions are only caught by hand. A follow-up brief for Supertest coverage is worth doing next.
- Are there other places that assume the `getLatest*` helpers exist, or can they be deleted? (for grilling)
