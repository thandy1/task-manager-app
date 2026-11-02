import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";
import { ValidationError, type ValidationDetail } from "../errors/AppError.js";

type RequestSource = "body" | "params";

// A "middleware factory": validate(schema, "body") returns the actual middleware. The first function creates and returns the second function.
export const validate = 
    (schema: ZodType, source: RequestSource) =>
    // Middleware Function
    (req: Request, _res:Response, next: NextFunction): void => {
        // Validation logic
        const result = schema.safeParse(req[source]); // Validate request body or params

        if (!result.success) {
            // Handle validation failure
            const details: ValidationDetail[] = result.error.issues.map((issue) => ({
                field: issue.path.join(".") || source,
                message: issue.message,
            }));
            throw new ValidationError("Validation failed" ,details);
        }

        // Replace the body with the parsed result so trimmed strings are what the controller sees.
        if (source === "body") {
            req.body = result.data;
        }

        next();
    };