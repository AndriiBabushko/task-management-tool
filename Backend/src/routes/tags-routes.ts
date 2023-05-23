import {Router} from "express";

import * as tagsController from "../controllers/tags-controller.js";
import { checkJWT as checkAuth} from "../middlewares/auth-middleware.js";

const router: Router = Router();

router.get("/", tagsController.getTags);

router.get("/:tagID", tagsController.getTagById);

router.use(checkAuth);

router.post("/", tagsController.createTag);

router.patch("/:tagID", tagsController.updateTagById);

router.delete("/:tagID", tagsController.deleteTagById);

export {router};