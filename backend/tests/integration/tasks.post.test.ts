import request from "supertest";
import { beforeEach, afterAll, expect, it, describe } from "vitest";
import { app } from "@src/app.js";
import { resetDatabase, closeDatabase } from "../helpers/db.js";
import { TASKS_URL } from "../helpers/routes.js";

/*
  API integration tests for POST /api/v1/tasks.

  SUT: the real Express `app` (routes -> validation -> controller -> service ->
  repository -> Prisma) running against the test database (taskmanagerdb_test).
  Supertest is an in-process HTTP client, so no server needs to be started.
  The database is reset before every test, so tests don't depend on each other.
  Out of scope: the React UI. Exhaustive schema rules live in the schema unit tests.
*/

describe(`POST ${TASKS_URL}`, () => {
    beforeEach(async () => {
        await resetDatabase();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    it("creates a task with only a title and applies defaults", async () => {
        const res = await request(app).post(TASKS_URL).send({ title: "Write tests "});

        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({
            title: "Write tests",
            status: "TODO",
            priority: "LOW",
        });
        // These check if the fields are defined since their values are generated.
        // Exact matches would be brittle.
        expect(res.body.id).toBeDefined();
        expect(res.body.createdAt).toBeDefined();
        expect(res.body.updatedAt).toBeDefined();
    });
});

describe(`POST ${TASKS_URL} validation`, () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it("rejects an empty title with 400", async () => {
    const res = await request(app).post(TASKS_URL).send({ title: "" });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("rejects a missing title with 400", async () => {
    const res = await request(app).post(TASKS_URL).send({});
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("accepts a one-character title", async () => {
    const res = await request(app).post(TASKS_URL).send({ title: "a" });
    expect(res.status).toBe(201);
  });

  it("rejects an invalid priority value", async () => {
    const res = await request(app).post(TASKS_URL).send({ title: "x", priority: "URGENT" });
    expect(res.status).toBe(400);
  });

  it("rejects an invalid status value", async () => {
    const res = await request(app).post(TASKS_URL).send({ title: "x", status: "BLOCKED" });
    expect(res.status).toBe(400);
  });

  it("rejects a title longer than 255 characters", async () => {
    const res = await request(app).post(TASKS_URL).send({ title: "a".repeat(256) });
    expect(res.status).toBe(400);
  });

  it("accepts a title with 255 characters", async () => {
    const res = await request(app).post(TASKS_URL).send({ title: "a".repeat(255)} );
    expect(res.status).toBe(201);
  });

  it("rejects a whitespace-only title", async () => {
    const res = await request(app).post(TASKS_URL).send({ title: "    "});
    expect(res.status).toBe(400);
  });

  it("returns the NFR1 error shape without a stack trace", async () => {
    const res = await request(app).post(TASKS_URL).send({ title: "" });
    expect(res.body).toHaveProperty("error.code");
    expect(res.body).toHaveProperty("error.message");
    expect(JSON.stringify(res.body)).not.toContain("stack");
  });
});