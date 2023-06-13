import { Router } from 'express';

import * as tasksControllers from '../controllers/tasks-controller.js';
import { AuthMiddleware } from '../middlewares/auth-middleware.js';
import { body, ValidationChain } from 'express-validator';
import multer from 'multer';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const router: Router = Router();
const storage = multer.diskStorage({
  destination: path.join(dirname(dirname(dirname(fileURLToPath(import.meta.url)))), 'uploads/task'),
  filename: (req, file, callback) => {
    console.log(file);
    callback(null, file.fieldname + Date.now() + '.' + file.mimetype.split('/')[1]);
  },
});
const upload = multer({ storage });

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

router.post('/', taskHandlers, AuthMiddleware, upload.single('image'), tasksControllers.createTask);

router.patch('/:taskID', taskHandlers, AuthMiddleware, upload.single('image'), tasksControllers.updateTaskByID);

router.delete('/:taskID', AuthMiddleware, tasksControllers.deleteTaskByID);

export { router };
