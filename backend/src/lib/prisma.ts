import "dotenv/config"; // loads .env into process.env before we read DATABASE_URL
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

// The adapter holds the Postgres connection, built from DATABASE_URL in .env.
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

// One shared client instance for the whole app.
// "log" prints every SQL statement Prisma runs to the terminal.
export const prisma = new PrismaClient({
  adapter,
  log: ["query", "warn", "error"],
});