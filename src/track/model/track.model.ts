import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TrackDocument = Track & Document;

@Schema()
export class Track {
  @Prop()
  filename: string;
  @Prop()
  title: string;
  @Prop()
  genre?: string;
  @Prop()
  release?: Date;
  // @Prop()
  // duration: number;
  // @Prop()
  // lyrics?: string;
  @Prop()
  uploaded: Date;
  @Prop()
  fileId: string;
  @Prop()
  status: string;
  @Prop()
  artist: string;
}
export const TrackSchema = SchemaFactory.createForClass(Track);
