import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MxzDocument = HydratedDocument<Mxz>;

@Schema()
export class Mxz {
  @Prop()
  level: string;
  @Prop()
  username: string;
  @Prop()
  time: Date;
  @Prop()
  log: string;
}

export const MxzSchema = SchemaFactory.createForClass(Mxz);
