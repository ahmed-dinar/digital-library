import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAuthorDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  name: string;
}
