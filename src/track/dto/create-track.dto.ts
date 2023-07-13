import { IsNotEmpty } from 'class-validator';

export class CreateTrackDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  genre?: string;
  @IsNotEmpty()
  release?: Date;
  @IsNotEmpty()
  isPublic: boolean;
  //   @IsNotEmpty()
  //   duration: number;
  //   @IsNotEmpty()
  //   lyrics?: string;
}
