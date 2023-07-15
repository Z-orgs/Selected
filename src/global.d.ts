import { User } from './user/model/user.model';
declare module 'express' {
  export interface Request {
    user: User & { accessToken: string } & { refreshToken: string };
  }
}
