import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TrackDocument = HydratedDocument<Track>;

@Schema()
export class Track {
  @Prop()
  filename: string;
  @Prop()
  title: string;
  @Prop()
  titleUnaccented: string;
  @Prop()
  genre: string;
  @Prop()
  release: Date;
  @Prop()
  uploaded: Date;
  @Prop()
  fileId: string;
  @Prop()
  duration: number;
  @Prop()
  status: boolean;
  @Prop()
  author: string;
  @Prop()
  isPublic: boolean;
  @Prop({
    default: 0,
  })
  listens: number;
  @Prop()
  album: string;
  @Prop({
    default: 0,
  })
  likes: number;
  @Prop()
  path: string;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
