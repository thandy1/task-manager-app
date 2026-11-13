import { Router } from "express";
import { validateRequest } from "../middleware/validateRequest.js";
import { createTaskSchema, taskIdParamSchema } from "../schemas/task.schema.js";
import { taskController } from "../controllers/task.controller.js";
import { features } from "../configs/features.js";

export const taskRouter = Router();

taskRouter.post("/", validateRequest(createTaskSchema, "body"), taskController.create);
taskRouter.get("/:id", validateRequest(taskIdParamSchema, "params"), taskController.getById);
