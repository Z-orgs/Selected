import { IsNotEmpty } from 'class-validator';

export class NextMessageDto {
  @IsNotEmpty()
  currentTrackId: string;
}
