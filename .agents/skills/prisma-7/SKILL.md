---
name: prisma-7
description: Use for any Prisma schema, migration, client, or database query work in backend/. Covers Prisma 7.10.1 specifics for this repo.
---

- Version is pinned to 7.10.1 (prisma, @prisma/client, @prisma/adapter-pg). Never upgrade.
- Client is generated to `src/generated/prisma` (git-ignored). Import from `../generated/prisma/client.js`.
- `migrate dev` does NOT generate the client. Run `npx prisma generate` after.
- DB URL is in `prisma.config.ts`. Schema changes only via migrations (`npx prisma migrate dev --name <name>`), never edit the DB by hand.
- Task model: table "tasks", id Int autoincrement, dueDate `@db.Date`, enums TaskStatus/TaskPriority, priority default LOW, status default TODO, updatedAt via `@updatedAt`.
- Use `src/lib/prisma.ts` for the client instance; never create another PrismaClient.
- `update`/`delete` on a missing id throws Prisma error P2025. Translate it to `NotFoundError` (in the repository or service, not the controller).
- Clear all tasks: `deleteMany()`.
- If the DB is empty: `npx prisma migrate deploy`.