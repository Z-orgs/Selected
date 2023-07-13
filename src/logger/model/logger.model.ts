import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LoggerDocument = HydratedDocument<Logger>;

@Schema()
export class Logger {
  @Prop()
  level: string;
  @Prop()
  email: string;
  @Prop()
  time: Date;
  @Prop()
  log: string;
}

export const LoggerSchema = SchemaFactory.createForClass(Logger);
