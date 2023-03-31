import {Router} from "express";

import * as tasksControllers from "../controllers/tasks-controller";
import { checkJWT as checkAuth } from "../middleware/check-auth"

const router: Router = Router();

router.get("/all", tasksControllers.getTasks);

router.get("/:taskID", tasksControllers.getTaskById);

router.get("/user/:creatorID", tasksControllers.getTasksByCreatorId);

router.use(checkAuth);

router.post("/", tasksControllers.createTask);

router.patch("/:taskID", tasksControllers.updateTaskByID);

router.delete("/:taskID", tasksControllers.deleteTaskByID);

module.exports = router;
