import request from "supertest";
import { beforeEach, afterAll, expect, it, describe } from "vitest";
import { app } from "@src/app.js";
import { resetDatabase, closeDatabase } from "../helpers/db.js";
import { taskUrl } from "../helpers/routes.js";
import { prisma } from "@src/lib/prisma.js";

/*
  API integration tests for GET /api/v1/tasks/:id.

  SUT: the real Express `app` (routes -> param validation -> controller ->
  service -> repository -> Prisma) against the test database.
  Tasks are seeded directly through Prisma, so these tests don't depend on
  POST working. The database is reset before every test.
  Out of scope: the React UI.
*/

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe(`GET ${taskUrl}`, () => {
  it("returns 200 and the task when it exists", async () => {
    const task = await prisma.task.create({
      data: { title: "Find me", description: "Details", priority: "HIGH" },
    });

    const res = await request(app).get(taskUrl(task.id));

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: task.id,
      title: "Find me",
      description: "Details",
      priority: "HIGH",
      status: "TODO",
    });
  });

  it("returns the requested task, not another one", async () => {
    await prisma.task.create({ data: { title: "Other" } });
    const target = await prisma.task.create({ data: { title: "Target" } });

    const res = await request(app).get(taskUrl(target.id));

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Target");
  });

  it("returns 404 with the error shape when the id does not exist", async () => {
    const res = await request(app).get(taskUrl(999999));

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("NOT_FOUND");
    expect(res.body.error).toHaveProperty("message");
    expect(res.body.error).not.toHaveProperty("stack");
  });

  it.each([
    ["non-numeric id", "abc"],
    ["decimal id", "1.5"],
    ["negative id", "-1"],
    ["zero id", "0"],
  ])("returns 400 for an invalid id: %s", async (_label, badId) => {
    const res = await request(app).get(taskUrl(badId));

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });
});