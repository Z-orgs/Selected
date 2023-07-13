import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import { Model } from 'mongoose';
import { SELECTED } from 'src/constants';
import { Track, TrackDocument } from 'src/track/model/track.model';
import { User, UserDocument } from '../user/model/user.model';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(Track.name) private readonly trackModel: Model<TrackDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}
  upload(files: Express.Multer.File[]) {
    const response = [];
    files.forEach((file) => {
      const fileResponse = {
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        id: file.id,
        filename: file.filename,
        metadata: file.metadata,
        bucketName: file.bucketName,
        chunkSize: file.chunkSize,
        size: file.size,
        md5: file.md5,
        uploadDate: file.uploadDate,
        contentType: file.contentType,
      };

      response.push(fileResponse);
    });
    return response;
  }

  uploadImage(file: Express.Multer.File) {
    return file.filename;
  }

  async getFile(id: string, res: Response<any, Record<string, any>>) {
    const filePath = `./data/filesElected/${id}`;
    try {
      if (!existsSync(filePath)) {
        res.setHeader('Content-Type', 'text/plain');
        res.status(404).send('File not found');
        return;
      }
      const fileStream = createReadStream(filePath);
      fileStream.pipe(res);
      const track = await this.trackModel.findOne({ fileId: id });
      if (track) {
        await this.trackModel.updateOne(
          { fileId: id },
          {
            $inc: {
              listens: 1,
            },
          },
        );
        await this.userModel.updateOne(
          { email: track.author },
          {
            $inc: {
              revenue: SELECTED.UnitPrice,
            },
          },
        );
        await this.trackModel
          .aggregate([
            { $match: { author: track.author } },
            {
              $group: {
                _id: null,
                totalListens: { $sum: '$listens' },
                totalLikes: { $sum: '$likes' },
              },
            },
            { $project: { _id: 0, totalListens: 1, totalLikes: 1 } },
          ])
          .then(([{ totalListens, totalLikes }]) => {
            return this.userModel.updateOne(
              { email: track.author },
              { totalListens, totalLikes },
            );
          });
      }
    } catch (error) {
      console.log(error);
      res.setHeader('Content-Type', 'text/plain');
      res.status(500).send('Internal Server Error');
    }
  }
}
