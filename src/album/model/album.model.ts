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
  artist: string;
  @Prop()
  genre?: string;
  @Prop()
  release?: Date;
  @Prop()
  coverArtUrl?: string;
  @Prop()
  tracks: string[];
  @Prop()
  public: boolean;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
