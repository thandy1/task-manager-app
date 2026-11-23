import type { NextFunction, Request, Response } from "express";
import { logger } from "../lib/logger.js";

/** In-memory counters. They reset on restart, which is fine for a demo. */
export const metrics = { requestsTotal: 0, serverErrorsTotal: 0};

/**
 * Times every request. When the response finishes, it increments the counters
 * and writes one structured log line with the duration.
 */
export function requestMetrics(req: Request, res: Response, next: NextFunction) {
    // Retrieve a starting high resolution timestamp in nanoseconds (e.g., 1,000,000,000 ns)
    const start = process.hrtime.bigint(); 

    // Event listener, listening for the response to finish.
    res.on("finish", () => {
        // Calculate elapsed time
        const durationMs = Number(process.hrtime.bigint() - start) / 1e6;

        // Increment metrics counters
        metrics.requestsTotal++;
        if (res.statusCode >= 500) metrics.serverErrorsTotal++;

        // Produces a one line log for each request.
        logger.info({ 
            method: req.method, 
            path: req.originalUrl, 
            status: res.statusCode, 
            durationMs
        }, "request completed",);
    });

    next();
}