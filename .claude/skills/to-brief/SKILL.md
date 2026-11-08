---
name: "to-brief"
description: Turn whatever the user has (rough notes, an email, a ticket, a meeting transcript, or nothing at all) into a short project brief at .claude/docs/feature-slug/brief.md, asking only about what's missing. The first step of the dev-flow pipeline (to-brief → grill-me → to-requirements → to-issues → tdd). Use when the user wants to start a new feature or project, says "write a brief", "I've got this request from a client", "help me scope this", or pastes a vague ask they want to turn into something buildable, even if they don't say "brief".
---

# To Brief

Produce a short `brief.md` that captures **why** this work exists and **what** it should achieve. It's the input for `grill-me`, which settles **how**. So stay out of design decisions here. If the brief settles them, the grill session ends up asking the same questions twice.

The user usually has *something* to go on. Your job is to fill the gaps, not to interview from scratch.

## Sections

The brief has these sections (template in [brief-template.md](brief-template.md)):

1. **Background**: context and how this came up
2. **Problem**: what's painful today, and for whom
3. **Goal**: the outcome, in one or two sentences
4. **Users / stakeholders**: who uses it, and who signs it off
5. **Scope**: in, and explicitly out
6. **Constraints**: stack, deadlines, existing systems, budget
7. **Success criteria**: how we'll know it worked; observable if possible
8. **Risks & open questions**

## Process

### 1. Gather what exists

- Read whatever the user gave you: pasted text, `@` files, emails, ticket notes, transcripts.
- If you're in a repo, take a quick look (README, package manifest, top-level structure) so you don't ask what the code already answers, e.g. the stack. Keep this light. If you need a deeper look, use a subagent and take only its summary back.
- Ask for a short **feature slug** (e.g. `points-for-lessons`) for the folder name, and suggest one.

### 2. Map it onto the sections

For each section, decide whether the material **covers it**, **covers it only thinly**, or **doesn't cover it at all**. Then pick a mode:

- **Gap-fill** (most sections are at least thinly covered) → go to step 3.
- **Cold start** (almost nothing to go on) → ask the three anchor questions first, one at a time, each with an example answer:
  1. **Who** has the problem?
  2. **What** happens today that's painful?
  3. **How** will we know it's fixed?

  Draft a rough brief from those answers, re-map the sections, then go to step 3 for whatever is still thin.

These three anchors come first because nearly every other section follows from them. Once you know who is hurting and what "fixed" looks like, scope and success criteria mostly suggest themselves.

> Example: "Add gamification" becomes **who**: students on the course platform, **pain**: they drop off after 3 lessons, **fixed**: lesson-4 completion goes up.

### 3. Fill the gaps

Ask about the missing or thin sections **one question at a time**, each with a **suggested answer** the user can accept with "yes". Suggestions keep this quick, and most answers will be "sounds right".

- Skip anything the material already answers. Asking again wastes the user's time and suggests you didn't read it.
- If the user doesn't know, record it under **Risks & open questions** and move on rather than pushing for an answer. `grill-me` or a domain expert can pick it up.
- If the user starts talking about design (schemas, endpoints, UI layout), note it briefly under open questions as "for grilling" and steer back.

If nothing is missing, ask nothing and go straight to writing.

### 4. Write the brief

Write `.claude/docs/<feature-slug>/brief.md` using the template. Keep it short: roughly one screen. A brief that takes ten minutes to read won't get read before the grill session.

Commit the brief. `.claude/docs/` is versioned on purpose so that fresh sessions can see the plan; never offer to gitignore it.

### 5. Hand off

End with one line pointing to the next step:

> Brief written to `.claude/docs/<feature>/brief.md`. Next: `/grill-me @.claude/docs/<feature>/brief.md` to settle the design.
