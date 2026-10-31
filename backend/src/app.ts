import express from "express";

export const app = express();

// Built-in middleware that parses incoming JSON request bodies
// into req.body
app.use(express.json());

// Temporary route just to confirm everything works.
app.get("/health", (_req, res) => {
    res.json({status: "ok"});
});