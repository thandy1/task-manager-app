// Predictable structure for validation details.
export interface ValidationDetail {
    field: string;
    message: string;
}

// Base class for every error we throw on purpose. It carries the HTTP
// status and a machine-readable code, so the error middleware can build
// the NFR1 response without guessing.
//   `{ "error": { "code": string, "message": string, "details"?: [...] } }`
export class AppError extends Error {
    constructor(
        public readonly statusCode: number,
        public readonly code: string,
        message: string,
        public readonly details?: ValidationDetail[],
    ) {
        super(message);
        this.name = "AppError";
    }
}


// 404: resource the client asked for doesn't exist.
export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(404, "NOT_FOUND", message);
    }
}

// 400: the request data is invalid. `details` will hold the per-field problems.
export class ValidateError extends AppError {
    constructor(
        message = "Validation failed", 
        details?: ValidationDetail[],
    ) {
        super(400, "VALIDATION_ERROR", message, details);
    }
}