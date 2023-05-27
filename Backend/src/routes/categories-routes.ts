import { Router } from 'express';

import * as categoriesController from '../controllers/categories-controller.js';
import { AuthMiddleware } from '../middlewares/auth-middleware.js';
import { body, ValidationChain } from 'express-validator';

const router: Router = Router();
const tagHandlers: ValidationChain[] = [body('name').optional().isLength({ min: 3, max: 25 })];

router.get('/', AuthMiddleware, categoriesController.getCategories);

router.get('/:categoryID', categoriesController.getCategoryById);

router.post('/', tagHandlers, AuthMiddleware, categoriesController.createCategory);

router.patch('/:categoryID', tagHandlers, AuthMiddleware, categoriesController.updateCategoryById);

router.delete('/:categoryID', AuthMiddleware, categoriesController.deleteCategoryById);

export { router };
