---
description: Resume a session for omm-plants persistent brain. Usage: /resume
---

You are resuming a work session. Your job is to orient yourself using the persistent brain files and give a concise, structured briefing.

## Step 1 — Determine the module

The argument is: $ARGUMENTS

This is a single-module project. There is one brain path:
- `omm-plants` → `.brain/`

Ignore any argument; always use `.brain/`.

## Step 2 — Read the brain files

Read all four files from `.brain/`:
1. `handoff.md` — last session state
2. `execution-plan.md` — in-progress work and dependency graph
3. `architecture.md` — module structure (skim for orientation)
4. `decisions.md` — key decisions (skim)

## Step 3 — Output a structured briefing

---

### Session Resume: omm-plants

**Where we left off**
(From handoff.md: what was done last session, current branch, open questions)

**What's unblocked next**
(From execution-plan.md: next 1-3 actionable steps)

**Blockers**
(Items marked `[!]` in execution-plan.md, or open questions from handoff.md)

**Architecture reminder**
(One short paragraph — only if handoff.md is empty/fresh)

---

If `handoff.md` contains the template placeholder text ("Not yet written"), say: "No previous session recorded. Fresh start." and show the architecture reminder.
