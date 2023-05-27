import { Router } from 'express';

import * as tagsController from '../controllers/tags-controller.js';
import { AuthMiddleware } from '../middlewares/auth-middleware.js';
import { body, ValidationChain } from 'express-validator';

const router: Router = Router();
const tagHandlers: ValidationChain[] = [body('name').optional().isLength({ min: 3, max: 18 })];

router.get('/', AuthMiddleware, tagsController.getTags);

router.get('/:tagID', tagsController.getTagById);

router.post('/', tagHandlers, AuthMiddleware, tagsController.createTag);

router.patch('/:tagID', tagHandlers, AuthMiddleware, tagsController.updateTagById);

router.delete('/:tagID', AuthMiddleware, tagsController.deleteTagById);

export { router };
