import { app } from "@src/app.js";
import { beforeEach, afterAll, describe, it, expect } from "vitest";
import request from "supertest";
import { resetDatabase, closeDatabase } from "../helpers/db.js";
import { TASKS_URL } from "../helpers/routes.js";

describe("integration smoke test", () => {
    // Every test starts from an empty table, so tests can't depend on each
    // others leftovers.
    beforeEach(async () => {
        await resetDatabase();
    });

    // Closes the Prisma connection so Vitest can exit cleanly 
    // instead of hanging.
    afterAll(async () => {
        await closeDatabase();
    });

    it("GET /health responds with 200", async () => {
        const res = await request(app).get("/health");
        expect(res.status).toBe(200);
    });

    it(`GET ${TASKS_URL}/tasks reaches the test database`, async () => {
        const res = await request(app).get(TASKS_URL);
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });
});