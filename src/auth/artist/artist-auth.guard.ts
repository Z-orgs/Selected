import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { compare } from 'bcrypt';
import { Model } from 'mongoose';
import { Strategy } from 'passport-local';
import { Artist, ArtistDocument } from 'src/artist/model/artist.model';

@Injectable()
export class ArtistAuthGuard extends AuthGuard('artist') {}

@Injectable()
export class ArtistStrategy extends PassportStrategy(Strategy, 'artist') {
  constructor(
    @InjectModel(Artist.name)
    private readonly artistModel: Model<ArtistDocument>,
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<Artist> {
    const artist = await this.artistModel.findOne({ username });
    if (!artist) {
      throw new UnauthorizedException();
    }
    if (!(await compare(password, artist.password))) {
      throw new UnauthorizedException();
    }
    return artist;
  }
}
