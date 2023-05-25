import { Request } from 'express';

export interface IUserDataRequest extends Request {
  user;
}
