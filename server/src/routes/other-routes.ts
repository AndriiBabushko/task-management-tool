import { Router } from 'express';

import * as otherController from '../controllers/other-controller.js';
import { AuthMiddleware } from '../middlewares/auth-middleware.js';
import { RoleMiddleware } from '../middlewares/role-middleware.js';

const router: Router = Router();

router.get('/backup/', AuthMiddleware, RoleMiddleware, otherController.backup);

router.get('/restore/', AuthMiddleware, RoleMiddleware, otherController.restore);

export { router };
