// Application configuration and middleware pipeline
import express from "express";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";

export const app = express();

// This is regular middleware. It parses incoming JSON and makes the resulting JavaScript object available through req.body 
// Middleware executes before routes, malformed JSON gets passed as an error
// to the Error Handling Middleware.
app.use(express.json());

// Temporary route just to confirm everything works.
app.get("/health", (_req, res) => {
    res.json({status: "ok"});
});

// Registration order determines middleware execution order.
// Must stay last: unmatched routes first, then the error handler.
app.use(notFoundHandler);
app.use(errorHandler);