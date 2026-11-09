import { taskRepository } from "../repository/task.repository.js";
import { createTaskSchema } from "../schemas/task.schema.js";
import type { CreateTaskInput } from "../schemas/task.schema.js";

export const taskService = {
    /**
     * Creates a task. Converts the "YYYY-MM-DD" dueDate string into a Date object,
     * because the repository (and Prisma) work with Date objects, not API strings.
     */
    async createTask(input: CreateTaskInput) {
        const { dueDate, ...rest} = input;
        return taskRepository.create({
            ...rest,
            dueDate: dueDate ? new Date(dueDate) : undefined,
        });
    },
};