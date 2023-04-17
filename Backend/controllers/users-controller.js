"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = exports.login = exports.getAllUsers = void 0;
var validator_1 = require("validator");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var http_error_model_1 = require("../models/http-error-model");
var user_model_1 = require("../models/user-model");
var getAllUsers = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var users, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, user_model_1.mongooseModel.find({}, "-password")];
            case 1:
                users = _a.sent();
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                return [2 /*return*/, next(new http_error_model_1.default("Something went wrong while fetching users data from DB.", 500))];
            case 3: return [2 /*return*/, res.json({
                    users: users.map(function (u) { return u.toObject({ getters: true }); }),
                    success: true,
                })];
        }
    });
}); };
exports.getAllUsers = getAllUsers;
var signup = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, email, password, indentifiedUser, e_2, cryptPassword, e_3, createdUser, e_4, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, username = _a.username, email = _a.email, password = _a.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, user_model_1.mongooseModel.findOne({ email: email })];
            case 2:
                indentifiedUser = _b.sent();
                return [3 /*break*/, 4];
            case 3:
                e_2 = _b.sent();
                return [2 /*return*/, next(new http_error_model_1.default("Something went wrong while singing up! Please, try again.", 500))];
            case 4:
                if (indentifiedUser) {
                    return [2 /*return*/, next(new http_error_model_1.default("User already exists! Please, login instead.", 422))];
                }
                if (!validator_1.default.normalizeEmail(email) && !validator_1.default.isEmail(email))
                    return [2 /*return*/, next(new http_error_model_1.default("Email seem to be wrong.", 422))];
                if (!validator_1.default.isLength(username, { min: 2 }))
                    return [2 /*return*/, next(new http_error_model_1.default("Username has less than 2 symbols.", 422))];
                if (validator_1.default.isEmpty(password))
                    return [2 /*return*/, next(new http_error_model_1.default("Password is empty.", 422))];
                _b.label = 5;
            case 5:
                _b.trys.push([5, 7, , 8]);
                return [4 /*yield*/, bcrypt.hash(password, 12)];
            case 6:
                cryptPassword = _b.sent();
                return [3 /*break*/, 8];
            case 7:
                e_3 = _b.sent();
                return [2 /*return*/, next(new http_error_model_1.default("Couldn't hash password. Please try again.", 500))];
            case 8:
                createdUser = new user_model_1.mongooseModel({
                    username: username,
                    email: email,
                    image: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
                    password: cryptPassword,
                });
                _b.label = 9;
            case 9:
                _b.trys.push([9, 11, , 12]);
                return [4 /*yield*/, createdUser.save()];
            case 10:
                _b.sent();
                return [3 /*break*/, 12];
            case 11:
                e_4 = _b.sent();
                return [2 /*return*/, next(new http_error_model_1.default("Signing up failed. Please check credentials and try again.", 500))];
            case 12:
                try {
                    token = jwt.sign({ userId: createdUser.id, email: createdUser.email }, "task_management_tool_token", { expiresIn: "1h" });
                }
                catch (e) {
                    return [2 /*return*/, next(new http_error_model_1.default("Signing up failed! Please try again.", 500))];
                }
                return [2 /*return*/, res.status(201).json({
                        userId: createdUser.id,
                        email: createdUser.email,
                        token: token,
                        message: "Successfully signed up!",
                        success: true,
                    })];
        }
    });
}); };
exports.signup = signup;
var login = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, indentifiedUser, e_5, isValidPassword, e_6, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                if (!validator_1.default.normalizeEmail(email) && !validator_1.default.isEmail(email))
                    return [2 /*return*/, next(new http_error_model_1.default("Entered email seem to be wrong.", 422))];
                if (validator_1.default.isEmpty(password))
                    return [2 /*return*/, next(new http_error_model_1.default("Password is empty.", 422))];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, user_model_1.mongooseModel.findOne({ email: email })];
            case 2:
                indentifiedUser = _b.sent();
                return [3 /*break*/, 4];
            case 3:
                e_5 = _b.sent();
                return [2 /*return*/, next(new http_error_model_1.default("Something went wrong while logging up! Please, try again.", 500))];
            case 4:
                if (!indentifiedUser) {
                    return [2 /*return*/, next(new http_error_model_1.default("Can't find such user! Please, check your credentials.", 401))];
                }
                isValidPassword = false;
                _b.label = 5;
            case 5:
                _b.trys.push([5, 7, , 8]);
                return [4 /*yield*/, bcrypt.compare(password, indentifiedUser.password)];
            case 6:
                isValidPassword = _b.sent();
                return [3 /*break*/, 8];
            case 7:
                e_6 = _b.sent();
                return [2 /*return*/, next(new http_error_model_1.default("Couldn't log you in! Please, check your credentials and try again.", 500))];
            case 8:
                if (!isValidPassword) {
                    return [2 /*return*/, next(new http_error_model_1.default("Password is incorrect! Please, try again.", 401))];
                }
                try {
                    token = jwt.sign({ userId: indentifiedUser.id, email: indentifiedUser.email }, "task_management_tool_token", { expiresIn: "1h" });
                }
                catch (e) {
                    return [2 /*return*/, next(new http_error_model_1.default("Logging in failed! Please try again.", 500))];
                }
                return [2 /*return*/, res.json({
                        userId: indentifiedUser.id,
                        email: indentifiedUser.email,
                        token: token,
                        message: "Successfully logged in!",
                        success: true,
                    })];
        }
    });
}); };
exports.login = login;
