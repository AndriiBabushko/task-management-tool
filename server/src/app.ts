import express, { Express, NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { config as dotenvConfig } from 'dotenv-flow';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import HttpError from './exceptions/http-error.js';
import { router as tasksRouter } from './routes/tasks-routes.js';
import { router as usersRouter } from './routes/users-routes.js';
import { router as tagsRouter } from './routes/tags-routes.js';
import { router as groupsRouter } from './routes/groups-routes.js';
import { router as categoriesRouter } from './routes/categories-routes.js';
import { router as rolesRouter } from './routes/roles-routes.js';
import { router as otherRouter } from './routes/other-routes.js';
import { ErrorMiddleware } from './middlewares/error-middleware.js';
import RoleService from './services/role-service.js';

dotenvConfig();
const mongoURL: string | undefined = process.env.DB_HOST;
const port: string | undefined = process.env.PORT;
const corsOrigin = process.env.CLIENT_URL;

const app: Express = express();
mongoose
  .connect(mongoURL)
  .then(async () => {
    console.log('DB is connected!');
    try {
      await RoleService.createRolesIfNotExist();
    } catch (e) {
      throw e;
    }
  })
  .catch((error) => console.log(error));

const corsMiddleware = cors({
  origin: [corsOrigin, 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  credentials: true,
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', corsOrigin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
  res.setHeader('Content-Type', 'application/json');

  next();
});
app.use(corsMiddleware);
app.use(bodyParser.json({ limit: '10MB' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/uploads', express.static(path.join(dirname(fileURLToPath(import.meta.url)), 'uploads')));

app.use('/api/users', usersRouter);

app.use('/api/tasks', tasksRouter);

app.use('/api/tags', tagsRouter);

app.use('/api/categories', categoriesRouter);

app.use('/api/groups', groupsRouter);

app.use('/api/roles', rolesRouter);

app.use('/api/other', otherRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  return next(new HttpError("Couldn't find this route.", 404));
});

app.use(ErrorMiddleware);

app.listen(port, () => {
  console.log('Server is running on port: ' + port);
});

export { app };
