import { IsNotEmpty } from 'class-validator';

export class CreatePlaylistDto {
  @IsNotEmpty()
  title: string;
  tracks: string;
}
