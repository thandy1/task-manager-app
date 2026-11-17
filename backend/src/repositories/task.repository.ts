import { prisma } from "../lib/prisma.js";
import type { Prisma } from "../generated/prisma/browser.js";

export const taskRepository = {
    /**
     * Keeps list ordering consistent at the data boundary so every caller gets
     * the newest tasks first.
     */
    findAll() {
        return prisma.task.findMany({ orderBy: { createdAt: "desc" } });
    },
    
    /**
     * Updates only the fields present in `data`. Prisma skips `undefined`
     * fields and writes `null` as NULL. Throws P2025 when no row matches,
     * which the service translates into NotFoundError.
     */
    update(id: number, data: Prisma.TaskUpdateInput) {
        return prisma.task.update({ where: { id }, data});
    },

    /**
     * Looks up a task by its ID. Returns `null` when no row matches so the
     * service can decide whether the missing task should become a not-found error.
     */
    findById(id: number) {
        return prisma.task.findUnique({ where: { id } });
    },

    /**
     * Runs an INSERT and returns the new row, including generated fields
     * (`id`, `createdAt`, `updatedAt`) and the defaults.
     * Status and priority fall back to the schema defaults (TODO, LOW).
     */
    create(data: Prisma.TaskCreateInput) {
        return prisma.task.create({ data });
    },
};
