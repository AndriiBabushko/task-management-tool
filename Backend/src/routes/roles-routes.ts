import { Router } from 'express';

import * as rolesController from '../controllers/roles-controller.js';
import { AuthMiddleware } from '../middlewares/auth-middleware.js';
import { body, ValidationChain } from 'express-validator';

const router: Router = Router();
const roleHandlers: ValidationChain[] = [body('name').optional().isLength({ min: 3, max: 18 })];

router.get('/', AuthMiddleware, rolesController.getRoles);

router.get('/:roleID', rolesController.getRoleById);

router.post('/', roleHandlers, AuthMiddleware, rolesController.createRole);

router.patch('/:roleID', roleHandlers, AuthMiddleware, rolesController.updateRoleById);

router.delete('/:roleID', AuthMiddleware, rolesController.deleteRoleById);

export { router };
