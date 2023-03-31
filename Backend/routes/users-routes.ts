import {Router} from "express";

import * as userController from "../controllers/users-controller";

const router: Router = Router();

router.get("/", userController.getAllUsers);

router.post("/login", userController.login);

router.post("/signup", userController.signup);

module.exports = router;
