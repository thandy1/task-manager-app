import { Prisma } from "../generated/prisma/client.js";

/**
 * Determines whether an error is a Prisma record-not-found error (P2025).
 *
 * Used to identify failed update or delete operations where the target
 * record does not exist, allowing services to translate the Prisma error
 * into an application-level NotFoundError.
 *
 * @param err - The error to inspect.
 * @returns `true` if the error is a Prisma P2025 error; otherwise, `false`.
 */
export function isRecordNotFound(err: unknown): boolean {
    return err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025";
}