import { beforeEach, describe, it, expect, vi } from "vitest";
import { taskRepository } from "@src/repositories/task.repository.js";
import { taskService } from "@src/services/task.service.js";
import { NotFoundError } from "@src/errors/AppError.js";

// Mock repository
vi.mock("@src/repositories/task.repository.ts", () => ({
    taskRepository: { create: vi.fn(), findById: vi.fn() },
}));

describe("taskService.createTask", () => {
    // Callback function to be executed before each test.
    beforeEach(() => {
        vi.clearAllMocks(); // Clears all mocks so we can reinitialize the test suite.
    });

    it("converts the dueDate string to a Date before calling the repository", async () => {
        await taskService.createTask({
            title: "Write tests",
            // description: undefined, meaning the user did not include a dueDate.
            status: "TODO",
            priority: "LOW",
            dueDate: "2026-12-09",
        });

        // Stores history of every time the mocked function was called, including the
        // arguments passed.
        // vi.mocked() tells vitest to treat the given mock as a mock function giving it
        // mock-specific properties like `.mock.calls`.
        const arg = vi.mocked(taskRepository.create).mock.calls[0][0];
        expect(arg.dueDate).toEqual(new Date("2026-12-09"));
    });

    it("leaves dueDate undefined when none is provided", async () => {
        await taskService.createTask({
            title: "Write tests",
            status: "TODO",
            priority: "LOW",
        });

        const arg = vi.mocked(taskRepository.create).mock.calls[0][0];
        expect(arg.dueDate).toBeUndefined();
    });
});

describe("taskService.findById", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns the task when the repository finds it", async () => {
        // Full Prisma Task shape, so mockResolvedValue type-checks.
        const task = {
            id: 1,
            title: "Write tests",
            description: null,
            // `as const` preserves the exact string literal type instead of widening it
            // to `string`. This allows the mock values to satisfy Prisma's generated
            // enum types (TaskStatus and TaskPriority). Also makes the property readonly.
            status: "TODO" as const,
            priority: "LOW" as const,
            dueDate: null,
            createdAt: new Date("2026-11-01T00:00:00.000Z"),
            updatedAt: new Date("2026-11-01T00:00:00.000Z"),
        };
        // `.mockResolvedValue()`: Configures the mock to return a Promise that resolves
        // to the given value instead of executing the real implementation.
        // Tells vitest what to return when the repository method is called.
        vi.mocked(taskRepository.findById).mockResolvedValue(task);

        // Service calls the mocked repository method.
        const result = await taskService.getTaskById(1);

        expect(taskRepository.findById).toHaveBeenCalledWith(1);
        expect(result).toEqual(task);
    });

    it("throws NotFoundError when the repository returns null", async () => {
        vi.mocked(taskRepository.findById).mockResolvedValue(null);

        await expect(taskService.getTaskById(999)).rejects.toThrow(NotFoundError);
    });
});