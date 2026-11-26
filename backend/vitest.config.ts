import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
// Vite uses environment file precedence (specific env files get file priority).
import { loadEnv } from "vite"; 

// Vitest configuration, it's cli discovers and loads it automatically.
export default defineConfig(({ mode }) => ({
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
        // Vitest runs mode "test", so loadEnv reads `.env.test` (and falls back
        // to `.env` for anything missing). The empty prefix "" means "load every
        // variable", not just ones starting with VITE_.
        env: loadEnv(mode, process.cwd(), ""),
        // Run test files one at a time. Integration tests share one database,
        // so parallel files would wipe each other's data.
        fileParallelism: false,
        // NFR3 target is 80% line coverage, so we need a way to measure
        // it and show evidence. 
        // Tell Vitest which source files to measure and which to exclude.
        coverage: {
            include: ["src/**/*.ts"],
            exclude: [
                "src/generated/**", 
                "src/server.ts",
                "src/configs/features.ts" // // reserved for v0.2.0 feature flags, not used in the MVP
            ],
        },
    },
}));