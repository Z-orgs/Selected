import { Admin } from './admin/model/admin.model';
import { User } from './user/model/user.model';
declare module 'express' {
  export interface Request {
    user: User | Admin;
  }
}
