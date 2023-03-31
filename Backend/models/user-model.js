"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongooseModel = void 0;
var mongoose_1 = require("mongoose");
var userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true, minLength: 2 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
    image: { type: String, required: true },
    tasks: [{ type: mongoose_1.Types.ObjectId, required: true, ref: "Task" }],
});
var mongooseModel = (0, mongoose_1.model)("User", userSchema);
exports.mongooseModel = mongooseModel;
