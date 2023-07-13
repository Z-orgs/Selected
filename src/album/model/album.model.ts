import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AlbumDocument = HydratedDocument<Album>;

@Schema()
export class Album {
  @Prop()
  title: string;
  @Prop()
  titleUnaccented: string;
  @Prop()
  author: string;
  @Prop()
  genre?: string;
  @Prop()
  release?: Date;
  @Prop()
  coverArtUrl?: string;
  @Prop()
  tracks: string[];
  @Prop()
  isPublic: boolean;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
