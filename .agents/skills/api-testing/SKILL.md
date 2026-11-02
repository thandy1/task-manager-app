---
name: api-testing
description: Use when writing or running tests in backend/. Vitest + Supertest conventions for unit, integration, and API tests.
---

- Runner: Vitest. HTTP tests: Supertest against `app` from `src/app.ts` (never `server.ts`).
- SUT boundary: the Express API (routes, controllers, services, validation, error handling, DB queries against a TEST database). Not the React UI.
- Service unit tests mock the repository with `vi.mock`. Do not hit the database.
- Integration tests use a separate test DB; clean tables between tests.
- Every error test asserts the shape `{ error: { code, message } }` and the status code.
- Cover equivalence partitions and boundary values (title length 0/1/255/256, enums, ids).
- Keep tests short and readable. Name tests as behavior: "returns 400 when title is empty".
- Target >= 80% line coverage (`vitest run --coverage`).