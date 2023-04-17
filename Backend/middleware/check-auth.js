"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkJWT = void 0;
var jwt = require("jsonwebtoken");
var http_error_model_1 = require("../models/http-error-model");
var checkJWT = function (req, res, next) {
    var token;
    var userId;
    try {
        token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
        if (!token)
            return next(new http_error_model_1.default("Authentication failed!", 401));
        userId = jwt.verify(token, "task_management_tool_token");
        req.userData = userId;
        req.token = token;
    }
    catch (e) {
        console.log(e.message);
        return next(new http_error_model_1.default("Authentication failed!", 401));
    }
    next();
};
exports.checkJWT = checkJWT;
