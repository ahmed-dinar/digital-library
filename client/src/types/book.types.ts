import {AuthorDto} from "@/types/author.types";
import {GenreDto} from "@/types/genre.types";

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

export interface BookFilterDto {
  title?: string;
  isbn?: string;
  author?: string;
  genre?: string;
  publisher?: string;
  publicationYear?: number;
}

export interface BookEditionDto {
  id: number;
  isbn: string;
  value: string;
}

export interface CreateBookDto {
  title: string;
  publicationYear: number;
  summary?: string;
  authorIds?: number[];
  genreIds?: number[];
  isbns?: string[];
  publisher?: string;
}
