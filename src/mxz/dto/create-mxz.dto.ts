import { IsNotEmpty } from 'class-validator';

export class CreateMxzDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  level: string;
  @IsNotEmpty()
  log: string;
}
