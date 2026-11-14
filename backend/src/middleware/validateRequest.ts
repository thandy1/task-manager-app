import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";
import { ValidationError, type ValidationDetail } from "../errors/AppError.js";

type RequestSource = "body" | "params"; // This type accepts "body" or "params".

// A "middleware factory": creates configurable reusable middleware without duplicating its implementation.
// Accepts whichever zod schema and request property given to validate.
export const validateRequest = 
    (schema: ZodType, source: RequestSource) =>
    // Return an Express middleware function
    (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req[source]); // Validate and transform request "body" or "params"
        // If validation fails, Zod issues are converted into ValidationDetail objects and passed to the error handler.
        if (!result.success) {
            const details: ValidationDetail[] = result.error.issues.map((issue) => ({
                // (e.g. ["title"] -> "title", ["user", "email"] -> "user.email")
                field: issue.path.join(".") || source,  
                message: issue.message,
            }));
            next(new ValidationError("Validation failed", details));
            return;
        }

        // Body: replace so the controller sees trimmed/cleaned data.
        // Params: req.params is typed as strings, so keep the parsed (coerced).
        // values in res.locals instead; controllers read res.locals.params
        if (source === "body") {
            req.body = result.data;
        } else {
            res.locals[source] = result.data;
        }

        next(); 
    };