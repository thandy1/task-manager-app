import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import { logger } from "../lib/logger.js";

// Error Handler Middleware, first parameter must be an error so express recognizes it.
// centralizes error handling and builds appropriate response to the client.
// Express recognizes an error handler by its FOUR parameters, so `_next`
// must stay even though we don't use it.
export function errorHandler(
    err: unknown, // error being passed
    req: Request, 
    res: Response, 
    _next: NextFunction, 
) {
    // Errors thrown on purpose (validation, not found). Expected, so `warn` (4xx), not `error` (500).
    if (err instanceof AppError) {
        logger.warn({
            code: err.code, status: err.statusCode, method: req.method, path: req.originalUrl
        }, "request rejected",);

        res.status(err.statusCode).json({
            error: {
                code: err.code,
                message: err.message,
                // If details exist, add a details property to the response object. 
                ...(err.details && { details: err.details}),
            },
        });
        return;
    }

    // Malformed JSON check
    // Type assertion: "Treat err as an object that may have a type property,
    // and if it does, that property is a string."
    // Check whether the error's type property exactly matches "entity.parsed.failed".
    if ((err as { type?: string }).type === "entity.parse.failed") {
        logger.warn({ 
            code: "INVALID_JSON", status: 400, method: req.method, path: req.originalUrl
        }, "request rejected",);

        res.status(400).json({
            error: { 
                code: "INVALID_JSON", 
                message: "Request body is not valid JSON",
            },
        });
        return;
    }

    // Unexpected bug: log the full error for us, send the client nothing internal (NFR1).
    logger.error({ err, method: req.method, path: req.originalUrl}, "unhandled error")
    res.status(500).json({
        error: { 
            code: "INTERNAL_ERROR", 
            message: "An unexpected error occurred",
        },
    });
}
