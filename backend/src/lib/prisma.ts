import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

// `process.env` is Node.js's environment variable object. It doesn't matter where variables 
// come or load from. It just reads `.env`.

// The adapter holds the Postgres connection, built from DATABASE_URL in .env.
// PrismaPg is the PostgreSQL adapter, it takes the connection string given and establishes the 
// connection between Prisma and PostgreSQL.
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

// One shared client instance for the whole app. Thin Prisma Wrapper.
// `log` property prints output to the console depending on the given option.
export const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV !== "test" 
    ? ["query", "warn", "error"]
    : ["warn", "error"],
});