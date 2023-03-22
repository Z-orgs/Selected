import { IsNotEmpty } from 'class-validator';

export class CreateTrackDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  genre?: string;
  @IsNotEmpty()
  release?: Date;
  @IsNotEmpty()
  public: boolean;
  //   @IsNotEmpty()
  //   duration: number;
  //   @IsNotEmpty()
  //   lyrics?: string;
}
