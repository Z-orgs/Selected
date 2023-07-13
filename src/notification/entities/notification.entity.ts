import { IsNotEmpty } from 'class-validator';

export class Notification {
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  level: string;
  @IsNotEmpty()
  log: string;
}
