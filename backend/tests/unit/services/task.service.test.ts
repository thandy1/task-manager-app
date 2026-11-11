import { beforeEach, describe, it, expect, vi } from "vitest";
import { taskRepository } from "@src/repositories/task.repository.js";
import { taskService } from "@src/services/task.service.js";

// Mock repository
vi.mock("@src/repository/task.repository.ts", () => ({
    taskRepository: { create: vi.fn() },
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