export class UpdateInfoTrackDto {
  mimeType: string;

  title: string;

  genre?: string;

  release?: Date;

  duration: number;

  lyrics?: string;

  uploaded: Date;

  cluster: number;
}
