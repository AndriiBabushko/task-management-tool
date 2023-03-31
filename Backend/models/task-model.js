"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongooseModel = void 0;
var mongoose_1 = require("mongoose");
var taskSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    creationDate: { type: Date, required: true },
    deadlineDate: { type: Date, required: false },
    creator: { type: mongoose_1.Types.ObjectId, required: true, ref: "User" },
    tags: [{ type: String, required: false }],
});
var mongooseModel = (0, mongoose_1.model)("Task", taskSchema);
exports.mongooseModel = mongooseModel;
