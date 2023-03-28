import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SocialLink } from '../dto/social.links';

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

  @Prop({
    default: 0,
  })
  followers: number;

  @Prop()
  socialLinks: SocialLink[];

  @Prop({
    default: 0,
  })
  revenue: number;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
