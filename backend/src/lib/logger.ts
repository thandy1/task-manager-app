import { pino } from "pino";

// One shared logger. Silent during tests so Vitest output stays readable.
export const logger = pino({
    level: process.env.NODE_ENV === "test" ? "silent" : "info",
});