import { NextFunction, Request, Response } from "express";
import { AppError, ValidationError, ValidationDetail, NotFoundError } from "../errors/AppError.js";

// Regular Middleware: 3 parameters
// Runs when no route matched. It doesn't respond itself; it creates a
// NotFoundError and passes it to the error handler middleware below via next().
export function notFoundHandler(
    req: Request, 
    _res: Response, 
    next: NextFunction
) {
    next(new NotFoundError(`Route ${req.method} ${req.path} not found`));
}

// Error Handler Middleware: 4 parameters
// Centralize error responses
// Express recognizes an error handler by its FOUR parameters, so `_next`
// must stay even though we don't use it.
export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
) {
    // Errors thrown on purpose.
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            error: {
                code: err.code,
                message: err.message,
                // If details exist, add a details property to this response object. Otherwise, leave it out.
                ...(err.details && { details: err.details}),
            },
        });
        return;
    }

    // Malformed JSON body: express.json() throws this before any route runs.
    // Does this error have a type property equal to entity.parse.failed?
    // Think of `type` as an alias for `err` since we dont know what type `err` is.
    if ((err as { type?: string }).type === "entity.parse.failed") {
        res.status(400).json({
            error: { 
                code: "INVALID_JSON", 
                message: "Request body is not valid JSON",
            },
        });
        return;
    }

    // Anything else is a bug. Log the full error for ourselves, but send the 
    // client a generic message: no stack trace or internals (NFR1).
    console.log(err);
    res.status(500).json({
        error: { 
            code: "INTERNAL_ERROR", 
            message: "An unexpected error occurred",
        },
    });
}
