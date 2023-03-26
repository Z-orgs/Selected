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
  @Prop({ default: [] })
  following: [string];
  @Prop({ default: [] })
  playList: [string];
  @Prop({ default: [] })
  liked: [string];
}

export const UserSchema = SchemaFactory.createForClass(User);
