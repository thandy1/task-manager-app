import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "@src/app.js";
import { API_PREFIX, TASKS_URL } from "../helpers/routes.js";

// No database hooks: these requests fail before any route or Prisma call runs.

describe("cross-cutting error handling", () => {
  it("returns 400 INVALID_JSON when the body is not valid JSON", async () => {
    const res = await request(app)
      .post(TASKS_URL)
      .set("Content-Type", "application/json")
      .send('{"title": '); // truncated JSON, sent as a raw string

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: { code: "INVALID_JSON", message: "Request body is not valid JSON" },
    });
  });

  it("returns 404 with the standard error shape for an unknown route", async () => {
    const res = await request(app).get(`${API_PREFIX}/does-not-exist`);

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("NOT_FOUND");
    expect(res.body.error).toHaveProperty("message");
  });
});