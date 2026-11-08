---
name: "to-requirements"
description: Turn a project brief plus a finished grill-me session into a product requirements document (PRD) at .claude/docs/feature-slug/prd.md. This is synthesis only, with no new interview. The third step of the dev-flow pipeline (to-brief → grill-me → to-requirements → to-issues → tdd). Use when the user has just finished grilling a plan and says "write the PRD", "write up the requirements", "capture what we agreed", "spec this out", or points at a brief.md and wants the destination document, even if they don't say "PRD".
---

# To Requirements

Write the **destination** document: what we're building and what "done" means, based on decisions already made. The interview has already happened in `grill-me`, so **don't run another one**. Asking new design questions here reopens settled decisions and wastes the session. Just write up what's already known.

## Inputs

- `.claude/docs/<feature>/brief.md`: passed as an `@` reference, or found by looking in `.claude/docs/`. If there are several feature folders, ask which one.
- The decisions from the grill session in the current conversation.

If there's no grill session in context, say so in one line. Offer to run `grill-me` first or to write the PRD from the brief alone. In that case, anything not settled goes under **Open Questions**. Don't guess.

## Process

### 1. Understand the codebase

If you haven't explored the repo in this session, do so now, ideally with a subagent that returns a short summary of the modules, existing test patterns and conventions. You need to know what exists so the Implementation Decisions fit the codebase rather than an imaginary one. If there's a `CONTEXT.md` (glossary) or ADRs (decision records), use their vocabulary and respect them.

### 2. Agree the testing seams

A **seam** is a public boundary where behaviour is tested without reaching inside, e.g. an HTTP route, a service's public functions, or a rendered page.

Sketch the seams this feature will be tested at:
- Prefer **existing** seams to new ones.
- Use the **highest** seam that still gives a clear signal. One seam for the whole feature is ideal.

Show them to the user and confirm before writing. This matters because `to-issues` and `tdd` both build on these seams. If they're wrong here, every test downstream lands in the wrong place.

> Example: "Points for lessons: test at the `POST /lessons/:id/complete` route (awards points) and the dashboard render (shows them). No unit tests on the points calculator unless it grows real logic."

### 3. Write the PRD

Write `.claude/docs/<feature>/prd.md` using [prd-template.md](prd-template.md).

Writing guidance:
- **User stories**: be thorough. These become the raw material for slicing in `to-issues`, so a story that's missing here becomes a slice that's missing later.
- **Implementation decisions**: describe modules, interfaces and contracts, **not file paths or code**. Paths go out of date within days, but decisions last. One exception: if a prototype produced a snippet that captures a decision better than prose (a schema, a type shape, a state machine), include the decision-rich part and note where it came from.
- **Open questions**: anything important the grill session didn't settle. Writing "unresolved" is better than an invented answer, because an invented answer looks exactly like a real decision.

### 4. Hand off

End with:

> PRD written to `.claude/docs/<feature>/prd.md`. Next: `/to-issues @.claude/docs/<feature>/prd.md` to break it into vertical slices.

If there are Open Questions that would block slicing, list them in your reply so the user can settle them first.
