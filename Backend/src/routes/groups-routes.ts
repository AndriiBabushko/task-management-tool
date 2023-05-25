import { Router } from 'express';

import * as groupsController from '../controllers/groups-controller.js';
import { AuthMiddleware as checkAuth } from '../middlewares/auth-middleware.js';

const router: Router = Router();

router.get('/', groupsController.getGroups);

router.get('/:roleID', groupsController.getGroupById);

router.use(checkAuth);

router.post('/', groupsController.createGroup);

router.patch('/:roleID', groupsController.updateGroupById);

router.delete('/:roleID', groupsController.deleteGroupById);

export { router };
