import { IsNotEmpty } from 'class-validator';

export class UpdateStatusTrack {
  @IsNotEmpty() trackId: string;
  @IsNotEmpty() status: string;
}
