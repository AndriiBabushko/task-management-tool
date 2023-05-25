import { Router } from 'express';
import { body } from 'express-validator';

import * as userController from '../controllers/users-controller.js';
import { AuthMiddleware } from '../middlewares/auth-middleware.js';

const router: Router = Router();

router.post(
  '/signup',
  [
    body('email').normalizeEmail().isEmail(),
    body('password').isLength({ min: 3, max: 32 }),
    body('username').isLength({ min: 3, max: 18 }),
  ],
  userController.signup,
);

router.post(
  '/login',
  [body('email').normalizeEmail().isEmail(), body('password').isLength({ min: 3, max: 32 })],
  userController.login,
);

router.post('/logout', userController.logout);

router.get('/activate/:link', userController.activateLink);

router.get('/refresh', userController.refreshLink);

router.get('/', AuthMiddleware, userController.getUsers);

export { router };
