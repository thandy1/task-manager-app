import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // Where the schema file lives
  schema: "prisma/schema.prisma",
  // Where migration SQL files get written (like Flyway's db/migration)
  migrations: {
    path: "prisma/migrations",
  },
  // The DB connection string, read from .env
  datasource: {
    url: env("DATABASE_URL"),
  },
});