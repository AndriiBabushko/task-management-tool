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
exports.deleteTaskByID = exports.updateTaskByID = exports.createTask = exports.getTasks = exports.getTasksByCreatorId = exports.getTaskById = void 0;
var validator_1 = require("validator");
var mongoose_1 = require("mongoose");
var http_error_model_1 = require("../models/http-error-model");
var task_model_1 = require("../models/task-model");
var user_model_1 = require("../models/user-model");
var getTaskById = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var taskID, task, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                taskID = req.params.taskID;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, task_model_1.mongooseModel.findById(taskID)];
            case 2:
                task = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                return [2 /*return*/, next(new http_error_model_1.default("Something went wrong while searching for some task by task ID.", 500))];
            case 4:
                if (!task) {
                    return [2 /*return*/, next(new http_error_model_1.default("Couldn't find a task for the provided task ID!", 404))];
                }
                return [2 /*return*/, res.json({ task: task.toObject({ getters: true }), success: true })];
        }
    });
}); };
exports.getTaskById = getTaskById;
var getTasksByCreatorId = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var creatorID, tasks, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                creatorID = req.params.creatorID;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, task_model_1.mongooseModel.find({ creator: creatorID })];
            case 2:
                tasks = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                return [2 /*return*/, next(new http_error_model_1.default("Something went wrong while searching for some tasks by creator ID.", 500))];
            case 4:
                if (!tasks || tasks.length == 0) {
                    return [2 /*return*/, next(new http_error_model_1.default("Couldn't find tasks for the provided user ID!", 422))];
                }
                return [2 /*return*/, res.json({
                        tasks: tasks.map(function (t) { return t.toObject({ getters: true }); }),
                        success: true,
                    })];
        }
    });
}); };
exports.getTasksByCreatorId = getTasksByCreatorId;
var getTasks = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var tasks, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, task_model_1.mongooseModel.find()];
            case 1:
                tasks = _a.sent();
                return [3 /*break*/, 3];
            case 2:
                e_2 = _a.sent();
                return [2 /*return*/, next(new http_error_model_1.default("Something went wrong while fetching tasks data from DB.", 500))];
            case 3: return [2 /*return*/, res.json({
                    tasks: tasks.map(function (t) { return t.toObject({ getters: true }); }),
                    success: true,
                })];
        }
    });
}); };
exports.getTasks = getTasks;
var createTask = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, description, deadlineDate, tags, userId, createdTask, user, e_3, session, e_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, title = _a.title, description = _a.description, deadlineDate = _a.deadlineDate, tags = _a.tags;
                userId = req.userData.userId;
                try {
                    if (validator_1.default.isEmpty(title))
                        return [2 /*return*/, next(new http_error_model_1.default("Task title is empty!", 422))];
                    if (validator_1.default.isEmpty(description))
                        return [2 /*return*/, next(new http_error_model_1.default("Task description is empty!", 422))];
                    if (!validator_1.default.isDate(deadlineDate) ||
                        validator_1.default.isEmpty(deadlineDate) ||
                        new Date(deadlineDate).getTime() <= new Date().getTime())
                        return [2 /*return*/, next(new http_error_model_1.default("Task deadline date is invalid!", 422))];
                }
                catch (e) {
                    return [2 /*return*/, next(new http_error_model_1.default("Something went wrong while checking task data.", 500))];
                }
                createdTask = new task_model_1.mongooseModel({
                    title: title,
                    description: description,
                    creationDate: new Date(),
                    deadlineDate: new Date(deadlineDate),
                    creator: userId,
                    tags: tags,
                });
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, user_model_1.mongooseModel.findById(userId)];
            case 2:
                user = _b.sent();
                return [3 /*break*/, 4];
            case 3:
                e_3 = _b.sent();
                return [2 /*return*/, next(new http_error_model_1.default("Couldn't find user for provided id! Please, check credentials.", 500))];
            case 4:
                if (!user)
                    return [2 /*return*/, next(new http_error_model_1.default("Couldn't find user for provided id.", 404))];
                _b.label = 5;
            case 5:
                _b.trys.push([5, 10, , 11]);
                return [4 /*yield*/, (0, mongoose_1.startSession)()];
            case 6:
                session = _b.sent();
                session.startTransaction();
                return [4 /*yield*/, createdTask.save({ session: session })];
            case 7:
                _b.sent();
                user.tasks.push(createdTask);
                return [4 /*yield*/, user.save({ session: session })];
            case 8:
                _b.sent();
                return [4 /*yield*/, session.commitTransaction()];
            case 9:
                _b.sent();
                return [3 /*break*/, 11];
            case 10:
                e_4 = _b.sent();
                return [2 /*return*/, next(new http_error_model_1.default("Creating task failed. Pls check credentials and try again.", 500))];
            case 11: return [2 /*return*/, res
                    .status(201)
                    .json({ task: createdTask.toObject({ getters: true }), success: true })];
        }
    });
}); };
exports.createTask = createTask;
var updateTaskByID = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, description, task, taskID, userId, e_5, e_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, title = _a.title, description = _a.description;
                taskID = req.params.taskID;
                userId = req.userData.userId;
                if (validator_1.default.isEmpty(title))
                    return [2 /*return*/, next(new http_error_model_1.default("Task title is empty!", 422))];
                if (validator_1.default.isEmpty(description))
                    return [2 /*return*/, next(new http_error_model_1.default("Task description is empty!", 422))];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, task_model_1.mongooseModel.findById(taskID).populate("creator")];
            case 2:
                task = _b.sent();
                return [3 /*break*/, 4];
            case 3:
                e_5 = _b.sent();
                return [2 /*return*/, next(new http_error_model_1.default("Something went wrong while searching for some task by task ID.", 500))];
            case 4:
                if (!task) {
                    return [2 /*return*/, next(new http_error_model_1.default("Couldn't find a task for the provided task ID!", 404))];
                }
                if (task.creator._id != userId) {
                    return [2 /*return*/, next(new http_error_model_1.default("No access to change task. Different user and creator id's.", 404))];
                }
                task.title = title;
                task.description = description;
                _b.label = 5;
            case 5:
                _b.trys.push([5, 7, , 8]);
                return [4 /*yield*/, task.save()];
            case 6:
                _b.sent();
                return [3 /*break*/, 8];
            case 7:
                e_6 = _b.sent();
                return [2 /*return*/, next(new http_error_model_1.default("Something went wrong while updating task.", 500))];
            case 8: return [2 /*return*/, res
                    .status(200)
                    .json({ task: task.toObject({ getters: true }), success: true })];
        }
    });
}); };
exports.updateTaskByID = updateTaskByID;
var deleteTaskByID = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var task, taskID, userId, e_7, session, e_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                taskID = req.params.taskID;
                userId = req.userData.userId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, task_model_1.mongooseModel.findById(taskID).populate("creator")];
            case 2:
                task = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_7 = _a.sent();
                return [2 /*return*/, next(new http_error_model_1.default("Something went wrong while searching for some task by task ID.", 500))];
            case 4:
                if (!task) {
                    return [2 /*return*/, next(new http_error_model_1.default("Couldn't find a task for the provided task ID!", 404))];
                }
                if (task.creator._id != userId) {
                    return [2 /*return*/, next(new http_error_model_1.default("No access to delete task. Different user and creator id's.", 404))];
                }
                _a.label = 5;
            case 5:
                _a.trys.push([5, 10, , 11]);
                return [4 /*yield*/, (0, mongoose_1.startSession)()];
            case 6:
                session = _a.sent();
                session.startTransaction();
                return [4 /*yield*/, task.deleteOne({ session: session })];
            case 7:
                _a.sent();
                task.creator.tasks.pull(task);
                return [4 /*yield*/, task.creator.save({ session: session })];
            case 8:
                _a.sent();
                return [4 /*yield*/, session.commitTransaction()];
            case 9:
                _a.sent();
                return [3 /*break*/, 11];
            case 10:
                e_8 = _a.sent();
                return [2 /*return*/, next(new http_error_model_1.default("Something went wrong while deleting task.", 500))];
            case 11: return [2 /*return*/, res.status(200).json({
                    message: "Successful deleted task with ".concat(taskID, " ID."),
                    success: true,
                })];
        }
    });
}); };
exports.deleteTaskByID = deleteTaskByID;
