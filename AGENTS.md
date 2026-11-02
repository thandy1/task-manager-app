# AGENTS.md

Task Manager monorepo: `backend/` (Express 5 + TypeScript ESM + Prisma 7 + PostgreSQL), `frontend/` (React). Work in `backend/` unless told otherwise.

## Rules
- Do one layer or one task at a time, then stop and summarize. Do not move ahead.
- Do not add features, dependencies, or refactor working code. Ask first.
- Never run `npm audit fix --force` or upgrade Prisma. Prisma is pinned to 7.10.1.
- Relative imports need the `.js` extension (ESM, NodeNext).
- Import Prisma types from `src/generated/prisma/client.js`, never `@prisma/client`.
- Commit style: `type(scope): description`. Do not commit; the user commits.
- Read `.agents/skills/` before writing backend code.

## Commands (run in backend/)
- `npx tsc --noEmit` typecheck
- `npx vitest run` tests
- `npx prisma generate` regenerate the client after schema changes
- DB: `docker compose up -d` from repo root (host port 5433)

## Architecture
Route -> Controller -> Service -> Repository -> Prisma. See the `backend-layers` skill.
Errors: always throw AppError subclasses from `src/errors/AppError.ts`. Response shape:
`{ "error": { "code", "message", "details"? } }`. Never leak stack traces.