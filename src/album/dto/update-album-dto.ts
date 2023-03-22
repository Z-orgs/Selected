import { IsNotEmpty } from 'class-validator';

export class UpdateAlbumDto {
  title: string;

  genre?: string;

  release?: Date;

  tracks: string[];

  public: boolean;
}
