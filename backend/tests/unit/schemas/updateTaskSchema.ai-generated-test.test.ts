import { describe, it, expect } from "vitest";
import { updateTaskSchema } from "@src/schemas/task.schema.js";

/*
  AI-generated test suite for updateTaskSchema (HW12).
  Unit tests: pure schema validation, no database or HTTP.
*/

describe("updateTaskSchema", () => {
  describe("valid input", () => {
    it("accepts a title only", () => {
      expect(updateTaskSchema.safeParse({ title: "New title" }).success).toBe(true);
    });

    it("accepts a description only", () => {
      expect(updateTaskSchema.safeParse({ description: "Details" }).success).toBe(true);
    });

    it("accepts a status only", () => {
      expect(updateTaskSchema.safeParse({ status: "DONE" }).success).toBe(true);
    });

    it("accepts a priority only", () => {
      expect(updateTaskSchema.safeParse({ priority: "HIGH" }).success).toBe(true);
    });

    it("accepts a dueDate only", () => {
      expect(updateTaskSchema.safeParse({ dueDate: "2026-12-01" }).success).toBe(true);
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

    it.each(["TODO", "IN_PROGRESS", "DONE"])("accepts status %s", (status) => {
      expect(updateTaskSchema.safeParse({ status }).success).toBe(true);
    });

    it.each(["LOW", "MEDIUM", "HIGH"])("accepts priority %s", (priority) => {
      expect(updateTaskSchema.safeParse({ priority }).success).toBe(true);
    });
  });

  describe("empty body", () => {
    it("rejects an empty object", () => {
      expect(updateTaskSchema.safeParse({}).success).toBe(false);
    });

    it("reports the 'at least one field' message", () => {
      const result = updateTaskSchema.safeParse({});
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("At least one field must be provided");
      }
    });
  });

  describe("title", () => {
    it("trims surrounding whitespace", () => {
      const result = updateTaskSchema.safeParse({ title: "  Hello  " });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.title).toBe("Hello");
    });

    it("rejects an empty title", () => {
      expect(updateTaskSchema.safeParse({ title: "" }).success).toBe(false);
    });

    it("rejects a whitespace-only title", () => {
      expect(updateTaskSchema.safeParse({ title: "   " }).success).toBe(false);
    });

    it("accepts a one-character title", () => {
      expect(updateTaskSchema.safeParse({ title: "a" }).success).toBe(true);
    });

    it("accepts a 255-character title", () => {
      expect(updateTaskSchema.safeParse({ title: "a".repeat(255) }).success).toBe(true);
    });

    it("rejects a 256-character title", () => {
      expect(updateTaskSchema.safeParse({ title: "a".repeat(256) }).success).toBe(false);
    });

    it("rejects a null title", () => {
      expect(updateTaskSchema.safeParse({ title: null }).success).toBe(false);
    });

    it("rejects a non-string title", () => {
      expect(updateTaskSchema.safeParse({ title: 123 }).success).toBe(false);
    });
  });

  describe("description", () => {
    it("accepts null to clear the description", () => {
      const result = updateTaskSchema.safeParse({ description: null });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.description).toBeNull();
    });

    it("accepts a 5000-character description", () => {
      expect(updateTaskSchema.safeParse({ description: "a".repeat(5000) }).success).toBe(true);
    });

    it("rejects a 5001-character description", () => {
      expect(updateTaskSchema.safeParse({ description: "a".repeat(5001) }).success).toBe(false);
    });

    it("trims the description", () => {
      const result = updateTaskSchema.safeParse({ description: "  note  " });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.description).toBe("note");
    });

    it("accepts a whitespace-only description as an empty string", () => {
      const result = updateTaskSchema.safeParse({ description: "   " });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.description).toBe("");
    });
  });

  describe("dueDate", () => {
    it("accepts null to clear the due date", () => {
      const result = updateTaskSchema.safeParse({ dueDate: null });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.dueDate).toBeNull();
    });

    it.each([
      ["slash format", "12/01/2026"],
      ["datetime string", "2026-12-01T00:00:00Z"],
      ["empty string", ""],
      ["impossible date", "2026-02-30"],
      ["non-leap Feb 29", "2027-02-29"],
      ["month 13", "2026-13-01"],
    ])("rejects an invalid dueDate: %s", (_label, dueDate) => {
      expect(updateTaskSchema.safeParse({ dueDate }).success).toBe(false);
    });

    it("accepts a leap-day date", () => {
      expect(updateTaskSchema.safeParse({ dueDate: "2028-02-29" }).success).toBe(true);
    });
  });

  describe("status and priority", () => {
    it.each(["URGENT", "todo", "", null, 1])("rejects invalid priority %s", (priority) => {
      expect(updateTaskSchema.safeParse({ priority }).success).toBe(false);
    });

    it.each(["BLOCKED", "done", "", null, 1])("rejects invalid status %s", (status) => {
      expect(updateTaskSchema.safeParse({ status }).success).toBe(false);
    });
  });

  describe("unknown keys", () => {
    it("rejects a body that contains only unknown keys", () => {
      expect(updateTaskSchema.safeParse({ foo: "bar" }).success).toBe(false);
    });

    it("strips unknown keys alongside valid ones", () => {
      const result = updateTaskSchema.safeParse({ title: "Valid", foo: "bar" });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data).not.toHaveProperty("foo");
    });

    it("does not allow id to be updated", () => {
      const result = updateTaskSchema.safeParse({ title: "Valid", id: 99 });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data).not.toHaveProperty("id");
    });
  });

  describe("non-object input", () => {
    it.each([null, undefined, "string", 42, []])("rejects %s", (input) => {
      expect(updateTaskSchema.safeParse(input).success).toBe(false);
    });
  });
});