import { IsNotEmpty } from 'class-validator';

export class MessagePlayDto {
  @IsNotEmpty()
  trackId: string;
  // loop: string;
  // speed: number;
}
