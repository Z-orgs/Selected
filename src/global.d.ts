import { Request } from 'express';
import { User } from './user/user.model';
declare module 'express' {
  export interface Request {
    user: User;
  }
}
