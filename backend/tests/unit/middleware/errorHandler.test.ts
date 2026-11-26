import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextFunction, Request, Response } from "express";
import { errorHandler } from "@src/middleware/errorHandler.js";
import { logger } from "@src/lib/logger.js";
import { TASKS_URL } from "../../helpers/routes.js";

// Replace the real logger so tests stay quiet and we can assert on what was logged.
vi.mock("@src/lib/logger.js", () => ({
  logger: { warn: vi.fn(), error: vi.fn() },
}));

// A fake Response. status() returns the same object so res.status(400).json(...) chains.
function makeRes() {
  const res = { status: vi.fn(), json: vi.fn() };
  res.status.mockReturnValue(res);
  return res;
}

const req = { method: "POST", originalUrl: `${TASKS_URL}` } as Request;
const next = vi.fn() as NextFunction;

describe("errorHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 INVALID_JSON for a body-parser parse failure", () => {
    const res = makeRes();
    // body-parser marks bad JSON with type "entity.parse.failed".
    const err = Object.assign(new SyntaxError("Unexpected token"), {
      type: "entity.parse.failed",
    });

    errorHandler(err, req, res as unknown as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: { code: "INVALID_JSON", message: "Request body is not valid JSON" },
    });
    expect(logger.warn).toHaveBeenCalled();
  });

  it("returns a generic 500 and leaks no internals for an unexpected error (NFR1)", () => {
    const res = makeRes();
    const err = new Error("connection string: postgres://user:secret@db");

    errorHandler(err, req, res as unknown as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" },
    });

    // The client body must not contain the error text or a stack trace.
    const body = JSON.stringify(res.json.mock.calls[0][0]);
    expect(body).not.toContain("secret");
    expect(body).not.toContain("stack");

    // The full error is still logged for the developer.
    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({ err }),
      "unhandled error",
    );
  });
});