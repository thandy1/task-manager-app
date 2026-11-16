import { taskRepository } from "../repositories/task.repository.js";
import { NotFoundError } from "../errors/AppError.js";
import type { CreateTaskInput } from "../schemas/task.schema.js";

export const taskService = {
    /**
     * Lets the repository provide the complete list without adding business
     * rules to a read operation that has none.
     */
    getAllTasks() {
        return taskRepository.findAll();
    },

    /**
     * Returns the task with the requested ID, or throws when the repository
     * reports that no matching task exists.
     */
    async getTaskById(id: number) {
        const task = await taskRepository.findById(id);
        if (!task) {
            throw new NotFoundError("Task not found");
        }

        return task;
    },

    /**
     * Creates a task. Converts the "YYYY-MM-DD" dueDate string into a Date object,
     * because the repository (and Prisma) work with Date objects, not API strings.
     */
    async createTask(input: CreateTaskInput) {
        const { dueDate, ...rest } = input;
        return taskRepository.create({
            ...rest,
            dueDate: dueDate ? new Date(dueDate) : undefined,
        });
    },
};
