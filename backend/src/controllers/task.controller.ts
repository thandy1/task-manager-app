import type { Request, Response } from "express";
import { taskService } from "../services/task.service.js";

export const taskController = {
    /**
     * Reads `req.body`, which `validateRequest` already replaced with parsed data,
     * calls one `createTask` service method, and send 201 status code in the response
     * to the client.
     * 
     * If rejected, Express forwards the error to `errorHandler`.
     */
    async create(req: Request, res: Response) {
        const task = await taskService.createTask(req.body);
        res.status(201).json(task);
    },
}