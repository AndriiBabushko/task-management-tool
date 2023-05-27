import { Router } from 'express';

import * as tasksControllers from '../controllers/tasks-controller.js';
import { AuthMiddleware } from '../middlewares/auth-middleware.js';
import { body, ValidationChain } from 'express-validator';

const router: Router = Router();
const taskHandlers: ValidationChain[] = [
  body('title').optional().isLength({ min: 3, max: 30 }),
  body('deadlineDate').optional().isDate(),
  body('tags.*').optional().isMongoId(),
  body('categories.*').optional().isMongoId(),
  body('access').optional().isString(),
];

router.get('/:taskID', tasksControllers.getTaskById);

router.get('/user/:creatorID', tasksControllers.getTasksByCreatorId);

router.get('/', AuthMiddleware, tasksControllers.getTasks);

router.post('/', taskHandlers, AuthMiddleware, tasksControllers.createTask);

router.patch('/:taskID', taskHandlers, AuthMiddleware, tasksControllers.updateTaskByID);

router.delete('/:taskID', AuthMiddleware, tasksControllers.deleteTaskByID);

export { router };
