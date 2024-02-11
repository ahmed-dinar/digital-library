import { IsInt, IsOptional, IsString } from 'class-validator';
import { AuthorDto } from '../../author/dto/author.dto';
import { GenreDto } from '../../genre/dto/genre.dto';

export interface BookDto {
  id: number;
  title: string;
  summary?: string;
  publisher?: string;
  publicationYear: number;
  authors: AuthorDto[];
  genres: GenreDto[];
  editions: BookEditionDto[];
}

export class BookFilterDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsString()
  @IsOptional()
  isbn?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  authorId?: string;

  @IsString()
  @IsOptional()
  genre?: string;

  @IsString()
  @IsOptional()
  genreId?: string;

  @IsString()
  @IsOptional()
  publisher?: string;

  @IsOptional()
  @IsInt()
  publicationYear?: number;
}

export interface BookEditionDto {
  id: number;
  isbn: string;
  value: string;
}
