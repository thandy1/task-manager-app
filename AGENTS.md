# AGENTS.md

Task Manager monorepo: `backend/` (Express 5 + TypeScript ESM + Prisma 7 + PostgreSQL), `frontend/` (React). Work in `backend/` unless told otherwise.

## Rules
- Do one layer or one task at a time, then show the diff, summarize, and stop. Do not move ahead.
- Do not add features, dependencies, or refactor working code. Ask first.
- Do not commit. The user commits (`type(scope): description`).
- Do not write tests unless the prompt asks for them.
- Never run `npm audit fix --force` or upgrade Prisma. Prisma is pinned to 7.10.1.
- Relative imports need the `.js` extension (ESM, NodeNext).
- Import Prisma types from `src/generated/prisma/client.js`, never `@prisma/client`.
- Use the matching skill in `.agents/skills/` before writing backend code.

## Comments
- Every exported service and repository method must have a TSDoc comment explaining why, not what.
- No other comments unless the reason for the code isn't obvious.

## Feature flags
- Only POST /tasks is behind `FEATURE_CREATE_TASK`, applied to that route in `task.routes.ts`. Do not add flags or touch `app.ts` unless asked.

## Commands (run in backend/)
- `npx tsc --noEmit` typecheck
- `npx vitest run` tests
- `npx prisma generate` regenerate the client after schema changes
- DB: `docker compose up -d` from repo root (host port 5433)

## Architecture
Route -> Controller -> Service -> Repository -> Prisma. See the `backend-layers` skill.
- Throw `AppError` subclasses from `src/errors/`. Never leak stack traces.
- Error response shape: `{ "error": { "code", "message", "details"? } }`.
- `validateRequest` (src/middleware/validateRequest.ts) runs before controllers. It replaces `req.body` with parsed data and puts parsed params in `res.locals.params`. Controllers read `req.body` and `res.locals.params.id`.

## Task contract (v0.1.0)
- Task: id, title (required), description?, status (TODO|IN_PROGRESS|DONE, default TODO),
  priority (LOW|MEDIUM|HIGH, default LOW), dueDate? (YYYY-MM-DD), createdAt, updatedAt.