import { describe, it, expect, vi } from "vitest";
import type { Request, Response } from "express";
import { validate } from "./validate.js";
import { createTaskSchema } from "../schemas/task.schema.js";
import { ValidationError } from "../errors/AppError.js";

const run = (body: unknown) => {
  const req = { body } as Request;
  const next = vi.fn();
  const middleware = validate(createTaskSchema, "body");
  middleware(req, {} as Response, next);
  return { req, next };
};

describe("validate middleware", () => {
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
      validate(createTaskSchema, "body")({ body: {} } as Request, {} as Response, next);
    } catch {
      // expected
    }
    expect(next).not.toHaveBeenCalled();
  });
});