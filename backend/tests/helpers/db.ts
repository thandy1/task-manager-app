import { prisma } from "@src/lib/prisma.js";

/**
 * Deletes every task so each integration test starts from an empty table.
 * Call in `beforeEach`. 
 * 
 * Simpler than `TRUNCATE ... RESTART IDENTITY` since it would reset IDs to 1, which
 * matters only if tests assert on specific IDs which is not the case for the integration tests.
 */
export async function resetDatabase() {
    // Safe-guard: since this deletes data, check so it can never run against 
    // the development database.
    if (!process.env.DATABASE_URL?.includes("_test")) {
        throw new Error("Refusing to reset a non-test database");
    }
    await prisma.task.deleteMany();
}

/**
 * Closes the Prisma connection so Vitest can exit cleanly.
 * Call in afterAll.
 * 
 * Without `$disconnect` the open connection pool can keep the test process hanging.
 */
export async function closeDatabase() {
    await prisma.$disconnect();
}