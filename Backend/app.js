"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser");
var express = require("express");
var mongoose_1 = require("mongoose");
var dotenv_1 = require("dotenv");
var http_error_model_1 = require("./models/http-error-model");
var tasks_routes_1 = require("./routes/tasks-routes");
var users_routes_1 = require("./routes/users-routes");
(0, dotenv_1.config)();
var mongoURL = process.env.MONGO_URL;
var port = process.env.PORT;
var app = express();
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});
app.use("/api/tasks", tasks_routes_1.router);
app.use("/api/users", users_routes_1.router);
app.use(function (req, res, next) {
    return next(new http_error_model_1.default("Couldn't find this route.", 404));
});
app.use(function (err, req, res, next) {
    if (res.headersSent)
        return next(err);
    res.status(err.code || 500);
    res.json({ message: err.message || "An unknown error occurred!" });
});
(0, mongoose_1.connect)(mongoURL)
    .then(function () {
    app.listen(port);
})
    .catch(function (error) { return console.log(error); });
