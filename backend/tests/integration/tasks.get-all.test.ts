import request from "supertest";
import { beforeEach, afterAll, expect, it, describe } from "vitest";
import { app } from "@src/app.js";
import { resetDatabase, closeDatabase } from "../helpers/db.js";
import { TASKS_URL } from "../helpers/routes.js";
import { prisma } from "@src/lib/prisma.js";

/*
  API integration tests for GET /api/v1/tasks.

  SUT: the real Express `app` against the test database. Tasks are seeded
  directly through Prisma, so these tests don't depend on POST working.
  The database is reset before every test.
  Out of scope: the React UI.
*/

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe(`GET ${TASKS_URL}`, () => {
  it("returns 200 and an empty array when there are no tasks", async () => {
    const res = await request(app).get(TASKS_URL);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns all tasks as a bare array", async () => {
    await prisma.task.create({ data: { title: "First" } });
    await prisma.task.create({ data: { title: "Second" } });
    await prisma.task.create({ data: { title: "Third" } });

    const res = await request(app).get(TASKS_URL);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(3);
    expect(res.body.map((t: { title: string }) => t.title)).toEqual(
      expect.arrayContaining(["First", "Second", "Third"]),
    );
  });

  it("returns each task with the full set of fields", async () => {
    await prisma.task.create({
      data: { title: "Complete", description: "Details", priority: "HIGH", status: "DONE" },
    });

    const res = await request(app).get(TASKS_URL);

    expect(res.body[0]).toMatchObject({
      title: "Complete",
      description: "Details",
      priority: "HIGH",
      status: "DONE",
    });
    expect(res.body[0]).toHaveProperty("id");
    expect(res.body[0]).toHaveProperty("createdAt");
    expect(res.body[0]).toHaveProperty("updatedAt");
  });
});