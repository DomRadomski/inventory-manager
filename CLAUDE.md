# CLAUDE.md

Express + EJS + PostgreSQL inventory app (see `README.md` for the architecture). Deployed on Render from `main`; DB on Neon.

## How work is done here

This repo carries its own development workflow, so every session (including fresh cloud sessions) has the same tools and plan:

- **Skills:** `.claude/skills/`: `dev-flow` (the conductor) plus the stages it runs: `to-brief`, `grilling` (`grill-me` is the typed alias), `to-requirements`, `to-issues`, `tdd`, `code-review`, and `codebase-design` (reference vocabulary). If an account-level skill with the same name also appears (e.g. `anthropic-skills:dev-flow`), use the project one.
- **Plans:** `.claude/docs/<feature>/`: `brief.md`, `prd.md`, `issues/NN-*.md` (each issue's frontmatter is the only place its status lives) and `KANBAN.md` (generated from the issue files; never edit it by hand).
- **Start of any session:** run `/dev-flow`. It reads `.claude/docs/`, works out the stage, and picks up the next issue.
- **Branches:** plans reach `main` through a planning PR before building starts. Each issue is built in its own fresh session and lands through its own PR, with its status change in the same PR.
- Never gitignore or delete `.claude/docs/`.

## Running locally

- `npm start` serves on port 6969 (`PORT` env var once issue `bugfix-pass/06` lands).
- Needs a `.env` with `DATABASE_URL` and `FOO_COOKIE_SECRET`. `db/populateauthdb.js` (uses `AUTH_DATABASE_URL`) creates the schema and seed data.
- There's no test suite yet. Checks are done with `curl` against the running app and a throwaway Postgres (Postgres 16 is available in cloud containers).
