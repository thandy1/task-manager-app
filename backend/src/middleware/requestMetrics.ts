import type { NextFunction, Request, Response } from "express";
import { logger } from "../lib/logger.js";

/** In-memory counters. They reset on restart, which is fine for a demo. */
export const metrics = { requestTotals: 0, serverErrorsTotal: 0};

/**
 * Times every request. When the response finishes, it increments the counters
 * and writes one structured log line with the duration.
 */
export function requestMetrics(req: Request, res: Response, next: NextFunction) {
    const start = process.hrtime.bigint();

    res.on("finish", () => {
        const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
        metrics.requestTotals++;
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