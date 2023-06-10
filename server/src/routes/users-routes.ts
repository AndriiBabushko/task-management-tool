import { Router } from 'express';
import { body } from 'express-validator';

import * as userController from '../controllers/users-controller.js';
import { AuthMiddleware } from '../middlewares/auth-middleware.js';
import multer from 'multer';

const router: Router = Router();
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'uploads/user');
  },
  filename: (req, file, callback) => {
    console.log(file);
    callback(null, file.fieldname);
  },
});
const upload = multer({ storage });

router.post(
  '/signup',
  [
    body('name').optional().isLength({ min: 2, max: 24 }),
    body('surname').optional().isLength({
      min: 2,
      max: 24,
    }),
    body('email').normalizeEmail().isEmail(),
    body('password').isLength({ min: 3, max: 32 }),
    body('username').isLength({ min: 3, max: 18 }),
  ],
  upload.single('image'),
  userController.signup,
);

router.post(
  '/login',
  [body('email').normalizeEmail().isEmail(), body('password').isLength({ min: 3, max: 32 })],
  userController.login,
);

router.post('/logout', AuthMiddleware, userController.logout);

router.patch(
  '/:userID',
  [
    body('name').optional().isLength({ min: 2, max: 24 }),
    body('surname').optional().isLength({
      min: 2,
      max: 24,
    }),
    body('username')
      .optional()
      .isLength({ min: 3, max: 18 })
      .custom((value) => {
        if (!/^[a-zA-Z0-9_]+$/.test(value))
          throw new Error('Username can only contain letters, numbers and underscores.');

        return true;
      }),
    body('password').optional().isLength({ min: 3, max: 32 }),
    body('image').optional().isString(),
    body('roles.*').optional().isMongoId(),
    body('groups.*').optional().isMongoId(),
  ],
  AuthMiddleware,
  upload.single('image'),
  userController.updateUser,
);

router.delete('/:userID', AuthMiddleware, userController.deleteUser);

router.get('/activate/:link', userController.activateLink);

router.get('/refresh', userController.refreshLink);

router.get('/', AuthMiddleware, userController.getUsers);

router.get('/resendMail', AuthMiddleware, userController.resendActivationMail);

router.get('/images/:imageName', userController.getImage);

export { router };
