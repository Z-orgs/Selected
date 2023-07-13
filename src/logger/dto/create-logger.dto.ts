import { IsNotEmpty } from 'class-validator';

export class CreateLoggerDto {
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  level: string;
  @IsNotEmpty()
  log: string;
}
