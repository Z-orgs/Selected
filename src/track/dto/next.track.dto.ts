import { IsNotEmpty } from 'class-validator';

export class NextTrackDto {
  @IsNotEmpty()
  currentTrackId: string;

  album: string;

  playlist: string;
}
