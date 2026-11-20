import { taskRepository } from "../repositories/task.repository.js";
import { NotFoundError } from "../errors/AppError.js";
import type { CreateTaskInput, UpdateTaskInput } from "../schemas/task.schema.js";
import { Prisma } from "../generated/prisma/client.js";
import { isRecordNotFound } from "@src/errors/prismaErrors.js";

export const taskService = {
    /**
     * Converts Prisma's missing-row failure into the API's not-found error so
     * callers receive the same response for tasks that cannot be deleted.
     */
    async deleteTask(id: number) {
        try {
            return await taskRepository.delete(id);
        } catch (err) {
            if (isRecordNotFound(err)) throw new NotFoundError("Task not found");
            throw err;
        }
    },

    /**
     * Treats clearing an already empty task collection as successful so the
     * operation stays idempotent for callers.
     */
    clearAllTasks() {
        return taskRepository.deleteAll();
    },

    /**
     * Lets the repository provide the complete list without adding business
     * rules to a read operation that has none.
     */
    getAllTasks() {
        return taskRepository.findAll();
    },

    /**
     * Applies a partial update. Convert dueDate to a Date (null stays null to clear it,
     * undefined stays undefined to leave it alone) and turns Prisma's "record not found"
     * error into a 404, so the repository stays a thin wrapper.
     */
    async updateTask(id: number, input: UpdateTaskInput) {
        const { dueDate, ...rest} = input;
        try {
            return await taskRepository.update(id, {
                ...rest,
                dueDate: dueDate ? new Date(dueDate) : dueDate,
            });
        } catch (err) {
            if (isRecordNotFound(err)) throw new NotFoundError("Task not found");
            throw err;
        }
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
