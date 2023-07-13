import { Admin } from './admin/model/admin.model';
import { Artist } from './artist/model/artist.model';
import { User } from './user/model/user.model';
declare module 'express' {
  export interface Request {
    user: User & { accessToken: string } & { refreshToken: string };
  }
}
