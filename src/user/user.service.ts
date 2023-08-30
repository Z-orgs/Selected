import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './model/user.model';
import { Track, TrackDocument } from 'src/track/model/track.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Track.name) private readonly trackModel: Model<TrackDocument>,
  ) {}
  async followArtist(user: User, artistId: string) {
    const artist = await this.userModel.findById({ _id: artistId });
    if (!artist) {
      return new HttpException(
        'This artist does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    const currentUser = (
      await this.userModel.findOne({ email: user.email })
    ).toObject();
    if (currentUser.following.indexOf(artistId) !== -1) {
      return;
    }
    await this.userModel.findOneAndUpdate(
      { email: user.email },
      { $addToSet: { following: artistId } },
    );
    await this.userModel.updateOne(
      { _id: artistId },
      { $inc: { followers: 1 } },
    );
    return new HttpException(
      `${user.email} has followed artist ${artistId}`,
      HttpStatus.ACCEPTED,
    );
  }
  async unfollowArtist(user: User, artistId: string) {
    const artist = await this.userModel.findById({ _id: artistId });
    if (!artist) {
      return new HttpException(
        'This artist does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    const currentUser = (
      await this.userModel.findOne({ email: user.email })
    ).toObject();
    if (currentUser.following.indexOf(artistId) === -1) {
      return;
    }
    await this.userModel.findOneAndUpdate(
      { email: user.email },
      { $pull: { following: artistId } },
    );
    await this.userModel.updateOne(
      { _id: artistId },
      { $inc: { followers: -1 } },
    );
    return new HttpException(
      `${user.email} has unfollowed artist ${artistId}`,
      HttpStatus.ACCEPTED,
    );
  }
  async unlikeTrack(user: User, id: string) {
    const track = await this.trackModel.findById(id);
    if (!track) {
      return new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    const currentUser = (
      await this.userModel.findOne({ email: user.email })
    ).toObject();
    if (currentUser.liked.indexOf(track.id) === -1) {
      return;
    }
    await this.userModel.updateOne(
      { email: user.email },
      { $pull: { liked: id } },
    );
    await this.trackModel.updateOne(
      {
        _id: track.id,
      },
      { $inc: { likes: -1 } },
    );
    return new HttpException('unliked', HttpStatus.ACCEPTED);
  }
  async likeTrack(user: User, id: string) {
    const track = await this.trackModel.findById(id);
    if (!track) {
      return new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    const currentUser = (
      await this.userModel.findOne({ email: user.email })
    ).toObject();
    if (currentUser.liked.indexOf(track.id) !== -1) {
      return;
    }
    await this.userModel.updateOne(
      { email: user.email },
      { $addToSet: { liked: id } },
    );
    await this.trackModel.updateOne(
      {
        _id: track.id,
      },
      { $inc: { likes: 1 } },
    );
    return new HttpException('liked', HttpStatus.ACCEPTED);
  }
  async getLikeList(user: User) {
    const tracks = (
      await this.userModel.findOne({ email: user.email }).select('liked')
    ).toObject().liked;
    return await Promise.all(
      tracks.map(async (track) => {
        return await this.trackModel.findById(track);
      }),
    );
  }
  async getCurrentUser(user: User) {
    const currentUser = await this.userModel.findOne({ email: user.email });
    delete currentUser.refreshTokens;
    return currentUser.toObject();
  }
}
