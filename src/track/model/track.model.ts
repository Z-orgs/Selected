import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type TrackDocument = Track & Document;

@Schema()
export class Track {
  @Prop()
  filename: string;
  @Prop()
  mimeType: string;
  @Prop()
  title: string;
  @Prop()
  genre?: string;
  @Prop()
  release?: Date;
  @Prop()
  duration: number;
  @Prop()
  lyrics?: string;
  @Prop()
  uploaded: Date;
  @Prop()
  cluster: number;
  @Prop()
  fileId: string;
}
export const TrackSchema = SchemaFactory.createForClass(Track);
