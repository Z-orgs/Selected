import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PlaylistDocument = HydratedDocument<Playlist>;

@Schema()
export class Playlist {
  @Prop()
  title: string;
  @Prop()
  titleUnaccented: string;
  @Prop()
  owner: string;
  @Prop()
  tracks: string[];
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);
