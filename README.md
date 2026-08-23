# Inventory Manager

A full-stack CRUD web app for managing categories and items in an inventory, built with Express, EJS, and PostgreSQL. (Deployed on [renders](https://render.com/) free tier which spins the app down after a period of inactivity, so the first request after a while may take 30–60 seconds to respond while it wakes back up)

**Live site:** https://inventory-manager-eer6.onrender.com/

## Tech Stack

- **Node.js / Express** — server and routing
- **EJS** — server-side rendered views
- **PostgreSQL** (hosted on [Neon](https://neon.tech)) — database
- **node-postgres (`pg`)** — database driver
- **express-validator** — form validation
- **Vanilla CSS** — no framework, hand-written styling
- **Vanilla JS** — small client-side script for item filtering
- **Render** — deployment/hosting
- **Neon** — database deployment/hosting

## Project Structure

```
views/
  category/     — category pages (list, view, create, update, delete)
  inventory/    — item pages (list, view, create, update, delete)
  partials/     — shared head, footer, and form-errors partials
  index.ejs     — home page
  errorPage.ejs — shared error page
routes/         — category and inventory routers
controllers/    — category and inventory controllers
db/queries/     — query functions per table (categories, items)
utils/          — asyncHandler and renderError helpers
public/         — static assets (CSS, placeholder images)
app.js          — app entry point, middleware, route mounting
```

Categories and items are split into two parallel stacks (router → controller → queries → views), following the same pattern throughout so either side is easy to navigate once you understand one.

## Routes & Controllers

Each resource (categories, items) follows a standard CRUD route set: list, view one, create (get/post), update (get/post), delete (get/post). GET routes show a page or form; POST routes handle the actual database write and then redirect (Post/Redirect/Get), so refreshing the page after a submit doesn't resubmit the form.

**Validation** is handled with `express-validator`, declared as middleware in the routes files (not inside controllers). Each field has its own rule — e.g. name is required and trimmed, description is optional, price/stock must be non-negative numbers, category is validated as an optional integer (to allow "None"). Controllers check `validationResult(req)` and re-render the form with the error list if validation fails, or pull the clean data out with `matchedData(req)` if it passes. The validation on this app is not ideal and is something I would improve in the future.

**IDs** passed in the URL (e.g. `/categories/5`) are checked with a small `isValidId()` helper (a regex for digits-only) before any database call is made, rather than through express-validator — this was a deliberate choice to keep route-param validation simple and separate from body validation.

## Database & Queries

Postgres folds unquoted identifiers to lowercase, so even though the schema was written with mixed-case column names (`CatName`, `ItemPrice`, etc.), the actual returned columns are lowercase (`catname`, `itemprice`). All queries and views were written to match this.

Items reference categories via a foreign key (`ItemCatId`) with `ON DELETE SET NULL` — deleting a category doesn't delete its items, it just uncategorizes them. Because of this, item queries use a `LEFT JOIN` against categories (not an inner `JOIN`), so uncategorized items still show up in listings instead of being silently excluded.

`node-postgres` returns a full `Result` object from every query, not just the rows — query functions consistently return `result.rows` for multi-row queries and `result.rows[0]` for single-row lookups, so controllers always get the shape they expect.

## Error Handling

Two `utils/` helpers centralize error behavior across the app:

- **`asyncHandler`** wraps controller functions so that a rejected promise (e.g. a thrown DB error) is automatically passed to `next(err)`, instead of crashing unhandled. Every route is wrapped with it, so controllers don't need their own try/catch blocks.
- **`renderError(req, res, message, status)`** renders the shared `errorPage.ejs` with a message and an appropriate HTTP status (400 for bad input, 404 for not found, 500 for unexpected failures), and includes a "back" link built from the request's `Referer` header (falling back to `/` if there isn't one).

A global Express error-handling middleware (registered last, after all routes) catches anything unexpected using the same `renderError` helper, and a catch-all route handles unmatched URLs with a 404.

## Deployment

- **Database:** hosted on [Neon](https://neon.tech), a serverless Postgres provider. The connection string is stored as an environment variable, never committed to the repo.
- **App hosting:** deployed on [Render](https://render.com)'s free web service tier, connected directly to this GitHub repo for automatic deploys on push.
  - Build command: `npm install`
  - Start command: `npm start`
