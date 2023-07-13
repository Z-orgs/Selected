import { IsNotEmpty } from 'class-validator';

export class CreateAlbumDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  genre?: string;
  @IsNotEmpty()
  release?: Date;
  @IsNotEmpty()
  tracks: string;
  @IsNotEmpty()
  isPublic: boolean;
}
