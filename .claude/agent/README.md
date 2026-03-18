# Persistent Brain — Agent Setup

## Problem solved

Claude Code sessions start fresh with no memory of previous work. This setup gives every session instant context via brain files and two slash commands.

## Brain file structure

`.brain/` at the project root contains four files:

| File | Purpose | Updated by |
|------|---------|-----------|
| `architecture.md` | App structure, key exports, patterns, gotchas | `/wrap-up` (only if structure changed) |
| `decisions.md` | ADRs — why things are the way they are | `/wrap-up` (only if new decisions made) |
| `handoff.md` | Last session state: what was done, what's next | `/wrap-up` (overwritten every session) |
| `execution-plan.md` | In-progress epics and step dependency graph | `/wrap-up` (updated every session) |

## Workflow

**Start of session:**
```
/resume
```
Reads all four brain files and outputs a structured briefing: where we left off, what's unblocked, any blockers.

**End of session:**
```
/wrap-up
```
Runs `git diff HEAD` + `git status`, then:
1. Overwrites `handoff.md` with a fresh summary
2. Updates `execution-plan.md` (marks steps done/in-progress, adds new ones)
3. Conditionally updates `architecture.md` and `decisions.md`

## Seeded modules

- `omm-plants` → `.brain/` (project root)

## Rolling out to new modules

This is a single-package repo, so one brain covers the whole project. If the project later splits into multiple packages, create a `.brain/` inside each package and add entries to the module map in `.claude/commands/resume.md` and `.claude/commands/wrap-up.md`.
