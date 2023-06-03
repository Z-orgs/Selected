import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class File extends Document {
  @Prop({ required: true })
  originalname: string;

  @Prop({ required: true })
  encoding: string;

  @Prop({ required: true })
  mimetype: string;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  size: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const FileSchema = SchemaFactory.createForClass(File);
