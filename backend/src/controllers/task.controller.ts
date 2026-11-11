import type { Request, Response } from "express";
import { taskService } from "../services/task.service.js";
import { toTaskResponse } from "../mappers/task.mapper.js";

export const taskController = {
    /**
     * Reads the validated ID from `res.locals.params`, retrieves the task,
     * and sends its API response with a 200 status code.
     */
    async getById(_req: Request, res: Response) {
        const task = await taskService.getTaskById(res.locals.params.id);
        res.status(200).json(toTaskResponse(task));
    },

    /**
     * Reads `req.body`, which `validateRequest` already replaced with parsed data,
     * calls one `createTask` service method, and send 201 status code in the response
     * to the client.
     * 
     * If rejected, Express forwards the error to `errorHandler`.
     */
    async create(req: Request, res: Response) {
        const task = await taskService.createTask(req.body);
        res.status(201).json(toTaskResponse(task));
    },
}
