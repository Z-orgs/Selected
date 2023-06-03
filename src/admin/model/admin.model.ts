import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema()
export class Admin {
  @Prop()
  firstName: string;
  @Prop()
  lastName: string;
  @Prop()
  username: string;
  @Prop()
  password: string;
  @Prop()
  salt: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
