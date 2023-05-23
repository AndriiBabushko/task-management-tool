import {Router} from "express";

import * as categoriesController from "../controllers/categories-controller.js";
import { checkJWT as checkAuth} from "../middlewares/auth-middleware.js";

const router: Router = Router();

router.get("/", categoriesController.getCategories);

router.get("/:categoryID", categoriesController.getCategoryById);

router.use(checkAuth);

router.post("/", categoriesController.createCategory);

router.patch("/:categoryID", categoriesController.updateCategoryById);

router.delete("/:categoryID", categoriesController.deleteCategoryById);

export {router};