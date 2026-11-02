import { z } from "zod";

const TITLE_MAX = 255; 
const DESCRIPTION_MAX = 5000;   // PostgreSQL TEXT type supports 1GB of storage, no defined limit. 
                                // To prevent the client from sending large request bodies cap description 
                                // at 5000 characters in the API request validation.

// Must match the PostgreSQL enums defined in prisma/schema.prisma.
export const taskStatusSchema = z.enum(["TODO", "IN_PROGRESS", "DONE"]);
export const taskPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);

// POST /tasks body (FR1, FR7, FR8)
export const createTaskSchema = z.object({
    title: z.string().trim().min(1, "Title is required").max(TITLE_MAX),
    description: z.string().trim().max(DESCRIPTION_MAX).optional(),
    status: taskStatusSchema.optional(), // DB default: TODO
    priority: taskPrioritySchema.optional(), // DB default: LOW
    dueDate: z.iso.date("Due date must be in YYYY-MM-DD format").optional(),
});

// PATCH /tasks/:id body (FR4): every field optional, but not an empty body.
export const updateTaskSchema = createTaskSchema
    .partial() // Makes every field optional
    .extend({
        // null means "clear this value" 
        description: z.string().trim().max(DESCRIPTION_MAX).nullable().optional(),
        dueDate: z.iso.date("Due date must be in YYYY-MM-DD format").nullable().optional(),
    })
    .refine((body) => Object.keys(body).length > 0, { // Reject empty request body
        message: "At least one field must be provided"
    });

// :id path parameter. Path params always arrive as strings, 
// so coerce. Non number strings (e.g "abc", "1.5") all fail.
export const taskIdParamSchema = z.object({
    id: z.coerce.number().int().positive("Id must be a positive integer"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;