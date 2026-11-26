import request from "supertest";
import { beforeEach, afterAll, expect, it, describe } from "vitest";
import { app } from "@src/app.js";
import { resetDatabase, closeDatabase } from "../helpers/db.js";
import { TASKS_URL } from "../helpers/routes.js";
import { prisma } from "@src/lib/prisma.js";

/*
  API integration tests for POST /api/v1/tasks.

  SUT: the real Express `app` (routes -> validation -> controller -> service ->
  repository -> Prisma) running against the test database (taskmanagerdb_test).
  Supertest is an in-process HTTP client, so no server needs to be started.
  The database is reset before every test, so tests don't depend on each other.
  Out of scope: the React UI. Exhaustive schema rules live in the schema unit tests.
*/

// Top-level hook for each test suite.
beforeEach(async () => {
    await resetDatabase();
});

afterAll(async () => {
    await closeDatabase();
});

describe(`POST ${TASKS_URL}`, () => {
  it("creates a task with only a title and applies defaults", async () => {
    const res = await request(app).post(TASKS_URL).send({ title: "Write tests" });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      title: "Write tests",
      status: "TODO",
      priority: "LOW",
    });
    // Generated values: check they exist rather than matching exactly.
    expect(res.body.id).toBeDefined();
    expect(res.body.createdAt).toBeDefined();
    expect(res.body.updatedAt).toBeDefined();
  });

  it("persists the created task in the database", async () => {
    const res = await request(app).post(TASKS_URL).send({ title: "Persist me" });

    expect(res.status).toBe(201);
    expect(await prisma.task.count()).toBe(1);

    const saved = await prisma.task.findUnique({ where: { id: res.body.id } });
    expect(saved).not.toBeNull();
    expect(saved?.title).toBe("Persist me");
  });

  it("creates a task with all optional fields and stores them", async () => {
    const body = {
      title: "Full task",
      description: "Some details",
      dueDate: "2026-12-01",
      priority: "HIGH",
      status: "IN_PROGRESS",
    };
    const res = await request(app).post(TASKS_URL).send(body);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      title: "Full task",
      description: "Some details",
      priority: "HIGH",
      status: "IN_PROGRESS",
    });
    expect(res.body.dueDate).toContain("2026-12-01");

    const saved = await prisma.task.findUnique({ where: { id: res.body.id } });
    expect(saved?.description).toBe("Some details");
    expect(saved?.priority).toBe("HIGH");
    expect(saved?.status).toBe("IN_PROGRESS");
    expect(saved?.dueDate).not.toBeNull();
  });
});

describe(`POST ${TASKS_URL} validation`, () => {
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

  it("accepts a title with 255 characters", async () => {
    const res = await request(app).post(TASKS_URL).send({ title: "a".repeat(255) });
    expect(res.status).toBe(201);
    expect(res.body.title).toHaveLength(255);
  });

  it("rejects a title longer than 255 characters", async () => {
    const res = await request(app).post(TASKS_URL).send({ title: "a".repeat(256) });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("rejects a whitespace-only title", async () => {
    const res = await request(app).post(TASKS_URL).send({ title: "    " });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("trims surrounding whitespace from a valid title", async () => {
    const res = await request(app).post(TASKS_URL).send({ title: "  Hello  " });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Hello");
  });

  it("rejects an invalid priority value", async () => {
    const res = await request(app).post(TASKS_URL).send({ title: "x", priority: "URGENT" });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("rejects an invalid status value", async () => {
    const res = await request(app).post(TASKS_URL).send({ title: "x", status: "BLOCKED" });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("rejects a dueDate in the wrong format", async () => {
    const res = await request(app).post(TASKS_URL).send({ title: "x", dueDate: "12/01/2026" });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("rejects a description longer than 5000 characters", async () => {
    const res = await request(app)
      .post(TASKS_URL)
      .send({ title: "x", description: "a".repeat(5001) });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns the NFR1 error shape without a stack trace", async () => {
    const res = await request(app).post(TASKS_URL).send({ title: "" });
    expect(res.body).toHaveProperty("error.code");
    expect(res.body).toHaveProperty("error.message");
    expect(res.body.error).not.toHaveProperty("stack");
  });

  // NFR2: invalid input never reaches the database.
  it.each([
    ["empty body", {}],
    ["empty title", { title: "" }],
    ["whitespace-only title", { title: "   " }],
    ["title too long (256)", { title: "a".repeat(256) }],
    ["invalid priority", { title: "Valid", priority: "URGENT" }],
    ["invalid status", { title: "Valid", status: "BLOCKED" }],
  ])("does not write to the database when input is invalid: %s", async (_label, body) => {
    const res = await request(app).post(TASKS_URL).send(body);

    expect(res.status).toBe(400);
    expect(await prisma.task.count()).toBe(0);
  });
});