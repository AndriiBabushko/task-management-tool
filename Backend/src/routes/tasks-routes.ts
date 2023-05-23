import {Router} from "express";

import * as tasksControllers from "../controllers/tasks-controller.js";
import { checkJWT as checkAuth } from "../middlewares/auth-middleware.js"

const router: Router = Router();

router.get("/", tasksControllers.getTasks);

router.get("/:taskID", tasksControllers.getTaskById);

router.get("/user/:creatorID", tasksControllers.getTasksByCreatorId);

router.use(checkAuth);

router.post("/", tasksControllers.createTask);

router.patch("/:taskID", tasksControllers.updateTaskByID);

router.delete("/:taskID", tasksControllers.deleteTaskByID);

export { router };
