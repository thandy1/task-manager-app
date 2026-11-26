// Builds the Express app: middleware, routes, and error handling
import express from "express";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { taskRouter } from "./routes/task.routes.js";
import { requestMetrics } from "./middleware/requestMetrics.js";

export const app = express();

// Request metrics middleware that starts a timer on each request and calculates the
// duration of its lifecycle once it returns a response.
app.use(requestMetrics);

// Parses JSON request bodies into req.body.
// Malformed JSON is passed on to the error handler.
app.use(express.json());

// Health check stays unversioned: it's infrastructure, not part of the API contract.
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

// All task endpoints live under /api/v1/tasks.
app.use("/api/v1/tasks", taskRouter);

// Order matters: these must be last. Unmatched URLs hit notFoundHandler,
// and any error thrown above ends up in errorHandler.
app.use(notFoundHandler);
app.use(errorHandler);