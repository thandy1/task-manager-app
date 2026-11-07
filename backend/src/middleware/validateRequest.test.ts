import { describe, expect, it, vi } from "vitest";
import express from "express";
import request from "supertest";
import type { Request, Response } from "express";
import { validateRequest } from "./validateRequest.js";
import { errorHandler } from "./errorHandler.js";
import { createTaskSchema, taskIdParamSchema } from "../schemas/task.schema.js";
import { ValidationError } from "../errors/AppError.js";

// Test helper to create a empty mock response object
const mockRes = () => ({ locals: {} }) as unknown as Response;

/* 
  Unit Tests: test `validateRequest independently, verifying that it 
  forwards the correct error.
*/

describe("validateRequest (unit)", () => {
  it("calls next and replace body with trimmed data", () => {
    const req = { body: { title: "  Hello  "} } as Request;
    const res = mockRes();
    const next = vi.fn(); // Mock next function; can check number of calls, arguments received, and if it was called.
    validateRequest(createTaskSchema, "body")(req, res, next);
    expect(next).toHaveBeenCalledOnce();
    expect(req.body.title).toBe("Hello");
   });

   it("passes ValidationError to next on invalid body", () => {
    const req = { body: { title: ""} } as Request;
    const res = mockRes();
    const next = vi.fn();
    validateRequest(createTaskSchema, "body")(req, res, next);
    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(ValidationError);
   });

   it("stores the coerced id in res.locals.params", () => {
    const req = { params: { id: "5" } } as unknown as Request;
    const res = mockRes();
    const next = vi.fn();
    validateRequest(taskIdParamSchema, "params")(req, res, next);
    expect(res.locals.params).toEqual({ id: 5 });
    expect(next).toHaveBeenCalledOnce();
   });

   it("throws ValidationError for a non-numeric id", () => {
    const req = { params: { id: "abc" } } as unknown as Request;
    const res = mockRes();
    const next = vi.fn();
    validateRequest(taskIdParamSchema, "params")(req, res, next);
    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
   });
});

/* 
  Integration Tests: test whether `validateRequest` works correctly with
  express routing, JSON parsing, and centralized error handler. 
*/

// Real Express pipeline: the thrown error goes through errorHandler
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