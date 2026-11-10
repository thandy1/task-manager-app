import { prisma } from "../lib/prisma.js";
import type { Prisma } from "../generated/prisma/browser.js";

export const taskRepository = {
    /**
     * Runs an INSERT and returns the new row, including generated fields
     * (`id`, `createdAt`, `updatedAt`) and the defaults.
     * Status and priority fall back to the schema defaults (TODO, LOW).
     */
    create(data: Prisma.TaskCreateInput) {
        return prisma.task.create({ data });
    },
};
