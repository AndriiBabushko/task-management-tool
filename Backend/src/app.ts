import express, { Express, NextFunction, Request, Response } from 'express';
import { connect as mongooseConnect } from 'mongoose';
import { config as dotenvConfig } from 'dotenv-flow';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import HttpError from './exceptions/http-error.js';
import { router as tasksRouter } from './routes/tasks-routes.js';
import { router as usersRouter } from './routes/users-routes.js';
import { router as tagsRouter } from './routes/tags-routes.js';
import { router as groupsRouter } from './routes/groups-routes.js';
import { router as categoriesRouter } from './routes/categories-routes.js';
import { router as rolesRouter } from './routes/roles-routes.js';
import { ErrorMiddleware } from './middlewares/error-middleware.js';
import bodyParser from 'body-parser';

dotenvConfig();
const mongoURL: string | undefined = process.env.DB_HOST;
const port: string | undefined = process.env.PORT;

const app: Express = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use((req: Request, res: Response, next: NextFunction): void => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.use('/api/tasks', tasksRouter);

app.use('/api/users', usersRouter);

app.use('/api/tags', tagsRouter);

app.use('/api/categories', categoriesRouter);

app.use('/api/groups', groupsRouter);

app.use('/api/roles', rolesRouter);

app.use(ErrorMiddleware);

app.use((req: Request, res: Response, next: NextFunction) => {
  return next(new HttpError("Couldn't find this route.", 404));
});

mongooseConnect(mongoURL)
  .then(() => {
    console.log('DB is connected!');
  })
  .catch((error) => console.log(error));

app.listen(port, () => {
  console.log('Server is running on port: ' + port);
});

export { app };
