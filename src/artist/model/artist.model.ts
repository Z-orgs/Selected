import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ArtistDocument = HydratedDocument<Artist>;

@Schema()
export class Artist {
  @Prop()
  firstName: string;
  @Prop()
  lastName: string;
  @Prop()
  nickName: string;
  @Prop()
  username: string;
  @Prop()
  password: string;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
