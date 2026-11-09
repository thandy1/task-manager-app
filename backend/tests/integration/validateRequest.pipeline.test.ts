import {  describe, it, expect } from "vitest";
import express from "express";
import request from "supertest";
import { validateRequest } from "@src/middleware/validateRequest.js";
import { errorHandler } from "@src/middleware/errorHandler.js";
import { createTaskSchema, taskIdParamSchema } from "@src/schemas/task.schema.js";

/* 
  Integration Tests: test whether `validateRequest` works correctly with
  express routing, JSON parsing, and centralized error handler. 
*/

// Throwaway Express app pipeline: the thrown error goes through errorHandler
const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.post("/tasks", validateRequest(createTaskSchema, "body"), (req, res) => {
    res.status(201).json(req.body);
  });
  app.get("/tasks/:id", validateRequest(taskIdParamSchema, "params"), (req, res) => {
    res.json(res.locals.params);
  });
  app.use(errorHandler);
  return app;
};

describe("validateRequest (in the Express pipeline", () => {
  it("returns 400 in the NFR1 error shape for an invalid body", async () => {
    const app = buildApp();
    const res = await request(app).post("/tasks").send({ title: ""});
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    expect(res.body.error.details[0].field).toBe("title");
  });

  it("passes trimmed body data to the handler", async () => {
    const app = buildApp();
    const res = await request(app).post("/tasks").send({ title: "  Hi  "});
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Hi");
  });

  it("returns 400 for a bad id and the numeric id for a good one", async () => {
    const app = buildApp();
    expect((await request(app).get("/tasks/abc")).status).toBe(400);
    const res = await request(app).get("/tasks/5");
    expect(res.status).toBe(200);
    expect(res.body.id).toEqual(5);
  });
});