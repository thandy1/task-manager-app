---
name: backend-layers
description: Use when creating or editing Express routes, controllers, services, repositories, or validation in backend/. Defines layer responsibilities, error handling, and API conventions.
---

## Layer responsibilities
- **Route** (`src/routes/`): maps method + path to middleware + controller. No logic.
- **Controller** (`src/controllers/`): reads validated input (`req.body`, `res.locals.params`), calls ONE service method, sends the response with the correct status. No Prisma, no business rules.
- **Service** (`src/services/`): business rules. Throws `NotFoundError` when the repository returns null. Converts `dueDate` "YYYY-MM-DD" strings to `Date` before calling the repository.
- **Repository** (`src/repositories/`): thin wrapper over Prisma. Only file type that imports the Prisma client. No business rules.

## Conventions
- Express 5: async handlers that throw or reject are forwarded to errorHandler automatically. Do NOT wrap in try/catch or call next(err) just for that.
- Validation runs in middleware (Zod schemas in `src/schemas/task.schema.ts`) before the controller. Controllers trust their input.
- Status codes: 201 create, 200 read/update, 204 delete (no body), 400 validation, 404 not found, 500 unexpected.
- Routes live under `/tasks`. PATCH for edits. DELETE `/tasks` clears all.
- Use `type` imports for types. Export named, not default.
- Keep every function small and typed; no `any`.
- Limits: title max 255, description max 5000 (constants in `src/schemas/task.schema.ts`). Never hardcode them elsewhere.
