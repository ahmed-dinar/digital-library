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

export enum BookQueryType {
  FILTER,
  SORT
}

/**
 * Supported query and filters to parse from url query params
 */
export const BookQueryKey: { [k: string]: BookQueryType } = {
  title: BookQueryType.FILTER,
  summary: BookQueryType.FILTER,
  isbn: BookQueryType.FILTER,
  author: BookQueryType.FILTER,
  authorId: BookQueryType.FILTER,
  genre: BookQueryType.FILTER,
  genreId: BookQueryType.FILTER,
  publisher: BookQueryType.FILTER,
  publicationYear: BookQueryType.FILTER,
  sort: BookQueryType.SORT,
};

export interface BookQueryDto {
  key: string,
  value: string,
  type: BookQueryType
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
