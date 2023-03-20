import { IsNotEmpty } from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty()
  firstName: string;
  @IsNotEmpty()
  lastName: string;
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
}
