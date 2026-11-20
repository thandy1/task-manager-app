import type { Request, Response } from "express";
import { taskService } from "../services/task.service.js";
import { toTaskResponse } from "../mappers/task.mapper.js";

export const taskController = {
    /**
     * Uses the validated task ID to complete a deletion and return the API's
     * empty success response.
     */
    async delete(_req: Request, res: Response) {
        await taskService.deleteTask(res.locals.params.id);
        res.status(204).send();
    },

    /**
     * Clears the task collection and returns an empty success response,
     * including when the collection was already empty.
     */
    async deleteAll(_req: Request, res: Response) {
        await taskService.clearAllTasks();
        res.status(204).send();
    },

    /**
     * Serializes every task through the shared response mapper so date-only
     * fields keep the same API shape as the single-task endpoint.
     */
    async getAll(_req: Request, res: Response) {
        const tasks = await taskService.getAllTasks();
        res.status(200).json(tasks.map(toTaskResponse));
    },

        /**
     * Reads the validated id from `res.locals.params` and the validated
     * partial body from `req.body`, then sends the updated task with a 
     * 200 status.
     */
    async update(req: Request, res: Response) {
        const task = await taskService.updateTask(res.locals.params.id, req.body);
        res.status(200).json(toTaskResponse(task));
    },

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
     * calls `createTask` service method, and sends 201 status code in the response
     * to the client.
     * 
     * If rejected, Express forwards the error to `errorHandler`.
     */
    async create(req: Request, res: Response) {
        const task = await taskService.createTask(req.body);
        res.status(201).json(toTaskResponse(task));
    },
}
