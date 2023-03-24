import { IsNotEmpty } from 'class-validator';

export class CreateLoggerDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  level: string;
  @IsNotEmpty()
  log: string;
}
