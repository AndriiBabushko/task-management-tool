import { Router } from 'express';

import * as rolesController from '../controllers/roles-controller.js';
import { AuthMiddleware as checkAuth } from '../middlewares/auth-middleware.js';

const router: Router = Router();

router.get('/', rolesController.getRoles);

router.get('/:roleID', rolesController.getRoleById);

router.use(checkAuth);

router.post('/', rolesController.createRole);

router.patch('/:roleID', rolesController.updateRoleById);

router.delete('/:roleID', rolesController.deleteRoleById);

export { router };
