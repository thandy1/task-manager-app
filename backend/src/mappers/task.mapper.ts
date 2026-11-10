// Prisma-generated type
import type { Task } from "../generated/prisma/client.js";

// API response type
// Omit is a typescript utility that creates a new type based on a existing type, but 
// removes a property.
// Prisma represents dueDate as a JavaScript Date object, but we want the API to return it as a string instead or null.
export type TaskResponse = Omit<Task, "dueDate"> & {
    dueDate: string | null;
};

/**
 * `dueDate` Response Mapper 
 * 
 * Prisma `@db.Date` columns as a Date at UTC midnight on retrieval calls. Because
 * JS has no date-only type, the mapper converts that back to ISO date 
 * format `YYYY-MM-DD` string the client originally sent, so the round trip is symmetric. 
 * Slicing the UTC ISO string keeps the calender day stable regardless of 
 * the server's time zone.
 */
export function toTaskResponse(task: Task): TaskResponse {
    return {
        ...task,
        dueDate: task.dueDate ? task.dueDate.toISOString().slice(0, 10) : null,
    };
}