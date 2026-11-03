import { NextFunction, Request, Response } from "express";
import { AppError, ValidationError, ValidationDetail, NotFoundError } from "../errors/AppError.js";

// Regular Middleware, first parameter must be a Request object so express recognize it.
// Runs when no route matched. It doesn't respond itself; it creates a
// NotFoundError and passes it to the error middleware via next(error).
export function notFoundHandler(
    req: Request, 
    _res: Response, 
    next: NextFunction
) {
    next(new NotFoundError(`Route ${req.method} ${req.path} not found`));
}

// Error Handler Middleware, first parameter must be an error so express recognizes it.
// centralizes error handling and builds appropriate response to the client.
// Express recognizes an error handler by its FOUR parameters, so `_next`
// must stay even though we don't use it.
export function errorHandler(
    err: unknown, // error being passed
    _req: Request, // incoming request
    res: Response, // outgoing response
    _next: NextFunction, // continue processing
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
