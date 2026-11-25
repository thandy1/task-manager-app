import request from "supertest";
import { beforeEach, afterAll, expect, it, describe } from "vitest";
import { app } from "@src/app.js";
import { resetDatabase, closeDatabase } from "../helpers/db.js";
import { taskUrl } from "../helpers/routes.js";
import { prisma } from "@src/lib/prisma.js";

/*
  API integration tests for PATCH /api/v1/tasks/:id.

  SUT: the real Express `app` against the test database, with
  FEATURE_UPDATE_TASK enabled in vitest.config.ts. Tasks are seeded directly
  through Prisma so these tests don't depend on POST. The database is reset
  before every test. Exhaustive schema rules live in the schema unit tests.
  Out of scope: the React UI.
*/

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe(`PATCH ${taskUrl}`, () => {
  it("updates the provided fields and returns the updated task", async () => {
    const task = await prisma.task.create({ data: { title: "Old" } });

    const res = await request(app)
      .patch(taskUrl(task.id))
      .send({ title: "New", priority: "HIGH", status: "DONE" });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: task.id,
      title: "New",
      priority: "HIGH",
      status: "DONE",
    });
  });

  it("persists the update in the database", async () => {
    const task = await prisma.task.create({ data: { title: "Old" } });

    await request(app).patch(taskUrl(task.id)).send({ title: "Saved" });

    const saved = await prisma.task.findUnique({ where: { id: task.id } });
    expect(saved?.title).toBe("Saved");
  });

  it("leaves fields that were not sent unchanged", async () => {
    const task = await prisma.task.create({
      data: { title: "Keep", description: "Keep me", priority: "MEDIUM" },
    });

    const res = await request(app).patch(taskUrl(task.id)).send({ status: "IN_PROGRESS" });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      title: "Keep",
      description: "Keep me",
      priority: "MEDIUM",
      status: "IN_PROGRESS",
    });
  });

  it("clears description and dueDate when they are set to null", async () => {
    const task = await prisma.task.create({
      data: { title: "Clear", description: "Gone soon", dueDate: new Date("2026-12-01") },
    });

    const res = await request(app)
      .patch(taskUrl(task.id))
      .send({ description: null, dueDate: null });

    expect(res.status).toBe(200);
    expect(res.body.description).toBeNull();
    expect(res.body.dueDate).toBeNull();

    const saved = await prisma.task.findUnique({ where: { id: task.id } });
    expect(saved?.description).toBeNull();
    expect(saved?.dueDate).toBeNull();
  });

  it("advances updatedAt and keeps createdAt (FR9)", async () => {
    const task = await prisma.task.create({ data: { title: "Time" } });

    const res = await request(app).patch(taskUrl(task.id)).send({ title: "Time 2" });

    expect(new Date(res.body.updatedAt).getTime()).toBeGreaterThan(task.updatedAt.getTime());
    expect(new Date(res.body.createdAt).getTime()).toBe(task.createdAt.getTime());
  });

  it("only updates the targeted task", async () => {
    const other = await prisma.task.create({ data: { title: "Other" } });
    const target = await prisma.task.create({ data: { title: "Target" } });

    await request(app).patch(taskUrl(target.id)).send({ title: "Changed" });

    const untouched = await prisma.task.findUnique({ where: { id: other.id } });
    expect(untouched?.title).toBe("Other");
  });

  it("returns 404 with the error shape when the id does not exist", async () => {
    const res = await request(app).patch(taskUrl(999999)).send({ title: "Nope" });

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("NOT_FOUND");
    expect(res.body.error).not.toHaveProperty("stack");
  });

  it.each([
    ["non-numeric id", "abc"],
    ["negative id", "-1"],
    ["zero id", "0"],
  ])("returns 400 for an invalid id: %s", async (_label, badId) => {
    const res = await request(app).patch(taskUrl(badId)).send({ title: "x" });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  // NFR2: invalid input is rejected and the stored row stays unchanged.
  it.each([
    ["empty body", {}],
    ["empty title", { title: "" }],
    ["whitespace-only title", { title: "   " }],
    ["title too long (256)", { title: "a".repeat(256) }],
    ["invalid priority", { priority: "URGENT" }],
    ["invalid status", { status: "BLOCKED" }],
    ["bad dueDate format", { dueDate: "12/01/2026" }],
  ])("rejects invalid body and leaves the row unchanged: %s", async (_label, body) => {
    const task = await prisma.task.create({ data: { title: "Original" } });

    const res = await request(app).patch(taskUrl(task.id)).send(body);

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");

    const saved = await prisma.task.findUnique({ where: { id: task.id } });
    expect(saved?.title).toBe("Original");
    expect(saved?.priority).toBe("LOW");
    expect(saved?.status).toBe("TODO");
  });
});