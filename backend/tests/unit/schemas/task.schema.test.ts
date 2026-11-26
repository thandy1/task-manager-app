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

  it.each([
    ["description", { title: "x", description: null }],
    ["dueDate", { title: "x", dueDate: null }],
  ])("accepts null for %s", (_field, body) => {
    expect(createTaskSchema.safeParse(body).success).toBe(true);
  });
});

// Helper: parse a value that SHOULD fail and return Zod's list of issues.
// Throwing when it unexpectedly succeeds gives a clearer failure message
// than "expected true to be false".
const issuesFor = (input: unknown) => {
  const result = updateTaskSchema.safeParse(input);
  if (result.success) {
    throw new Error(`Expected validation to fail for ${JSON.stringify(input)}`);
  }
  return result.error.issues;
};

// Asserts that at least one issue matches the given field path (and code, if given).
const expectIssue = (
  issues: ReturnType<typeof issuesFor>,
  path: string[],
  code?: string,
) => {
  expect(issues).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ path, ...(code ? { code } : {}) }),
    ]),
  );
};

describe("updateTaskSchema", () => {
  describe("valid input", () => {
    it("accepts a partial update", () => {
      expect(updateTaskSchema.safeParse({ status: "DONE" }).success).toBe(true);
    });

    it("accepts all fields together", () => {
      const result = updateTaskSchema.safeParse({
        title: "All",
        description: "Everything",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        dueDate: "2026-12-01",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("empty body", () => {
    it("rejects an empty object with the 'at least one field' message", () => {
      const issues = issuesFor({});
      expect(issues[0].message).toBe("At least one field must be provided");
    });

    it("rejects a body containing only unknown keys (they are stripped first)", () => {
      const issues = issuesFor({ foo: "bar" });
      expect(issues[0].message).toBe("At least one field must be provided");
    });
  });

  describe("title", () => {
    it("trims surrounding whitespace", () => {
      const result = updateTaskSchema.safeParse({ title: "  Hello  " });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.title).toBe("Hello");
    });

    it("accepts a one-character title (lower boundary)", () => {
      expect(updateTaskSchema.safeParse({ title: "a" }).success).toBe(true);
    });

    it("accepts a 255-character title (upper boundary)", () => {
      expect(updateTaskSchema.safeParse({ title: "a".repeat(255) }).success).toBe(true);
    });

    it("rejects an empty title as too small", () => {
      expectIssue(issuesFor({ title: "" }), ["title"], "too_small");
    });

    it("rejects a whitespace-only title as too small (trim runs first)", () => {
      expectIssue(issuesFor({ title: "   " }), ["title"], "too_small");
    });

    it("rejects a 256-character title as too big", () => {
      expectIssue(issuesFor({ title: "a".repeat(256) }), ["title"], "too_big");
    });

    it.each([
      ["null", null],
      ["a number", 123],
    ])("rejects a title that is %s as the wrong type", (_label, title) => {
      expectIssue(issuesFor({ title }), ["title"], "invalid_type");
    });
  });

  describe("description", () => {
    it("accepts null to clear the description", () => {
      const result = updateTaskSchema.safeParse({ description: null });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.description).toBeNull();
    });

    it("trims the description", () => {
      const result = updateTaskSchema.safeParse({ description: "  note  " });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.description).toBe("note");
    });

    it("accepts a 5000-character description (upper boundary)", () => {
      expect(updateTaskSchema.safeParse({ description: "a".repeat(5000) }).success).toBe(true);
    });

    it("rejects a 5001-character description as too big", () => {
      expectIssue(issuesFor({ description: "a".repeat(5001) }), ["description"], "too_big");
    });

    it.each([
      ["whitespace-only", "   "],
      ["empty string", ""],
    ])("normalizes a %s description to null", (_label, description) => {
      const result = updateTaskSchema.safeParse({ description });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.description).toBeNull();
    });

    it("normalizes a whitespace-only description to null", () => {
      const result = createTaskSchema.parse({ title: "x", description: "   " });
      expect(result.description).toBeNull();
    });
  });

  describe("dueDate", () => {
    it("accepts a valid YYYY-MM-DD date", () => {
      expect(updateTaskSchema.safeParse({ dueDate: "2026-12-01" }).success).toBe(true);
    });

    it("accepts null to clear the due date", () => {
      const result = updateTaskSchema.safeParse({ dueDate: null });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.dueDate).toBeNull();
    });

    it("accepts a leap day in a leap year", () => {
      expect(updateTaskSchema.safeParse({ dueDate: "2028-02-29" }).success).toBe(true);
    });

    it.each([
      ["slash format", "12/01/2026"],
      ["datetime string", "2026-12-01T00:00:00Z"],
      ["empty string", ""],
      ["impossible date (Feb 30)", "2026-02-30"],
      ["Feb 29 in a non-leap year", "2027-02-29"],
      ["month 13", "2026-13-01"],
    ])("rejects an invalid dueDate: %s", (_label, dueDate) => {
      expectIssue(issuesFor({ dueDate }), ["dueDate"]);
    });
  });

  describe("status and priority", () => {
    it.each([
      ["wrong value", "URGENT"],
      ["wrong case", "low"],
      ["empty string", ""],
      ["null", null],
      ["a number", 1],
    ])("rejects an invalid priority: %s", (_label, priority) => {
      expectIssue(issuesFor({ priority }), ["priority"]);
    });

    it.each([
      ["wrong value", "BLOCKED"],
      ["wrong case", "done"],
      ["empty string", ""],
      ["null", null],
      ["a number", 1],
    ])("rejects an invalid status: %s", (_label, status) => {
      expectIssue(issuesFor({ status }), ["status"]);
    });
  });

  describe("unknown keys", () => {
    it("strips unknown keys alongside valid ones", () => {
      const result = updateTaskSchema.safeParse({ title: "Valid", foo: "bar" });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data).not.toHaveProperty("foo");
    });

    // Unit-level claim only: the schema strips `id` from the parsed output.
    // Whether the database row's id is actually protected is an integration concern.
    it("strips id from the parsed output", () => {
      const result = updateTaskSchema.safeParse({ title: "Valid", id: 99 });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data).not.toHaveProperty("id");
    });
  });

  describe("non-object input", () => {
    it.each([
      ["null", null],
      ["undefined", undefined],
      ["a string", "string"],
      ["a number", 42],
      ["an array", []],
    ])("rejects %s", (_label, input) => {
      expect(updateTaskSchema.safeParse(input).success).toBe(false);
    });
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