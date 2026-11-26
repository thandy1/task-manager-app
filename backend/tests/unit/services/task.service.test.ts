import { beforeEach, describe, it, expect, vi } from "vitest";
import { taskRepository } from "@src/repositories/task.repository.js";
import { taskService } from "@src/services/task.service.js";
import { NotFoundError } from "@src/errors/AppError.js";
import { Prisma } from "@src/generated/prisma/client.js";

// Mock repository
vi.mock("@src/repositories/task.repository.ts", () => ({
    taskRepository: { create: vi.fn(), findById: vi.fn(), update: vi.fn(), findAll: vi.fn(), delete: vi.fn(), deleteAll: vi.fn() },
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

describe("taskService.updateTask", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("converts a dueDate string to a Date", async () => {
        await taskService.updateTask(1, { dueDate: "2026-12-09" });

        const data = vi.mocked(taskRepository.update).mock.calls[0][1];
        expect(data.dueDate).toEqual(new Date("2026-12-09"));
    });

    it("passes null through so the column is cleared", async () => {
        await taskService.updateTask(1, { dueDate: null, description: null });

        const data = vi.mocked(taskRepository.update).mock.calls[0][1];
        expect(data.dueDate).toBeNull();
        expect(data.description).toBeNull();
    });

    it("leaves dueDate undefined when not provided, so it isn't touched", async () => {
        await taskService.updateTask(1, { title: "New title" });

        const data = vi.mocked(taskRepository.update).mock.calls[0][1];
        expect(data.dueDate).toBeUndefined();
    });

    it("throws NotFoundError when Prisma reports P2025", async () => {
        // Simulate Prisma's P2025 error, which occurs when an operation
        // depends on a record that doesn't exist (e.g., updating a nonexistent task).
        // The service should translate this database error into a NotFoundError.
        vi.mocked(taskRepository.update).mockRejectedValue(
            new Prisma.PrismaClientKnownRequestError("Record not found", {
                code: "P2025",
                clientVersion: "7.10.1",
            }),
        );

        await expect(taskService.updateTask(999, { title: "x" })).rejects.toThrow(NotFoundError);
    });

    it("rethrows errors other than Prisma P2025", async () => {
        const error = new Error("Database unavailable");
        vi.mocked(taskRepository.update).mockRejectedValue(error);

        await expect(taskService.updateTask(1, { title: "x" })).rejects.toBe(error);
    });
});

describe("taskService.deleteTask", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls the repository with the task ID and resolves on success", async () => {
        vi.mocked(taskRepository.delete).mockResolvedValue(undefined as never);

        await expect(taskService.deleteTask(1)).resolves.toBeUndefined();
        expect(taskRepository.delete).toHaveBeenCalledWith(1);
    });

    it("throws NotFoundError when Prisma reports P2025", async () => {
        vi.mocked(taskRepository.delete).mockRejectedValue(
            new Prisma.PrismaClientKnownRequestError("Record not found", {
                code: "P2025",
                clientVersion: "7.10.1",
            }),
        );

        await expect(taskService.deleteTask(999)).rejects.toThrow(NotFoundError);
    });

    it("rethrows errors other than Prisma P2025", async () => {
        const error = new Error("Database unavailable");
        vi.mocked(taskRepository.delete).mockRejectedValue(error);

        await expect(taskService.deleteTask(1)).rejects.toBe(error);
    });
});

describe("taskService.clearAllTasks", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls the repository deleteAll method once", async () => {
        vi.mocked(taskRepository.deleteAll).mockResolvedValue({ count: 0 });

        await taskService.clearAllTasks();

        expect(taskRepository.deleteAll).toHaveBeenCalledTimes(1);
    });
});

describe("taskService.getAllTasks", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns the tasks provided by the repository", async () => {
        const tasks = [
            {"id": 2, "title": "Newer tasks"},
            {"id": 1, "title": "Older task"},
        ];
        // `as never` just silences a type mismatch, since our fake objects dont have
        // every Prisma field. It's fine in tests.
        vi.mocked(taskRepository.findAll).mockResolvedValue(tasks as never);

        const result = await taskService.getAllTasks();

        expect(result).toEqual(tasks);
        expect(taskRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it("returns an empty array when there are no tasks", async () => {
        vi.mocked(taskRepository.findAll).mockResolvedValue([]);

        const result = await taskService.getAllTasks();

        expect(result).toEqual([]);
    });
});
