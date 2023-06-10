import { NextFunction, Request, Response } from 'express';
import { spawn } from 'child_process';
import path, { dirname } from 'path';
import cron from 'node-cron';
import { fileURLToPath } from 'url';

import HttpError from '../exceptions/http-error.js';

const DB_NAME: string | undefined = process.env.DB_NAME || 'task-management-tool';
const ARCHIVE_PATH = path.join(dirname(dirname(dirname(fileURLToPath(import.meta.url)))), 'public', `${DB_NAME}.gzip`);

const backupMongoDB = (): Promise<{ message: string; status: number }> => {
  return new Promise((resolve, reject) => {
    const child = spawn('mongodump', [`--db=${DB_NAME}`, `--archive=${ARCHIVE_PATH}`, '--gzip']);

    child.stdout.on('data', (data) => {
      console.log('stdout:\n' + data);
    });

    child.stderr.on('data', (data) => {
      console.log('stderr:\n' + data);
    });

    child.on('error', (err) => {
      console.log('err:\n' + err);
      reject(new HttpError('Something went wrong while backing up DB.', 500));
    });

    child.on('exit', (code, signal) => {
      if (code) {
        reject(new HttpError(`Process exit with code: ${code}`, 500));
      } else if (signal) {
        reject(new HttpError(`Process killed with signal: ${signal}`, 500));
      } else {
        resolve({ message: 'DB backing up is successful <3', status: 200 });
      }
    });
  });
};

const restoreMongoDB = (): Promise<{ message: string; status: number }> => {
  return new Promise((resolve, reject) => {
    const child = spawn('mongorestore', [`--db=${DB_NAME}`, `--archive=${ARCHIVE_PATH}`, '--gzip']);

    child.stdout.on('data', (data) => {
      console.log('stdout:\n' + data);
    });

    child.stderr.on('data', (data) => {
      console.log('stderr:\n' + data);
    });

    child.on('error', (err) => {
      console.log('err:\n' + err);
      reject(new HttpError('Something went wrong while restoring DB.', 500));
    });

    child.on('exit', (code, signal) => {
      if (code) {
        reject(new HttpError(`Process exit with code: ${code}`, 500));
      } else if (signal) {
        reject(new HttpError(`Process killed with signal: ${signal}`, 500));
      } else {
        resolve({ message: 'DB restore is successful <3', status: 200 });
      }
    });
  });
};

const backup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await backupMongoDB();
    console.log(response);

    return res.status(response.status).json({ message: response.message, success: true });
  } catch (error) {
    next(error);
  }
};

const restore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await restoreMongoDB();

    return res.status(response.status).json({ message: response.message, success: true });
  } catch (error) {
    next(error);
  }
};

cron.schedule('0 0 * * *', async () => {
  try {
    await backupMongoDB();
    await restoreMongoDB();
  } catch (error) {
    console.error('An error occurred during backup and restore:', error);
  }
});

export { backup, restore };
