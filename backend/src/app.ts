// Application configuration and middleware pipeline
import express from "express";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { features } from "./config/features.js";
import { taskRouter } from "./routes/task.routes.js";

export const app = express();

// This is regular middleware. It parses incoming JSON and makes the resulting JavaScript object available through req.body 
// Middleware executes before routes, malformed JSON gets passed as an error
// to the Error Handling Middleware.
app.use(express.json());

// Temporary route just to confirm everything works.
app.get("/health", (_req, res) => {
    res.json({status: "ok"});
});

// Flagged: the route s only registered when FEATURE_CREATE_TASK=true.
// When off, /tasks is never mounted, so requests fall through to notFoundHandler (404).
// NOTE: remove the feature flag when the route is tested and functional.
if (features.createTask) {
    app.use("/tasks", taskRouter);
}

// Registration order determines middleware execution order.
// Must stay last: unmatched routes first, then the error handler.
app.use(notFoundHandler);
app.use(errorHandler);