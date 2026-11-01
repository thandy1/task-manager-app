import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // Where the schema file lives.
  // Prisma generates client methods based on file.
  schema: "prisma/schema.prisma",
  // Where migration SQL files get written. 
  // Prisma reads the schema to determine database changes.
  migrations: {
    path: "prisma/migrations",
  },
  // The DB connection string, read from .env.
  // Tells Prisma which PostgreSQL database to connect to.
  datasource: {
    url: env("DATABASE_URL"),
  },
});