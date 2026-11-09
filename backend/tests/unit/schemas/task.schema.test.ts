/* Test suites to test against Task schemas directly */

import { describe, it, expect } from "vitest";
import { createTaskSchema, updateTaskSchema, taskIdParamSchema } from "@src/schemas/task.schema.js";

// parse() validates a JavaScript object against a given schema. 
// If valid, returns the validated JavaScript Object, otherwise throws ZodError.
// Error Handler middleware catches and builds a error HTTP response to the client.

// safeParse() validates a JavaScript object against a given schema.
// If valid or invalid, return a JavaScript object describing the outcome:
/*
          {
              success: true,
              data: {
                  title: "Buy milk"
              }
          }
*/
/* 
          {
              success: false,
              error: ZodError
          }
*/

describe("createTaskSchema", () => {
  it("accepts a title-only body (FR1)", () => {
    expect(createTaskSchema.safeParse({ title: "Buy milk" }).success).toBe(true);
  });

  it("rejects an empty title", () => {
    expect(createTaskSchema.safeParse({ title: "" }).success).toBe(false);
  });

  it("rejects a whitespace-only title", () => {
    expect(createTaskSchema.safeParse({ title: "   " }).success).toBe(false);
  });

  it("accepts a title of 255 characters (boundary)", () => {
    expect(createTaskSchema.safeParse({ title: "a".repeat(255) }).success).toBe(true);
  });

  it("rejects a title of 256 characters (boundary)", () => {
    expect(createTaskSchema.safeParse({ title: "a".repeat(256) }).success).toBe(false);
  });

  it("rejects an invalid priority (FR7)", () => {
    expect(createTaskSchema.safeParse({ title: "x", priority: "URGENT" }).success).toBe(false);
  });

  it("rejects an invalid status (FR8)", () => {
    expect(createTaskSchema.safeParse({ title: "x", status: "OPEN" }).success).toBe(false);
  });

  it("rejects a due date that is not YYYY-MM-DD", () => {
    expect(createTaskSchema.safeParse({ title: "x", dueDate: "11/01/2026" }).success).toBe(false);
  });

  it("trims the title", () => {
    const result = createTaskSchema.parse({ title: "  Buy milk  " });
    expect(result.title).toBe("Buy milk");
  });
});

describe("updateTaskSchema", () => {
  it("accepts a partial update", () => {
    expect(updateTaskSchema.safeParse({ status: "DONE" }).success).toBe(true);
  });

  it("rejects an empty body", () => {
    expect(updateTaskSchema.safeParse({}).success).toBe(false);
  });

  it("accepts null to clear the due date", () => {
    expect(updateTaskSchema.safeParse({ dueDate: null }).success).toBe(true);
  });
});

describe("taskIdParamSchema", () => {
  it("coerces a numeric string to a number", () => {
    expect(taskIdParamSchema.parse({ id: "5" }).id).toBe(5);
  });

  it.each(["abc", "0", "-3", "1.5"])("rejects id '%s'", (id) => {
    expect(taskIdParamSchema.safeParse({ id }).success).toBe(false);
  });
});