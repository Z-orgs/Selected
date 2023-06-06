import { IsNotEmpty } from 'class-validator';

export class Notification {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  level: string;
  @IsNotEmpty()
  log: string;
}
