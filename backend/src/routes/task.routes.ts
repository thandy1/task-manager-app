import { Router } from "express";
import { validateRequest } from "../middleware/validateRequest.js";
import { createTaskSchema } from "../schemas/task.schema.js";
import { taskController } from "../controllers/task.controller.js";

export const taskRouter = Router();

taskRouter.post("/", validateRequest(createTaskSchema, "body"), taskController.create);