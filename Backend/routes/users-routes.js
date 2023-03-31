"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var userController = require("../controllers/users-controller");
var router = (0, express_1.Router)();
router.get("/", userController.getAllUsers);
router.post("/login", userController.login);
router.post("/signup", userController.signup);
module.exports = router;
