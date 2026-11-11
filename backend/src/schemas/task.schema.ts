// Using Zod, we can validate and transform data, and or return the transformed result.
import { z } from "zod"; 

const TITLE_MAX = 255; // Max character length for a title property.
// PostgreSQL TEXT type supports 1GB of storage, no defined limit. 
// To prevent the client from sending large request bodies, cap description 
// at 5000 characters in the API request validation.
const DESCRIPTION_MAX = 5000;  

// Must match the PostgreSQL enums defined in prisma/schema.prisma.
export const taskStatusSchema = z.enum(["TODO", "IN_PROGRESS", "DONE"]);
export const taskPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);

// POST /tasks body (FR1, FR7, FR8)
export const createTaskSchema = z.object({
    title: z.string().trim().min(1, "Title is required").max(TITLE_MAX),
    description: z.string().trim().max(DESCRIPTION_MAX).optional(),
    status: taskStatusSchema.optional(), // Database provides default to `TODO`
    priority: taskPrioritySchema.optional(), // Database provides default to `LOW`
    dueDate: z.iso.date("Due date must be in YYYY-MM-DD format").optional(),
});

// PATCH /tasks/:id body (FR4): every field optional, but not an empty body.
export const updateTaskSchema = createTaskSchema
    .partial() // Makes every field optional on createTaskSchema (absent or omitted).
    .extend({ // Adds properties to an object schema or replaces the definitions of given properties.
        // Add nullable() to `description` and `dueDate` to accept cleared values from given properties.
        description: z.string().trim().max(DESCRIPTION_MAX).nullable().optional(),
        dueDate: z.iso.date("Due date must be in YYYY-MM-DD format").nullable().optional(),
    })
    // Custom validation that rejects an empty request body.
    .refine((body) => Object.keys(body).length > 0, { 
        message: "At least one field must be provided"
    });

// GET /tasks/:id path parameter (e.g. req.params.id) 
// Path params always arrive as strings, so coerce them to numbers before validating them then add constraints.
export const taskIdParamSchema = z.object({
    id: z.coerce.number().int().positive("Id must be a positive integer"),
});

// z.infer derives a TypeScript type from the schema instead of having to duplicate its implementation.
/* 
    Example:

    type CreateTaskInput = {
        title: string;
        description?: string | undefined;
        status?: "TODO" | "IN_PROGRESS" | "DONE" | undefined;
        priority?: "LOW" | "MEDIUM" | "HIGH" | undefined;
        dueDate?: string | undefined;
    };

    type UpdateTaskInput = {
        title?: string | undefined;
        description?: string | null | undefined;
        status?: "TODO" | "IN_PROGRESS" | "DONE" | undefined;
        priority?: "LOW" | "MEDIUM" | "HIGH" | undefined;
        dueDate?: string | null | undefined;
    };

*/

// Useful for services and controllers
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;