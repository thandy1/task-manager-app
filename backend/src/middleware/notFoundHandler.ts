import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../errors/AppError.js";

// Regular Middleware, first parameter must be a Request object so express can recognize it.
// Runs when no route matched. It doesn't respond itself; it creates a
// NotFoundError and passes it to the error middleware via next(error).
export function notFoundHandler(
    req: Request, 
    _res: Response, 
    next: NextFunction
) {
    next(new NotFoundError(`Route ${req.method} ${req.path} not found`));
}