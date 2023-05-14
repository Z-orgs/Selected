export class UpdateAlbumDto {
  title: string;

  genre?: string;

  release?: Date;

  tracks: string;

  isPublic: boolean;
}
