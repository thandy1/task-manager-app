import { describe, expect, it, vi } from "vitest";
import type { Request, Response } from "express";
import { validateRequest } from "@src/middleware/validateRequest.js";
import { createTaskSchema, taskIdParamSchema } from "@src/schemas/task.schema.js";
import { ValidationError } from "@src/errors/AppError.js";

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