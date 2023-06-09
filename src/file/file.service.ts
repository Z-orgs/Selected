import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import { Model } from 'mongoose';
import { Artist, ArtistDocument } from 'src/artist/model/artist.model';
import { SELECTED } from 'src/constants';
import { Track, TrackDocument } from 'src/track/model/track.model';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(Track.name) private readonly trackModel: Model<TrackDocument>,
    @InjectModel(Artist.name)
    private readonly artistModel: Model<ArtistDocument>,
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
        await this.artistModel.updateOne(
          { username: track.artist },
          {
            $inc: {
              revenue: SELECTED.UnitPrice,
            },
          },
        );
      }
    } catch (error) {
      console.log(error);
      res.setHeader('Content-Type', 'text/plain');
      res.status(500).send('Internal Server Error');
    }
  }
}
