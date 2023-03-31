import HttpError from "./models/http-error-model";
import * as bodyParser from "body-parser";
import * as express from "express";
import {Express, NextFunction, Request, Response} from "express";
import { connect as mongooseConnect } from "mongoose";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();
const mongoURL: string = process.env.MONGO_URL;
const port: string = process.env.PORT;
const tasksRouter = require("./routes/tasks-routes");
const usersRouter = require("./routes/users-routes");

const app: Express = express();

app.use(bodyParser.json());

app.use((req: Request, res: Response, next: NextFunction): void => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
})

app.use("/api/tasks", tasksRouter);

app.use("/api/users", usersRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  return next(new HttpError("Couldn't find this route.", 404));
});

app.use((err, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent)
    return next(err);

  res.status(err.code || 500);
  res.json({ message: err.message || "An unknown error occurred!" });
});

mongooseConnect(mongoURL)
  .then((): void => {
    app.listen(port);
  })
  .catch((error) => console.log(error));
