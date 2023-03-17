import { IsNotEmpty } from 'class-validator';

export class MessageInfoDto {
  @IsNotEmpty()
  trackId: string;
}
