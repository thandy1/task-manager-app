import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
    resolve: {
        alias: {
            // resolve.alias tells Vitest where to find files when tests import
            // using an alias. Essentially maps `@src` to our backend's `src/` 
            // directory, and loads the actual file and executes the test.
            "@src": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    test: {
        include: ["tests/**/*.test.ts"],
        // NFR3 target is 80% line coverage, so we need a way to measure
        // it and show evidence. 
        // Tell Vitest which source files to measure and which to exclude.
        coverage: {
            include: ["src/**/*.ts"],
            exclude: ["src/generated/**", "src/server.ts"],
        },
    },
})