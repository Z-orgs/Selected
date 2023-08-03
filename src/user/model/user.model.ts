import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SocialLink } from './social.links';
import { Role } from '../../auth/role/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  // User fields
  @Prop()
  email: string;
  @Prop()
  firstName: string;
  @Prop()
  lastName: string;
  @Prop()
  name: string;
  @Prop()
  picture: string;
  @Prop({ default: [] })
  following: [string];
  @Prop()
  code: string;
  @Prop({ default: [] })
  playList: [string];
  @Prop({ default: [] })
  liked: [string];
  @Prop({ default: [] })
  prev: [string];
  @Prop({ default: [] })
  refreshTokens: string[];
  @Prop({ default: [Role.User] })
  roles: Role[];

  // Artist fields
  @Prop()
  nickName: string;
  @Prop()
  nickNameUnaccented: string;
  @Prop()
  dob: Date;
  @Prop()
  phone: string;
  @Prop()
  address: string;
  @Prop()
  bio: string;
  @Prop()
  profileImage: string;
  @Prop()
  genre: string;
  @Prop({ default: 0 })
  followers: number;
  @Prop()
  socialLinks: SocialLink[];
  @Prop({ default: 0 })
  revenue: number;
  @Prop({ default: 0 })
  totalListens: number;
  @Prop({ default: 0 })
  totalLikes: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
