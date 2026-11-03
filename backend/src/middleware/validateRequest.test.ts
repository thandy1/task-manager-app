import { describe, it, expect, vi } from "vitest";
import type { Request, Response } from "express";
import { validateRequest } from "./validateRequest.js";
import { createTaskSchema } from "../schemas/task.schema.js";
import { ValidationError } from "../errors/AppError.js";

// Testing helper. Simulates parts of an Express request that the middleware needs.
const run = (body: unknown) => {
  const req = { body } as Request; // Create a fake Express Request
  const next = vi.fn(); // Create a mock next function. Can check if it was called, times called, and arguments received. 
  const middleware = validateRequest(createTaskSchema, "body"); // Retrieves the middleware function from the factory.
  middleware(req, {} as Response, next); // Manually executes the middleware function from the factory.
  return { req, next };
};

describe("validateRequest middleware", () => {
  it("calls next and replaces body with trimmed data on valid input (NFR2)", () => {
    const { req, next } = run({ title: "  Hello  " });
    expect(next).toHaveBeenCalledOnce();
    expect(req.body.title).toBe("Hello");
  });

  it("throws ValidationError with field details on invalid input (NFR1)", () => {
    try {
      run({ title: "" });
      expect.unreachable("should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError);
      const e = err as ValidationError;
      expect(e.statusCode).toBe(400);
      expect(e.details?.[0]?.field).toBe("title");
    }
  });

  it("does not call next when validation fails", () => {
    const next = vi.fn();
    try {
      validateRequest(createTaskSchema, "body")({ body: {} } as Request, {} as Response, next);
    } catch {
      // expected
    }
    expect(next).not.toHaveBeenCalled();
  });
});