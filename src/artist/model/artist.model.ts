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

  @Prop()
  dob: Date;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop()
  bio: string;

  @Prop()
  profileImage: string;

  @Prop()
  genre: string;

  @Prop()
  followers: number;

  @Prop()
  socialLinks: { name: string; url: string }[];

  @Prop({
    default: 0,
  })
  revenue: number;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
