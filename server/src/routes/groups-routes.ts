import { Router } from 'express';
import { body, ValidationChain } from 'express-validator';

import * as groupsController from '../controllers/groups-controller.js';
import { AuthMiddleware } from '../middlewares/auth-middleware.js';

const router: Router = Router();
const groupHandlers: ValidationChain[] = [
  body('name').optional().isLength({ min: 3, max: 18 }),
  body('image').optional().isString(),
  body('users.*').optional().isMongoId(),
  body('access').optional().isString(),
];

router.get('/', AuthMiddleware, groupsController.getGroups);

router.get('/:groupID', groupsController.getGroupById);

router.post('/', groupHandlers, AuthMiddleware, groupsController.createGroup);

router.patch('/:groupID', groupHandlers, AuthMiddleware, groupsController.updateGroupById);

router.delete('/:groupID', AuthMiddleware, groupsController.deleteGroupById);

export { router };
