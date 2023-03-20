import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  email: string;
  @Prop()
  firstName: string;
  @Prop()
  lastName: string;
  @Prop()
  picture: string;
  @Prop()
  jwt: string;
  @Prop()
  following: [string];
  @Prop()
  playList: [string];
}

export const UserSchema = SchemaFactory.createForClass(User);
