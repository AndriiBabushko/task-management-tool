import { Request } from 'express';
import { IUserPopulated } from './IUserPopulated.js';

export interface IUserDataRequest extends Request {
  userData: IUserPopulated;
}
