import request from "supertest";
import { beforeEach, afterAll, expect, it, describe } from "vitest";
import { app } from "@src/app.js";
import { resetDatabase, closeDatabase } from "../helpers/db.js";
import { TASKS_URL, taskUrl } from "../helpers/routes.js";
import { prisma } from "@src/lib/prisma.js";

/*
  API integration tests for DELETE /api/v1/tasks/:id and DELETE /api/v1/tasks.

  SUT: the real Express `app` against the test database. Tasks are seeded
  directly through Prisma so these tests don't depend on POST. The database
  is reset before every test.
  Out of scope: the React UI.
*/

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe(`DELETE ${taskUrl}`, () => {
  it("deletes the task and returns 204", async () => {
    const task = await prisma.task.create({ data: { title: "Delete me" } });

    const res = await request(app).delete(taskUrl(task.id));

    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
    expect(await prisma.task.findUnique({ where: { id: task.id } })).toBeNull();
  });

  it("only deletes the targeted task", async () => {
    const keep = await prisma.task.create({ data: { title: "Keep" } });
    const target = await prisma.task.create({ data: { title: "Target" } });

    await request(app).delete(taskUrl(target.id));

    expect(await prisma.task.count()).toBe(1);
    expect(await prisma.task.findUnique({ where: { id: keep.id } })).not.toBeNull();
  });

  it("returns 404 with the error shape when the id does not exist", async () => {
    const res = await request(app).delete(taskUrl(999999));

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("NOT_FOUND");
    expect(res.body.error).not.toHaveProperty("stack");
  });

  it("returns 404 when deleting the same task twice", async () => {
    const task = await prisma.task.create({ data: { title: "Once" } });

    await request(app).delete(taskUrl(task.id));
    const res = await request(app).delete(taskUrl(task.id));

    expect(res.status).toBe(404);
  });

  it.each([
    ["non-numeric id", "abc"],
    ["negative id", "-1"],
    ["zero id", "0"],
  ])("returns 400 for an invalid id and deletes nothing: %s", async (_label, badId) => {
    await prisma.task.create({ data: { title: "Safe" } });

    const res = await request(app).delete(taskUrl(badId));

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    expect(await prisma.task.count()).toBe(1);
  });
});

describe(`DELETE ${TASKS_URL}`, () => {
  it("deletes every task and returns 204", async () => {
    await prisma.task.create({ data: { title: "One" } });
    await prisma.task.create({ data: { title: "Two" } });
    await prisma.task.create({ data: { title: "Three" } });

    const res = await request(app).delete(TASKS_URL);

    expect(res.status).toBe(204);
    expect(await prisma.task.count()).toBe(0);
  });

  it("returns 204 when the table is already empty", async () => {
    const res = await request(app).delete(TASKS_URL);

    expect(res.status).toBe(204);
    expect(await prisma.task.count()).toBe(0);
  });
});