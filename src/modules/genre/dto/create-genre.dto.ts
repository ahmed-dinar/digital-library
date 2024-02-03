import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateGenreDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  name: string;
}
