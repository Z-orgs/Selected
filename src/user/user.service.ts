import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Artist, ArtistDocument } from 'src/artist/model/artist.model';
import { User, UserDocument } from './model/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Artist.name)
    private readonly artistModel: Model<ArtistDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async followArtist(user: User, artistId: string) {
    const artist = await this.artistModel.findById({ _id: artistId });
    if (!artist) {
      return new HttpException(
        'This artist does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.userModel.findOneAndUpdate(
      { email: user.email },
      { $addToSet: { following: artistId } },
    );
    await this.artistModel.updateOne(
      { _id: artistId },
      { $inc: { followers: 1 } },
    );
    return new HttpException(
      `${user.email} has followed artist ${artistId}`,
      HttpStatus.ACCEPTED,
    );
  }
  async unfollowArtist(user: User, artistId: string) {
    const artist = await this.artistModel.findById({ _id: artistId });
    if (!artist) {
      return new HttpException(
        'This artist does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.userModel.findOneAndUpdate(
      { email: user.email },
      { $pull: { following: artistId } },
    );
    await this.artistModel.updateOne(
      { _id: artistId },
      { $inc: { followers: -1 } },
    );
    return new HttpException(
      `${user.email} has unfollowed artist ${artistId}`,
      HttpStatus.ACCEPTED,
    );
  }
  async unlikeTrack(user: User, id: string) {
    const track = await this.userModel.findOne({ email: user.email });
    if (!track) {
      return new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    await this.userModel.updateOne(
      { email: user.email },
      { $pull: { liked: id } },
    );
    return new HttpException('unliked', HttpStatus.ACCEPTED);
  }
  async likeTrack(user: User, id: string) {
    const track = await this.userModel.findOne({ email: user.email });
    if (!track) {
      return new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    await this.userModel.updateOne(
      { email: user.email },
      { $addToSet: { liked: id } },
    );
    return new HttpException('liked', HttpStatus.ACCEPTED);
  }
}
